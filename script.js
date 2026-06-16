// ==========================================
// 1. DOM 요소 래핑 객체 (px 단위 매핑 완료)
// ==========================================
const els = {
    editor: document.getElementById("textEditor"),
    titleInput: document.getElementById("titleInput"),
    creatorInput: document.getElementById("creatorInput"),
    ratioSelect: document.getElementById("ratioSelect"),
    canvasWidth: document.getElementById("canvasWidth"),
    paddingY: document.getElementById("paddingY"),
    paddingX: document.getElementById("paddingX"),
    bgType: document.getElementById("bgType"),
    bgColor1: document.getElementById("bgColor1"),
    gradColor1: document.getElementById("gradColor1"),
    gradColor2: document.getElementById("gradColor2"),
    gradColor3: document.getElementById("gradColor3"),
    gradientDir: document.getElementById("gradientDir"),
    globalTextColor: document.getElementById("globalTextColor"),
    hlColor: document.getElementById("hlColor"),
    quoteLineColor: document.getElementById("quoteLineColor"),
    enableQuoteColor: document.getElementById("enableQuoteColor"),
    quoteColor: document.getElementById("quoteColor"),
    enableParenColor: document.getElementById("enableParenColor"),
    parenColor: document.getElementById("parenColor"),
    fontSelect: document.getElementById("fontSelect"),
    alignH: document.getElementById("alignH"),
    wordBreak: document.getElementById("wordBreak"),
    tabs: document.querySelectorAll(".tab-btn"),
    panels: document.querySelectorAll(".tab-panel"),
    fontSize: document.getElementById("fontSize"),
    letterSpacing: document.getElementById("letterSpacing"),
    lineHeight: document.getElementById("lineHeight"),
    paraSpacing: document.getElementById("paraSpacing"),
    fontScaleX: document.getElementById("fontScaleX"),
    captureArea: document.getElementById("captureArea")
};

// ==========================================
// 2. 핵심 실시간 캔버스 렌더링 함수
// ==========================================
function updateCanvas() {
    if (!els.captureArea) return;

    // --- [1] 캔버스 크기 및 비율 정책 설정 ---
    const ratio = els.ratioSelect.value;
    els.captureArea.style.width = "";
    els.captureArea.style.height = "";
    els.captureArea.style.aspectRatio = "";

    if (ratio === "free") {
        const customW = els.canvasWidth.value || 520;
        els.captureArea.style.width = `${customW}px`;
        els.captureArea.style.height = "auto";
        els.captureArea.style.maxHeight = "none";
        els.captureArea.style.margin = "auto";
    } else {
        const [wStr, hStr] = ratio.split(":");
        const w = parseInt(wStr),
            h = parseInt(hStr);
        els.captureArea.style.width = "600px";
        els.captureArea.style.aspectRatio = `${w} / ${h}`;
        els.captureArea.style.maxHeight = "100%";
        els.captureArea.style.margin = "";
    }

    // --- [2] 패딩 및 배경 조절 ---
    els.captureArea.style.padding = `${els.paddingY.value}px ${els.paddingX.value}px`;

    if (els.bgType.value === "solid") {
        document.getElementById("solidColorArea").style.display = "grid";
        document.getElementById("gradientColorArea").style.display = "none";
        els.captureArea.style.background = els.bgColor1.value;
    } else {
        document.getElementById("solidColorArea").style.display = "none";
        document.getElementById("gradientColorArea").style.display = "flex";

        const gradModeActive = document.querySelector('input[name="gradMode"]:checked')?.value;
        const grad3Wrapper = document.getElementById("grad3Wrapper");

        if (gradModeActive === "3") {
            if (grad3Wrapper) grad3Wrapper.style.display = "flex";
            els.captureArea.style.background = `linear-gradient(${els.gradientDir.value}, ${els.gradColor1.value}, ${els.gradColor2.value}, ${els.gradColor3.value})`;
        } else {
            if (grad3Wrapper) grad3Wrapper.style.display = "none";
            els.captureArea.style.background = `linear-gradient(${els.gradientDir.value}, ${els.gradColor1.value}, ${els.gradColor2.value})`;
        }
    }

    // --- [3] 텍스트 스타일 렌더링 및 레이아웃 깨짐 방지 ---
    const textWrapper = document.getElementById("canvasTextWrapper");
    if (textWrapper) {
        let rawHTML = els.editor.innerHTML || "<div><br></div>";
        textWrapper.innerHTML = rawHTML;

        // 구조 파싱 정형화 엔진 구동
        normalizeParagraphs(textWrapper);

        // 대사 강조선 컴포넌트 실시간 색상 동기화
        textWrapper.style.setProperty("--quote-line-color", els.quoteLineColor.value);
        if (els.editor) {
            els.editor.style.setProperty("--quote-line-color", els.quoteLineColor.value);
        }

        // 독립형 스마트 기호 텍스트 컬러 하이라이팅 적용
        applySmartHighlighting(textWrapper);

        // [서식 체인 바인딩 최적화] 기본 서식을 부여하여 하위 노드까지 폰트 강제 상속
        textWrapper.style.fontFamily = els.fontSelect.value;
        textWrapper.style.fontSize = `${els.fontSize.value}px`;
        textWrapper.style.textAlign = els.alignH.value;
        textWrapper.style.letterSpacing = `${els.letterSpacing.value}px`;
        textWrapper.style.lineHeight = `${els.lineHeight.value}px`;
        textWrapper.style.whiteSpace = "pre-wrap";
        textWrapper.style.wordBreak = els.wordBreak.value;
        textWrapper.style.color = els.globalTextColor.value;

        // 장평 조절 시 레이아웃 여백 왜곡 원천 차단 알고리즘
        const scaleFactor = (parseInt(els.fontScaleX.value) || 100) / 100;
        textWrapper.style.display = "block";
        textWrapper.style.width = `${100 / scaleFactor}%`;
        textWrapper.style.transform = `scaleX(${scaleFactor})`;

        // 정렬 기준에 맞는 수학적 마진 상쇄 및 원점 고정 계산
        if (els.alignH.value === "center") {
            textWrapper.style.transformOrigin = "center top";
            textWrapper.style.marginLeft = `calc((100% - 100% / ${scaleFactor}) / 2)`;
        } else if (els.alignH.value === "right") {
            textWrapper.style.transformOrigin = "right top";
            textWrapper.style.marginLeft = `calc(100% - 100% / ${scaleFactor})`;
        } else {
            textWrapper.style.transformOrigin = "left top";
            textWrapper.style.marginLeft = "0";
        }
    }

    // --- [4] 문단 간격(paraSpacing) 반영 구조 ---
    const allParagraphs = textWrapper.querySelectorAll(
        "#canvasTextWrapper > div, #canvasTextWrapper > p, #canvasTextWrapper > .dialogue-line"
    );
    allParagraphs.forEach((p, idx) => {
        if (idx === allParagraphs.length - 1) {
            p.style.marginBottom = "0px";
            p.style.paddingBottom = "0px";
        } else {
            p.style.marginBottom = `${els.paraSpacing.value}px`;
        }
    });

    // --- [5] 타이틀 / 제작자 인포 레이아웃 정돈 ---
    const infoContainer = document.getElementById("canvasInfo");
    const textContainer = document.getElementById("canvasTextContainer");

    if (infoContainer && textContainer) {
        if (infoContainer.parentNode !== textContainer) {
            textContainer.appendChild(infoContainer);
        }

        if (els.alignH.value === "center") {
            infoContainer.style.justifyContent = "center";
        } else if (els.alignH.value === "right") {
            infoContainer.style.justifyContent = "flex-end";
        } else {
            infoContainer.style.justifyContent = "flex-start";
        }

        let infoHTML = "";
        const baseColor = els.globalTextColor.value;
        const fontName = els.fontSelect.value;
        const computedFontSize = Math.max(11, parseFloat(els.fontSize.value) * 0.7);
        const chipBg = `${baseColor}0f`;

        if (els.titleInput.value.trim()) {
            infoHTML += `
                <span class="info-chip" style="
                    color: ${baseColor}; 
                    font-family: ${fontName}; 
                    font-size: ${computedFontSize}px; 
                    background-color: ${chipBg};
                ">
                    ${els.titleInput.value.trim()}
                </span>`;
        }

        if (els.creatorInput.value.trim()) {
            infoHTML += `
                <span class="info-chip" style="
                    color: ${baseColor}; 
                    opacity: 0.75;
                    font-family: ${fontName}; 
                    font-size: ${computedFontSize}px; 
                    background-color: ${chipBg};
                ">
                    @${els.creatorInput.value.trim()}
                </span>`;
        }

        infoContainer.innerHTML = infoHTML;

        // [추가] 인포 영역에 내용이 아예 없으면 display를 none으로 꺾어 여백 유발 차단
        if (!els.titleInput.value.trim() && !els.creatorInput.value.trim()) {
            infoContainer.style.display = "none";
        } else {
            infoContainer.style.display = "flex";
        }
    }
    // 형광펜 실시간 색상 동기화 호출
    syncLiveHighlights();
}

// ==========================================
// 3. 독립형 고성능 스마트 기호 컬러 매핑 엔진 (서체 결크 상속 보완완료)
// ==========================================
function applySmartHighlighting(container) {
    const hasQuotes = els.enableQuoteColor.checked;
    const hasParens = els.enableParenColor.checked;
    if (!hasQuotes && !hasParens) return;

    const textNodes = [];
    const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while ((n = walk.nextNode())) {
        textNodes.push(n);
    }

    let fullText = "";
    const nodeOffsets = [];
    textNodes.forEach((node) => {
        nodeOffsets.push({
            node: node,
            start: fullText.length,
            end: fullText.length + node.nodeValue.length
        });
        fullText += node.nodeValue;
    });

    const intervals = [];
    if (hasQuotes) {
        const quoteRegex = /("[^"\n]*"|'[^'\n]*'|“[^”\n]*”|「[^」\n]*」|『[^』\n]*』|‹[^›\n]*›|«[^»\n]*»)/g;
        let match;
        while ((match = quoteRegex.exec(fullText)) !== null) {
            intervals.push({ start: match.index, end: match.index + match[0].length, color: els.quoteColor.value });
        }
    }
    if (hasParens) {
        const parenRegex = /(\([^)\n]*\)|\[[^\]\n]*\]|\{[^}\n]*\}|〈[^〉\n]*〉|《[^》\n]*》)/g;
        let match;
        while ((match = parenRegex.exec(fullText)) !== null) {
            intervals.push({ start: match.index, end: match.index + match[0].length, color: els.parenColor.value });
        }
    }

    intervals.sort((a, b) => b.start - a.start);

    intervals.forEach((item) => {
        for (let i = nodeOffsets.length - 1; i >= 0; i--) {
            const info = nodeOffsets[i];
            const overlapStart = Math.max(item.start, info.start);
            const overlapEnd = Math.min(item.end, info.end);

            if (overlapStart < overlapEnd) {
                const localStart = overlapStart - info.start;
                const localEnd = overlapEnd - info.start;
                const node = info.node;
                const text = node.nodeValue;

                const p3 = text.substring(localEnd);
                const p2 = text.substring(localStart, localEnd);
                const p1 = text.substring(0, localStart);

                const parent = node.parentNode;
                const span = document.createElement("span");
                span.style.color = item.color;
                span.style.fontWeight = "inherit";
                // [핵심 추가] 동적으로 분해 재조립된 칩에도 설정창의 글꼴 패밀리가 끊기지 않고 상속 강제 주입
                span.style.fontFamily = "inherit";
                span.style.backgroundColor = "transparent";
                span.textContent = p2;

                let nextSibling = node.nextSibling;
                if (p3.length > 0) {
                    const t3 = document.createTextNode(p3);
                    parent.insertBefore(t3, nextSibling);
                    nextSibling = t3;
                }
                parent.insertBefore(span, nextSibling);

                if (p1.length > 0) {
                    node.nodeValue = p1;
                } else {
                    parent.removeChild(node);
                }
            }
        }
    });
}

// 형광펜 색상 실시간 전체 동기화 함수
function syncLiveHighlights() {
    const textWrapper = document.getElementById("canvasTextWrapper");
    if (!textWrapper) return;

    const spans = textWrapper.getElementsByTagName("span");
    for (let span of spans) {
        if (
            span.style.backgroundColor &&
            span.style.backgroundColor !== "transparent" &&
            span.style.backgroundColor !== "initial"
        ) {
            span.style.backgroundColor = els.hlColor.value;
        }
    }
}

// ==========================================
// 4. 에디터 툴바 컴포넌트 액션 바인딩
// ==========================================
document.getElementById("btnBold").addEventListener("click", () => {
    document.execCommand("bold", false, null);
    updateCanvas();
});
document.getElementById("btnItalic").addEventListener("click", () => {
    document.execCommand("italic", false, null);
    updateCanvas();
});
document.getElementById("btnHighlight").addEventListener("click", () => {
    document.execCommand("backColor", false, els.hlColor.value);
    updateCanvas();
});
document.getElementById("btnQuoteLine").addEventListener("click", () => {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let block = range.commonAncestorContainer;
    while (block && block.nodeType !== Node.ELEMENT_NODE) {
        block = block.parentNode;
    }
    if (block && block.id !== "textEditor") {
        if (block.classList.contains("dialogue-line")) {
            block.classList.remove("dialogue-line");
        } else {
            block.classList.add("dialogue-line");
        }
    } else {
        let div = document.createElement("div");
        div.classList.add("dialogue-line");
        div.appendChild(range.extractContents());
        range.insertNode(div);
    }
    updateCanvas();
});
els.editor.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const node = selection.anchorNode;
        const inDialogue = (node.nodeType === 3 ? node.parentNode : node).closest(".dialogue-line");

        if (inDialogue) {
            e.preventDefault();
            document.execCommand("insertLineBreak");
        }
    }
});

// ==========================================
// 5. 초기 부팅 및 컴포넌트 이벤트 통합 관리
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    els.tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-target");
            const targetPanel = document.getElementById(targetId);
            const subWindow = document.querySelector(".adaptive-settings-window");

            if (tab.classList.contains("active")) {
                tab.classList.remove("active");
                if (targetPanel) targetPanel.classList.remove("active");
                if (subWindow) subWindow.classList.remove("active");
            } else {
                els.tabs.forEach((t) => t.classList.remove("active"));
                els.panels.forEach((p) => p.classList.remove("active"));

                tab.classList.add("active");
                if (targetPanel) targetPanel.classList.add("active");
                if (subWindow) subWindow.classList.add("active");
            }
        });
    });

    document.querySelectorAll(".segmented-control button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const parent = btn.parentElement;
            parent.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const hiddenInput = document.getElementById(parent.getAttribute("data-target"));
            if (hiddenInput) {
                hiddenInput.value = btn.getAttribute("data-value");
                updateCanvas();
            }
        });
    });

    document.querySelectorAll('input[name="gradMode"]').forEach((radio) => {
        radio.addEventListener("change", () => {
            updateCanvas();
        });
    });

    els.ratioSelect.addEventListener("change", () => {
        const customArea = document.getElementById("customWidthArea");
        if (customArea) {
            customArea.style.display = els.ratioSelect.value === "free" ? "flex" : "none";
        }
        updateCanvas();
    });

    els.editor.addEventListener("input", updateCanvas);

    if (typeof renderPresets === "function") {
        renderPresets();
    }

    const autoTriggers = [
        els.titleInput,
        els.creatorInput,
        els.canvasWidth,
        els.paddingY,
        els.paddingX,
        els.bgType,
        els.bgColor1,
        els.gradColor1,
        els.gradColor2,
        els.gradColor3,
        els.gradientDir,
        els.globalTextColor,
        els.hlColor,
        els.quoteLineColor,
        els.enableQuoteColor,
        els.quoteColor,
        els.enableParenColor,
        els.parenColor,
        els.fontSelect,
        els.wordBreak,
        els.fontSize,
        els.letterSpacing,
        els.lineHeight,
        els.paraSpacing,
        els.fontScaleX
    ];

    autoTriggers.forEach((element) => {
        if (element) {
            element.addEventListener("input", updateCanvas);
            element.addEventListener("change", updateCanvas);
        }
    });

    // [서체 연동 엔진 버그픽스] 첫 부팅 시 콤보박스에 정의되어 있는 기본 폰트 명칭을 강제로 스캔하여 동기화 가동
    setTimeout(() => {
        updateCanvas();
    }, 50);
});

// ==========================================
// 6. 이미지 클립보드 실제 복사 및 다운로드 기능
// ==========================================
document.getElementById("btnCopy").addEventListener("click", () => {
    if (!els.captureArea) return;
    const originalHeight = els.captureArea.style.height;
    if (els.ratioSelect.value === "free") {
        els.captureArea.style.height = els.captureArea.scrollHeight + "px";
    }

    html2canvas(els.captureArea, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
        .then((canvas) => {
            els.captureArea.style.height = originalHeight;
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert("이미지 변환 실패");
                    return;
                }
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard
                    .write([item])
                    .then(() => {
                        alert("발췌문 이미지가 클립보드에 복사되었습니다!");
                    })
                    .catch(() => {
                        alert("보안 정책으로 이미지 복사가 실패했습니다. 저장 버튼을 이용해 주세요.");
                    });
            }, "image/png");
        })
        .catch(() => {
            els.captureArea.style.height = originalHeight;
        });
});

document.getElementById("btnSave").addEventListener("click", () => {
    if (!els.captureArea) return;
    const originalWidth = els.captureArea.style.width;
    const originalHeight = els.captureArea.style.height;
    if (els.ratioSelect.value === "free") {
        els.captureArea.style.height = els.captureArea.scrollHeight + "px";
    }

    html2canvas(els.captureArea, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
        .then((canvas) => {
            els.captureArea.style.width = originalWidth;
            els.captureArea.style.height = originalHeight;
            const link = document.createElement("a");
            link.download = `excerpt_${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        })
        .catch(() => {
            els.captureArea.style.width = originalWidth;
            els.captureArea.style.height = originalHeight;
        });
});

document.getElementById("bgImageInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById("bgImageLayer").style.backgroundImage = `url(${event.target.result})`;
            updateBgImageStyles();
        };
        reader.readAsDataURL(file);
    }
});

function updateBgImageStyles() {
    const bgLayer = document.getElementById("bgImageLayer");
    const overlayLayer = document.getElementById("bgOverlayLayer");

    bgLayer.style.backgroundSize = `${document.getElementById("bgImageSize").value}%`;
    bgLayer.style.backgroundPosition = `${document.getElementById("bgImageX").value}% ${document.getElementById("bgImageY").value}%`;
    bgLayer.style.filter = `blur(${document.getElementById("bgImageBlur").value}px)`;

    const color = document.getElementById("bgOverlayColor").value;
    const opacity = document.getElementById("bgOverlayOpacity").value;
    overlayLayer.style.backgroundColor = `rgba(${color}, ${opacity})`;
}

["bgImageSize", "bgImageX", "bgImageY", "bgImageBlur", "bgOverlayColor", "bgOverlayOpacity"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateBgImageStyles);
});

document.getElementById("textEditor").addEventListener("paste", function (e) {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
});

// ==========================================
// 7. 딥-파싱 문단 정형화 엔진 (하단 빈문단 트림 보완)
// ==========================================
function normalizeParagraphs(container) {
    const paragraphs = [];
    let currentParagraphNodes = [];

    function flushParagraph() {
        if (currentParagraphNodes.length > 0) {
            paragraphs.push(currentParagraphNodes);
            currentParagraphNodes = [];
        }
    }

    function parseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            currentParagraphNodes.push(node.cloneNode(true));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName;

            if (tagName === "BR") {
                if (currentParagraphNodes.length > 0) {
                    flushParagraph();
                } else {
                    paragraphs.push([]);
                }
            } else if (node.classList.contains("dialogue-line")) {
                flushParagraph();
                paragraphs.push(node.cloneNode(true));
                flushParagraph();
            } else if (tagName === "DIV" || tagName === "P" || /^H[1-6]$/.test(tagName)) {
                flushParagraph();
                Array.from(node.childNodes).forEach(parseNodes);
                flushParagraph();
            } else {
                if (node.querySelector("div, p, br, .dialogue-line")) {
                    Array.from(node.childNodes).forEach(parseNodes);
                } else {
                    currentParagraphNodes.push(node.cloneNode(true));
                }
            }
        }
    }

    Array.from(container.childNodes).forEach(parseNodes);
    flushParagraph();

    // [핵심 보정] 배열의 뒷부분부터 스캔하면서 완전히 비어있는 문단은 아예 생성 대상에서 탈락시킴
    while (paragraphs.length > 0) {
        const lastPara = paragraphs[paragraphs.length - 1];
        // 대사선이 아니고, 노드가 아예 없거나 텍스트 알맹이가 없는 빈 태그일 경우
        if (!(lastPara instanceof HTMLElement)) {
            const isTextEmpty = lastPara.every((node) => node.textContent.trim() === "");
            if (isTextEmpty) {
                paragraphs.pop(); // 탈락
                continue;
            }
        }
        break;
    }

    container.innerHTML = "";
    paragraphs.forEach((pNodes) => {
        if (pNodes instanceof HTMLElement && pNodes.classList.contains("dialogue-line")) {
            container.appendChild(pNodes);
        } else {
            const newDiv = document.createElement("div");
            if (pNodes.length === 0) {
                newDiv.appendChild(document.createElement("br"));
            } else {
                pNodes.forEach((n) => newDiv.appendChild(n));
            }
            container.appendChild(newDiv);
        }
    });

    if (container.childNodes.length === 0) {
        container.innerHTML = "<div><br></div>";
    }
}
