window.stepInput = function (id, step, precision = 1) {
    const input = document.getElementById(id);
    if (!input) return;
    let val = Number(input.value) + step;
    input.value = precision === 1 ? val : val.toFixed(1);
    if (typeof updateCanvas === "function") updateCanvas();
};

// 선택 영역(또는 커서가 위치한 블록)의 모든 서식을 지우고 완전한 기본 텍스트로 되돌린다.
// 굵기·기울임·보조색·형광펜·따옴표/괄호 강조색·강조선·대화 버블을 전부 제거한다.
document.getElementById("btnClearHighlight").addEventListener("click", () => {
    const editor = document.getElementById("textEditor");
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) return;

    // 선택 영역이 없다면(커서만 있다면) 커서가 속한 블록 전체를 대상으로 한다.
    if (range.collapsed) {
        let node = range.startContainer;
        let el = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;

        let block = el.closest(".dialogue-line, .chat-bubble, .inline-title-block, .inline-subtitle-block, .content-box");
        if (!block) {
            let n = el;
            while (n && n.parentNode !== editor) n = n.parentNode;
            block = n;
        }
        if (!block || block === editor) return;

        range = document.createRange();
        range.selectNode(block);
    }

    function toPlainText(node) {
        let out = "";
        node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                out += child.nodeValue;
                return;
            }
            if (child.nodeType !== Node.ELEMENT_NODE) return;

            const tag = child.tagName;
            if (tag === "BUTTON" || child.classList.contains("bubble-flip")) return;
            if (child.classList.contains("bubble-speaker")) return;
            if (tag === "BR") {
                out += "\n";
                return;
            }
            if (tag === "HR") return;

            out += toPlainText(child);

            if (child.classList.contains("chat-bubble") || child.classList.contains("dialogue-line")) {
                out += "\n";
            }
        });
        return out;
    }

    const fragment = range.cloneContents();
    const wrapper = document.createElement("div");
    wrapper.appendChild(fragment);

    let plainText = toPlainText(wrapper).replace(/\n+$/, "");

    range.deleteContents();

    const lines = plainText.split("\n");
    const outputFragment = document.createDocumentFragment();
    lines.forEach((line, idx) => {
        if (idx > 0) outputFragment.appendChild(document.createElement("br"));
        if (line.length > 0) outputFragment.appendChild(document.createTextNode(line));
    });

    if (!outputFragment.hasChildNodes()) {
        outputFragment.appendChild(document.createTextNode(""));
    }

    range.insertNode(outputFragment);
    selection.removeAllRanges();

    if (typeof updateCanvas === "function") updateCanvas();
});

const PRESET_STORAGE_KEY = "excerpt_maker_presets_v2";

function getPresets() {
    const presets = localStorage.getItem(PRESET_STORAGE_KEY);
    return presets ? JSON.parse(presets) : {};
}

function renderPresets() {
    const presetListContainer = document.getElementById("presetList");
    if (!presetListContainer) return;

    presetListContainer.innerHTML = "";
    const presets = getPresets();

    Object.keys(presets).forEach((name) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "preset-item";
        itemDiv.style.cursor = "pointer";

        itemDiv.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON") return;
            applyPreset(name);
        });

        const nameSpan = document.createElement("span");
        nameSpan.textContent = name;

        const delBtn = document.createElement("button");
        delBtn.className = "btn-compact";
        delBtn.style.backgroundColor = "#b7472a";
        delBtn.style.padding = "4px 9px";
        delBtn.style.height = "24px";
        delBtn.innerHTML = "삭제";
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deletePreset(name);
        });

        itemDiv.appendChild(nameSpan);
        itemDiv.appendChild(delBtn);
        presetListContainer.appendChild(itemDiv);
    });
}

window.savePreset = function () {
    const nameInput = document.getElementById("presetNameInput");
    const name = nameInput.value.trim();

    if (!name) {
        alert("프리셋 이름을 입력해주세요.");
        return;
    }

    const targetIds = [
        "ratioSelect",
        "canvasWidth",
        "paddingY",
        "paddingX",
        "bgType",
        "gradColor1",
        "gradColor2",
        "gradColor3",
        "gradientDir",
        "globalTextColor",
        "subTextColor",
        "hlColorA",
        "hlColorB",
        "hlColorC",
        "quoteLineColorA",
        "quoteLineColorB",
        "bubbleColorLeft",
        "bubbleTextColorLeft",
        "bubbleColorRight",
        "bubbleTextColorRight",
        "enableQuoteColor",
        "quoteColorA",
        "quoteColorB",
        "enableParenColor",
        "parenColorA",
        "parenColorB",
        "fontSelect",
        "alignH",
        "wordBreak",
        "bodyWeight",
        "fontSize",
        "letterSpacing",
        "lineHeight",
        "paraSpacing",
        "fontScaleX",
        "titleSize",
        "titleWeight",
        "subtitleSize",
        "subtitleWeight",
        "enableTextShadow",
        "textShadowColor",
        "textShadowBlur"
    ];

    const presetData = {};
    targetIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (el.type === "checkbox") {
            presetData[id] = el.checked;
        } else {
            presetData[id] = el.value;
        }
    });

    const presets = getPresets();
    presets[name] = presetData;
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));

    nameInput.value = "";
    renderPresets();
    alert(`'${name}' 디자인 프리셋이 저장되었습니다.`);
};

function applyPreset(name) {
    const presets = getPresets();
    const data = presets[name];
    if (!data) return;

    Object.keys(data).forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (el.type === "checkbox") {
            el.checked = data[id];
        } else {
            el.value = data[id];
        }
    });

    const alignVal = data["alignH"];
    if (alignVal) {
        const segControl = document.querySelector(`.segmented-control[data-target="alignH"]`);
        if (segControl) {
            segControl.querySelectorAll("button").forEach((b) => {
                if (b.getAttribute("data-value") === alignVal) {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });
        }
    }

    if (typeof syncLiveHighlights === "function") {
        syncLiveHighlights(data);
    }

    if (typeof updateCanvas === "function") {
        updateCanvas();
    }
    alert(`'${name}' 디자인 프리셋이 적용되었습니다.`);
}

function deletePreset(name) {
    if (!confirm(`'${name}' 프리셋을 삭제하시겠습니까?`)) return;

    const presets = getPresets();
    delete presets[name];
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));

    renderPresets();
}

document.addEventListener("DOMContentLoaded", () => {
    renderPresets();
});
