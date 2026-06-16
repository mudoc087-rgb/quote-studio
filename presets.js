// ==========================================
// 1. 증감 컴포넌트 핸들러 함수 (글로벌 바인딩)
// ==========================================
window.stepInput = function (id, step, precision = 1) {
    const input = document.getElementById(id);
    if (!input) return;
    let val = Number(input.value) + step;
    input.value = precision === 1 ? val : val.toFixed(1);
    if (typeof updateCanvas === "function") updateCanvas();
};

// ==========================================
// 2. 효과 지우기 커스텀 비즈니스 로직
// ==========================================
document.getElementById("btnClearHighlight").addEventListener("click", () => {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let current = range.startContainer;

    while (current && current !== document.getElementById("textEditor")) {
        if (current.nodeType === Node.ELEMENT_NODE) {
            if (current.classList.contains("dialogue-line")) {
                const parent = current.parentNode;
                while (current.firstChild) {
                    parent.insertBefore(current.firstChild, current);
                }
                parent.removeChild(current);
                break;
            }
            if (current.style.backgroundColor || current.tagName === "SPAN" || current.tagName === "FONT") {
                if (current.style.backgroundColor || current.getAttribute("color")) {
                    const parent = current.parentNode;
                    while (current.firstChild) {
                        parent.insertBefore(current.firstChild, current);
                    }
                    parent.removeChild(current);
                    break;
                }
            }
        }
        current = current.parentNode;
    }
    if (typeof updateCanvas === "function") updateCanvas();
});

// ==========================================
// 3. 프리셋 관리 코어 알고리즘 (HTML 타겟 복원 완료)
// ==========================================
const PRESET_STORAGE_KEY = "quote_generator_presets";

function getPresets() {
    const presets = localStorage.getItem(PRESET_STORAGE_KEY);
    return presets ? JSON.parse(presets) : {};
}

// 프리셋 UI 렌더링 함수 (스타일 마감 클래스 매핑 완료)
function renderPresets() {
    const presetListContainer = document.getElementById("presetList"); // HTML 파일의 실제 ID와 동기화
    if (!presetListContainer) return;

    presetListContainer.innerHTML = "";
    const presets = getPresets();

    Object.keys(presets).forEach((name) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "preset-item"; // CSS 연동 마감 컴포넌트 적용
        itemDiv.style.cursor = "pointer";

        // 클릭 시 프리셋 불러오기 매핑
        itemDiv.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON") return; // 삭제 버튼 영역 터치 무시
            applyPreset(name);
        });

        const nameSpan = document.createElement("span");
        nameSpan.textContent = name;

        const delBtn = document.createElement("button");
        delBtn.className = "btn-compact";
        delBtn.style.backgroundColor = "#ef4444";
        delBtn.style.padding = "2px 8px";
        delBtn.style.height = "22px";
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

// 현재 세팅을 프리셋으로 저장 (HTML 인라인 명칭 대응 바인딩 완료)
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
        "bgColor1",
        "gradColor1",
        "gradColor2",
        "gradColor3",
        "gradientDir",
        "globalTextColor",
        "hlColor",
        "quoteLineColor",
        "enableQuoteColor",
        "quoteColor",
        "enableParenColor",
        "parenColor",
        "fontSelect",
        "alignH",
        "wordBreak",
        "fontSize",
        "letterSpacing",
        "lineHeight",
        "paraSpacing",
        "fontScaleX"
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

    const activeGradMode = document.querySelector('input[name="gradMode"]:checked');
    if (activeGradMode) {
        presetData["gradMode"] = activeGradMode.value;
    }

    const presets = getPresets();
    presets[name] = presetData;
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));

    nameInput.value = "";
    renderPresets();
    alert(`'${name}' 디자인 프리셋이 안전하게 보관함에 등록되었습니다.`);
};

// 프리셋 로드 및 하이라이트 UI 연동 복원
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

    if (data["gradMode"]) {
        const radio = document.querySelector(`input[name="gradMode"][value="${data["gradMode"]}"]`);
        if (radio) radio.checked = true;
    }

    // 세그먼트 가로 버튼 정렬 활성화 클래스 상태 복원
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

    if (typeof updateCanvas === "function") {
        updateCanvas();
    }
    alert(`'${name}' 디자인 프리셋 스킨이 캔버스에 적용되었습니다.`);
}

function deletePreset(name) {
    if (!confirm(`'${name}' 프리셋을 영구 보관함에서 삭제하시겠습니까?`)) return;

    const presets = getPresets();
    delete presets[name];
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));

    renderPresets();
}

// 돔 로드 완료 시 프리셋 바인딩 초기 구동
document.addEventListener("DOMContentLoaded", () => {
    renderPresets();
});
