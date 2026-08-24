window.stepInput = function (id, step, precision = 1) {
    const input = document.getElementById(id);
    if (!input) return;
    let val = Number(input.value) + step;
    input.value = precision === 1 ? val : val.toFixed(1);
    if (typeof updateCanvas === "function") updateCanvas();
};

document.getElementById("btnClearHighlight").addEventListener("click", () => {
    const editor = document.getElementById("textEditor");
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) return;

    if (range.collapsed) {
        let node = range.startContainer;
        let el = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;

        let block = el.closest(
            ".dialogue-line, .chat-bubble, .inline-title-block, .inline-subtitle-block, .content-box"
        );
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
    try {
        const presets = localStorage.getItem(PRESET_STORAGE_KEY);
        return presets ? JSON.parse(presets) : {};
    } catch (e) {
        console.error("LocalStorage 읽기 실패:", e);
        return {};
    }
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
        // 캔버스 & 레이아웃 설정
        "ratioSelect",
        "canvasWidth",
        "layoutSelect",
        "midGap",
        "paddingY",
        "paddingX",

        // 카드 제목 / 부제목 / 하단 정보
        "cardTitleInput",
        "titleSize",
        "titleWeight",
        "cardSubtitleInput",
        "subtitleSize",
        "subtitleWeight",
        "titleInput",
        "creatorInput",
        "infoMarginTop",

        // 배경 설정 (그라데이션 및 이미지 오버레이 포함)
        "bgType",
        "gradColor1",
        "gradColor2",
        "gradColor3",
        "gradientDir",
        "bgOverlayColor",
        "bgOverlayOpacity",

        // 타이포그래피 & 본문 스타일 설정
        "fontSelect",
        "alignH",
        "wordBreak",
        "bodyWeight",
        "fontSize",
        "letterSpacing",
        "lineHeight",
        "paraSpacing",
        "fontScaleX",

        // 텍스트 그림자
        "enableTextShadow",
        "textShadowColor",
        "textShadowBlur",

        // 색상 설정 (글자색, 하이라이트, 강조선 등)
        "globalTextColor",
        "subTextColor",
        "hlColorA",
        "hlColorB",
        "hlColorC",
        "quoteLineColorA",
        "quoteLineColorB",

        // 스마트 색상 / 강조 설정
        "enableQuoteColor",
        "quoteColorA",
        "quoteColorB",
        "quoteColorC",
        "enableParenColor",
        "parenColorA",
        "parenColorB",

      // 말풍선 스타일 설정
        "bubbleColorLeft",
        "bubbleTextColorLeft",
        "bubbleColorRight",
        "bubbleTextColorRight",
        "bubbleFontSize",
        "bubbleLineHeight",
        "bubblePadding",
        "bubbleGap",
        "bubbleBgOpacity",
        "bubbleNameGap",
        "bubbleWidth",

        // 스위치 및 토글 설정
        "autoParenBreak",
        "toggleQuotes",
        "toggleProfile",
        "toggleName"
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

    if (typeof chatMembers !== "undefined") {
        presetData["savedMembers"] = chatMembers;
    }

    try {
        const presets = getPresets();
        presets[name] = presetData;
        localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));

        nameInput.value = "";
        renderPresets();
        alert(`'${name}' 디자인 프리셋이 저장되었습니다.`);
    } catch (error) {
        console.error("프리셋 저장 실패:", error);

        if (error.name === "QuotaExceededError" || error.code === 22) {
            alert(
                "❌ 저장 용량 초과!\n\n등록하신 인물의 프로필 이미지 용량이 너무 커서 브라우저 저장공간(5MB)을 넘었습니다.\n인물 관리에서 고용량 사진 대신 저용량 이미지나 기본 아이콘으로 교체한 뒤 다시 시도해 주세요."
            );
        } else {
            alert(`❌ 저장에 실패했습니다.\n에러 내용: ${error.message}`);
        }
    }
};

function applyPreset(name) {
    const presets = getPresets();
    const data = presets[name];
    if (!data) return;

    Object.keys(data).forEach((id) => {
        if (id === "savedMembers") return;

        const el = document.getElementById(id);
        if (!el) return;

        if (el.type === "checkbox") {
            el.checked = data[id];
        } else {
            el.value = data[id];
        }
    });

    if (typeof els !== "undefined") {
        Object.keys(els).forEach((k) => {
            els[k] = document.getElementById(k) || els[k];
        });
    }

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

    if (data["savedMembers"] && Array.isArray(data["savedMembers"]) && typeof chatMembers !== "undefined") {
        chatMembers = JSON.parse(JSON.stringify(data["savedMembers"]));
        if (typeof renderMembers === "function") {
            renderMembers();
        }
    }

    const editorContainer = document.getElementById("textEditor");
    const canvasContainer = document.getElementById("canvasTextWrapper");
    const hasProfile = document.getElementById("toggleProfile")?.checked ?? true;
    const hasName = document.getElementById("toggleName")?.checked ?? true;

    if (editorContainer) {
        editorContainer.classList.toggle("hide-profiles", !hasProfile);
        editorContainer.classList.toggle("hide-names", !hasName);
    }
    if (canvasContainer) {
        canvasContainer.classList.toggle("hide-profiles", !hasProfile);
        canvasContainer.classList.toggle("hide-names", !hasName);
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
