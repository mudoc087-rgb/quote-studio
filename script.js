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
    subTextColor: document.getElementById("subTextColor"),
    hlColorA: document.getElementById("hlColorA"),
    hlColorB: document.getElementById("hlColorB"),
    hlColorC: document.getElementById("hlColorC"),
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
    captureArea: document.getElementById("captureArea"),

    // 🆕 [요청반영 1] 글자 그림자 ON/OFF 체크박스 및 제어 요소 매핑
    enableTextShadow: document.getElementById("enableTextShadow"), // 그림자 토글 체크박스
    textShadowColor: document.getElementById("textShadowColor"), // 그림자 색상 피кер
    textShadowBlur: document.getElementById("textShadowBlur") // 그림자 반경 슬라이더
};

function updateCanvas() {
    if (!els.captureArea) return;

    // 1. 캔버스 비율 및 크기 설정
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

    els.captureArea.style.padding = `${els.paddingY.value}px ${els.paddingX.value}px`;
    // 2. 캔버스 배경 처리
    const bgTypeVal = els.bgType.value;
    const grad1Wrapper = document.getElementById("grad1Wrapper");
    const grad2Wrapper = document.getElementById("grad2Wrapper");
    const grad3Wrapper = document.getElementById("grad3Wrapper");
    const gradientDirWrapper = document.getElementById("gradientDirWrapper"); // 🆕 방향 레이아웃 가져오기

    // 현재 선택된 그라데이션 방향 값 (가로/세로/대각선 문자열)
    const dirVal = els.gradientDir ? els.gradientDir.value : "to bottom";

    // 배경 타입에 따라 컬러피커 및 방향 설정 노출/숨김 및 캔버스 배경 적용
    if (bgTypeVal === "color") {
        if (grad1Wrapper) grad1Wrapper.style.display = "flex";
        if (grad2Wrapper) grad2Wrapper.style.display = "none";
        if (grad3Wrapper) grad3Wrapper.style.display = "none";
        if (gradientDirWrapper) gradientDirWrapper.style.display = "none"; // 단색일 땐 방향 숨김

        els.captureArea.style.background = els.gradColor1.value;
    } else if (bgTypeVal === "grad2") {
        if (grad1Wrapper) grad1Wrapper.style.display = "flex";
        if (grad2Wrapper) grad2Wrapper.style.display = "flex";
        if (grad3Wrapper) grad3Wrapper.style.display = "none";
        if (gradientDirWrapper) gradientDirWrapper.style.display = "flex"; // 그라데이션일 땐 방향 보임

        els.captureArea.style.background = `linear-gradient(${dirVal}, ${els.gradColor1.value}, ${els.gradColor2.value})`;
    } else if (bgTypeVal === "grad3") {
        if (grad1Wrapper) grad1Wrapper.style.display = "flex";
        if (grad2Wrapper) grad2Wrapper.style.display = "flex";
        if (grad3Wrapper) grad3Wrapper.style.display = "flex";
        if (gradientDirWrapper) gradientDirWrapper.style.display = "flex"; // 그라데이션일 땐 방향 보임

        els.captureArea.style.background = `linear-gradient(${dirVal}, ${els.gradColor1.value}, ${els.gradColor2.value}, ${els.gradColor3.value})`;
    } else {
        // 이미지 배경일 경우 모두 숨김
        if (grad1Wrapper) grad1Wrapper.style.display = "none";
        if (grad2Wrapper) grad2Wrapper.style.display = "none";
        if (grad3Wrapper) grad3Wrapper.style.display = "none";
        if (gradientDirWrapper) gradientDirWrapper.style.display = "none";

        els.captureArea.style.background = "transparent";
    }
    // 3. 에디터 텍스트 동기화 및 스타일 바인딩
    const textWrapper = document.getElementById("canvasTextWrapper");
    if (textWrapper) {
        let rawHTML = els.editor.innerHTML || "<div><br></div>";
        textWrapper.innerHTML = rawHTML;

        normalizeParagraphs(textWrapper);

        textWrapper.style.setProperty("--quote-line-color", els.quoteLineColor.value);
        if (els.editor) {
            els.editor.style.setProperty("--quote-line-color", els.quoteLineColor.value);
        }

        applySmartHighlighting(textWrapper);

        // 형광펜 끊김 방지 패치
        const canvasSpans = textWrapper.getElementsByTagName("span");
        for (let span of canvasSpans) {
            if (span.style.backgroundColor && span.style.backgroundColor !== "transparent") {
                span.style.display = "inline";
                span.style.boxDecorationBreak = "clone";
                span.style.webkitBoxDecorationBreak = "clone";
            }
        }

        textWrapper.style.fontFamily = els.fontSelect.value;
        textWrapper.style.fontSize = `${els.fontSize.value}px`;
        textWrapper.style.textAlign = els.alignH.value;
        textWrapper.style.letterSpacing = `${els.letterSpacing.value}px`;
        textWrapper.style.lineHeight = `${els.lineHeight.value}px`;
        textWrapper.style.whiteSpace = "pre-wrap";
        textWrapper.style.wordBreak = els.wordBreak.value;
        textWrapper.style.color = els.globalTextColor.value;

        // 🆕 에디터(#textEditor)와 캔버스(#canvasTextWrapper) 내부의 가로 구분선을 모두 찾아 현재 글자색과 실시간 연동
        const currentTextColor = els.globalTextColor.value;
        const allDividers = document.querySelectorAll(
            "#textEditor .fade-divider-line, #canvasTextWrapper .fade-divider-line"
        );

        allDividers.forEach((hr) => {
            hr.style.background = `linear-gradient(to right, transparent 15%, ${currentTextColor} 45%, ${currentTextColor} 55%, transparent 85%)`;
            hr.style.border = "none";
            hr.style.height = "1px";
        });
        if (els.enableTextShadow && els.enableTextShadow.checked) {
            const shadowColor = els.textShadowColor ? els.textShadowColor.value : "rgba(0,0,0,0.3)";
            const shadowBlur = els.textShadowBlur ? els.textShadowBlur.value : 5;

            textWrapper.style.textShadow = `1px 1px ${shadowBlur}px ${shadowColor}`;
        } else {
            textWrapper.style.textShadow = "none";
        }

        // 장평(ScaleX) 제어
        const scaleFactor = (parseInt(els.fontScaleX.value) || 100) / 100;
        textWrapper.style.display = "block";
        textWrapper.style.width = `${100 / scaleFactor}%`;
        textWrapper.style.transform = `scaleX(${scaleFactor})`;

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

    // 문단 간격 조정
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
    // ========================================================
    // 4. 정보 영역(작품명/작가명) 및 가로 그라데이션 구분선 처리
    // ========================================================
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
        const baseColor = els.globalTextColor.value;
        const fontName = els.fontSelect.value;

        // 🌟 [핵심 수정] 고정 단위 "0.7em" 대신 본문 크기(els.fontSize.value)의 70% 값을 실시간 px로 계산합니다.
        const computedFontSize = `${parseFloat(els.fontSize.value) * 0.7}px`;

        const titleVal = els.titleInput.value.trim();
        const creatorVal = els.creatorInput.value.trim();
        let infoHTML = "";

        if (titleVal || creatorVal) {
            infoHTML += `<div style="display: flex; align-items: center; gap: 6px;">`;
            // 뒤에 붙어있던 불필요한 px 문자는 연산 단계에서 처리했으므로 깨끗하게 매핑됩니다.
            infoHTML += `<span style="color: ${baseColor}; opacity: 0.5; font-size: ${computedFontSize};">｜</span>`;

            if (titleVal && creatorVal) {
                infoHTML +=
                    `<span class="info-text-node" style="color: ${baseColor}; font-family: ${fontName}; font-size: ${computedFontSize};">${titleVal}</span>` +
                    `<span class="info-divider" style="color: ${baseColor}; font-size: ${computedFontSize}; opacity: 0.5;">·</span>` +
                    `<span class="info-text-node" style="color: ${baseColor}; opacity: 0.7; font-family: ${fontName}; font-size: ${computedFontSize};">${creatorVal}</span>`;
            } else if (titleVal) {
                infoHTML += `<span class="info-text-node" style="color: ${baseColor}; font-family: ${fontName}; font-size: ${computedFontSize};">${titleVal}</span>`;
            } else if (creatorVal) {
                infoHTML += `<span class="info-text-node" style="color: ${baseColor}; opacity: 0.7; font-family: ${fontName}; font-size: ${computedFontSize};">${creatorVal}</span>`;
            }

            infoHTML += `</div>`;
        }

        // 전체 컨테이너를 가로 선 정렬에 맞게 세로 배치 구조(flex-direction: column)로 유연성 제어
        infoContainer.style.flexDirection = "column";
        if (els.alignH.value === "center") infoContainer.style.alignItems = "center";
        else if (els.alignH.value === "right") infoContainer.style.alignItems = "flex-end";
        else infoContainer.style.alignItems = "flex-start";

        infoContainer.innerHTML = infoHTML;
        infoContainer.style.display = !titleVal && !creatorVal ? "none" : "flex";
    }

    if (typeof syncLiveHighlights === "function") {
        try {
            syncLiveHighlights();
        } catch (e) {
            console.warn(e);
        }
    }
    const currentTextColor = els.globalTextColor.value;
    const allDividers = document.querySelectorAll(
        "#textEditor .fade-divider-line, #canvasTextWrapper .fade-divider-line"
    );

    allDividers.forEach((hr) => {
        // hr.style.background 대신 setProperty를 써서 important 속성을 강제로 먹입니다.
        hr.style.setProperty(
            "background",
            `linear-gradient(to right, transparent 15%, ${currentTextColor} 45%, ${currentTextColor} 55%, transparent 85%)`,
            "important"
        );
        hr.style.setProperty("border", "none", "important");
        hr.style.setProperty("height", "1px", "important");
    });
}

// 스마트 괄호/따옴표 하이라이트 알고리즘 (이하 원본 유지)
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
        nodeOffsets.push({ node: node, start: fullText.length, end: fullText.length + node.nodeValue.length });
        fullText += node.nodeValue;
    });

    const intervals = [];
    if (hasQuotes) {
        const quoteRegex = /("[^"\n]*"|“[^”\n]*”|「[^」\n]*」|『[^』\n]*』|‹[^›\n]*›|«[^»\n]*»)/g;
        let match;
        while ((match = quoteRegex.exec(fullText)) !== null) {
            intervals.push({ start: match.index, end: match.index + match[0].length, color: els.quoteColor.value });
        }
    }
    if (hasParens) {
        const parenRegex = /(\([^)\n]*\)|\[[^\]\n]*\]|\{[^}\n]*\}|〈[^〉\n]*〉|《[^》\n]*\s*》)/g;
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

let lastHlColors = { A: "#fef08a", B: "#bbf7d0", C: "#bfdbfe" };
let lastSubTextColor = "#64748b";

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : "";
}

function syncLiveHighlights(overrideColors = null) {
    const textWrapper = document.getElementById("canvasTextWrapper");
    if (!textWrapper) return;

    let baseA = lastHlColors.A;
    let baseB = lastHlColors.B;
    let baseC = lastHlColors.C;
    let baseSub = lastSubTextColor;

    if (overrideColors) {
        if (overrideColors.hlColorA && els.hlColorA) els.hlColorA.value = overrideColors.hlColorA;
        if (overrideColors.hlColorB && els.hlColorB) els.hlColorB.value = overrideColors.hlColorB;
        if (overrideColors.hlColorC && els.hlColorC) els.hlColorC.value = overrideColors.hlColorC;
        if (overrideColors.subTextColor && els.subTextColor) els.subTextColor.value = overrideColors.subTextColor;
    }

    const oldRgbA = hexToRgb(baseA).replace(/\s+/g, "");
    const oldRgbB = hexToRgb(baseB).replace(/\s+/g, "");
    const oldRgbC = hexToRgb(baseC).replace(/\s+/g, "");
    const oldRgbSub = hexToRgb(baseSub).replace(/\s+/g, "");

    const targetColorA = els.hlColorA ? els.hlColorA.value : baseA;
    const targetColorB = els.hlColorB ? els.hlColorB.value : baseB;
    const targetColorC = els.hlColorC ? els.hlColorC.value : baseC;
    const targetColorSub = els.subTextColor ? els.subTextColor.value : baseSub;

    const updateSpansColor = (container) => {
        if (!container) return;
        // 🆕 span 태그뿐만 아니라 보조색 버튼이 만드는 font 태그까지 모두 찾습니다.
        const elements = container.querySelectorAll("span, font");

        for (let el of elements) {
            // 1. 형광펜(배경색) 처리
            const bg = el.style.backgroundColor;
            if (bg && bg !== "transparent" && bg !== "initial") {
                const normalizedBg = bg.replace(/\s+/g, "");
                if (normalizedBg === oldRgbA) el.style.backgroundColor = targetColorA;
                else if (normalizedBg === oldRgbB) el.style.backgroundColor = targetColorB;
                else if (normalizedBg === oldRgbC) el.style.backgroundColor = targetColorC;
                el.style.display = "inline";
                el.style.boxDecorationBreak = "clone";
                el.style.webkitBoxDecorationBreak = "clone";
            }

            // 2. 보조색(글자색) 처리
            // 태그 속성(color)이나 CSS(style.color) 중 색상이 있는 것을 가져옵니다.
            let fg = el.style.color || el.getAttribute("color");
            if (fg && fg !== "transparent" && fg !== "initial") {
                let normalizedFg = fg;
                // 브라우저가 생성한 헥스코드(#) 형태라면 무조건 rgb() 형식으로 변환
                if (fg.indexOf("#") !== -1) {
                    normalizedFg = hexToRgb(fg);
                }

                if (normalizedFg) {
                    normalizedFg = normalizedFg.replace(/\s+/g, "");
                    // 현재 적용된 보조색과 일치하면 피커의 새 색상으로 덮어쓰기!
                    if (normalizedFg === oldRgbSub) {
                        if (el.tagName.toLowerCase() === "font") {
                            el.removeAttribute("color"); // 구형 속성은 지워버림
                        }
                        el.style.color = targetColorSub; // 표준 CSS로 깔끔하게 새 색상 적용
                    }
                }
            }
        }
    };

    updateSpansColor(els.editor);
    updateSpansColor(textWrapper);

    if (els.hlColorA) lastHlColors.A = els.hlColorA.value;
    if (els.hlColorB) lastHlColors.B = els.hlColorB.value;
    if (els.hlColorC) lastHlColors.C = els.hlColorC.value;
    if (els.subTextColor) lastSubTextColor = els.subTextColor.value;
}

function prepareCanvasForCapture(container) {
    const targetSpans = container.querySelectorAll("span");
    targetSpans.forEach((span) => {
        const bg = span.style.backgroundColor;
        if (bg && bg !== "transparent" && bg !== "initial") {
            span.setAttribute("data-original-html", span.innerHTML);
            const chars = Array.from(span.textContent);
            const wrappedHTML = chars
                .map((char) => {
                    if (char === "\n") return "\n";
                    return `<span style="background-color: ${bg}; display: inline; color: inherit; font-family: inherit; font-weight: inherit;">${char}</span>`;
                })
                .join("");
            span.innerHTML = wrappedHTML;
            span.style.backgroundColor = "transparent";
        }
    });
}

function restoreCanvasAfterCapture(container) {
    const targetSpans = container.querySelectorAll("span[data-original-html]");
    targetSpans.forEach((span) => {
        const originalHTML = span.getAttribute("data-original-html");
        const restoredBg = span.querySelector("span")?.style.backgroundColor || "transparent";
        span.innerHTML = originalHTML;
        span.style.backgroundColor = restoredBg;
        span.removeAttribute("data-original-html");
    });
}

// 포맷팅 툴바 이벤트 리스너들
document.getElementById("btnBold").addEventListener("click", () => {
    document.execCommand("bold", false, null);
    updateCanvas();
});
document.getElementById("btnItalic").addEventListener("click", () => {
    document.execCommand("italic", false, null);
    updateCanvas();
});
document.getElementById("btnQuoteWrap").addEventListener("click", () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    document.execCommand("insertText", false, `“${range.toString()}”`);
    updateCanvas();
});
document.getElementById("btnSubText").addEventListener("click", () => {
    document.execCommand("foreColor", false, els.subTextColor ? els.subTextColor.value : "#64748b");
    if (typeof syncLiveHighlights === "function") syncLiveHighlights();
    updateCanvas();
});

document.getElementById("selHighlight").addEventListener("change", function () {
    const val = this.value;
    if (!val) return;
    let color = "#fef08a";
    if (val === "A") color = els.hlColorA.value;
    if (val === "B") color = els.hlColorB.value;
    if (val === "C") color = els.hlColorC.value;
    document.execCommand("backColor", false, color);
    this.value = "";
    updateCanvas();
});

document.getElementById("btnQuoteLine").addEventListener("click", () => {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let block = range.commonAncestorContainer;
    while (block && block.nodeType !== Node.ELEMENT_NODE) block = block.parentNode;
    if (block && block.id !== "textEditor") {
        if (block.classList.contains("dialogue-line")) block.classList.remove("dialogue-line");
        else block.classList.add("dialogue-line");
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

// 🆕 [그라데이션 페이드 가로 구분선 전용] 추가 버튼 이벤트 핸들러
document.getElementById("btnFadeLine").addEventListener("click", () => {
    els.editor.focus(); // 에디터 포커스 고정

    // 현재 설정된 기본 글자색 가져오기
    const baseColor = els.globalTextColor ? els.globalTextColor.value : "#0f172a";

    // 양끝 투명도 영역을 짧고 선명하게 고정한 그라데이션 라인 HTML
    // (캔버스 추적용 고유 클래스 fade-divider-line 부여)
    const hrHTML = `<hr class="fade-divider-line" style="border:none; height:1px; width:100%; max-width:70%; margin:24px auto; clear:both; background: linear-gradient(to right, transparent 15%, ${baseColor} 45%, ${baseColor} 55%, transparent 85%);" contenteditable="false" />`;

    const selection = window.getSelection();
    if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = hrHTML;
        const hrElement = tempDiv.firstChild;

        range.insertNode(hrElement);

        const br = document.createElement("br");
        hrElement.parentNode.insertBefore(br, hrElement.nextSibling);

        const newRange = document.createRange();
        newRange.setStartAfter(br);
        newRange.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(newRange);
    } else {
        els.editor.innerHTML += hrHTML;
    }

    updateCanvas(); // 실시간 캔버스 갱신
});
// 초기화 바인딩 및 관찰 리스너 등록
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
        if (customArea) customArea.style.display = els.ratioSelect.value === "free" ? "flex" : "none";
        updateCanvas();
    });

    els.editor.addEventListener("input", updateCanvas);
    if (typeof renderPresets === "function") renderPresets();

    // 입력 변화 감지 자동 트리거 타겟 통합 리스트
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
        els.subTextColor,
        els.hlColorA,
        els.hlColorB,
        els.hlColorC,
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
        els.fontScaleX,
        // 🆕 새 그림자 토글 제어 인풋 연결
        els.enableTextShadow,
        els.textShadowColor,
        els.textShadowBlur
    ];

    autoTriggers.forEach((element) => {
        if (element) {
            element.addEventListener("input", updateCanvas);
            element.addEventListener("change", updateCanvas);
        }
    });

    setTimeout(() => {
        updateCanvas();
    }, 50);
});

// 이미지 캡처 및 저장 기능 (이하 원본 유지)
document.getElementById("btnCopy").addEventListener("click", () => {
    if (!els.captureArea) return;
    const originalHeight = els.captureArea.style.height;
    if (els.ratioSelect.value === "free") els.captureArea.style.height = els.captureArea.scrollHeight + "px";
    prepareCanvasForCapture(els.captureArea);
    html2canvas(els.captureArea, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
        .then((canvas) => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.height = originalHeight;
            canvas.toBlob((blob) => {
                if (!blob) return;
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]).then(() => {
                    alert("클립보드에 복사되었습니다!");
                });
            }, "image/png");
        })
        .catch(() => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.height = originalHeight;
        });
});

document.getElementById("btnSave").addEventListener("click", () => {
    if (!els.captureArea) return;
    const originalWidth = els.captureArea.style.width;
    const originalHeight = els.captureArea.style.height;
    if (els.ratioSelect.value === "free") els.captureArea.style.height = els.captureArea.scrollHeight + "px";
    prepareCanvasForCapture(els.captureArea);
    html2canvas(els.captureArea, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
        .then((canvas) => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.width = originalWidth;
            els.captureArea.style.height = originalHeight;
            const link = document.createElement("a");
            link.download = `excerpt_${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        })
        .catch(() => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.width = originalWidth;
            els.captureArea.style.height = originalHeight;
        });
});

// 배경 이미지 원본 레이어 제어 로직 생략 (원형 동일유지)
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
    overlayLayer.style.backgroundColor = `rgba(${document.getElementById("bgOverlayColor").value}, ${document.getElementById("bgOverlayOpacity").value})`;
}
["bgImageSize", "bgImageX", "bgImageY", "bgImageBlur", "bgOverlayColor", "bgOverlayOpacity"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateBgImageStyles);
});
document.getElementById("textEditor").addEventListener("paste", function (e) {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
});

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
    while (paragraphs.length > 0) {
        const lastPara = paragraphs[paragraphs.length - 1];
        if (!(lastPara instanceof HTMLElement)) {
            const isTextEmpty = lastPara.every((node) => node.textContent.trim() === "");
            if (isTextEmpty) {
                paragraphs.pop();
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
    if (container.childNodes.length === 0) container.innerHTML = "<div><br></div>";
}
