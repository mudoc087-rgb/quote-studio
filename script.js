const els = {
    editor: document.getElementById("textEditor"),

    cardTitleInput: document.getElementById("cardTitleInput"),
    titleSize: document.getElementById("titleSize"),
    titleWeight: document.getElementById("titleWeight"),
    cardSubtitleInput: document.getElementById("cardSubtitleInput"),
    subtitleSize: document.getElementById("subtitleSize"),
    subtitleWeight: document.getElementById("subtitleWeight"),
    canvasTitleWrapper: document.getElementById("canvasTitleWrapper"),
    canvasSubtitleWrapper: document.getElementById("canvasSubtitleWrapper"),

    titleInput: document.getElementById("titleInput"),
    creatorInput: document.getElementById("creatorInput"),

    ratioSelect: document.getElementById("ratioSelect"),
    canvasWidth: document.getElementById("canvasWidth"),
    paddingY: document.getElementById("paddingY"),
    paddingX: document.getElementById("paddingX"),
    bgType: document.getElementById("bgType"),
    gradColor1: document.getElementById("gradColor1"),
    gradColor2: document.getElementById("gradColor2"),
    gradColor3: document.getElementById("gradColor3"),
    gradientDir: document.getElementById("gradientDir"),

    globalTextColor: document.getElementById("globalTextColor"),
    subTextColor: document.getElementById("subTextColor"),
    hlColorA: document.getElementById("hlColorA"),
    hlColorB: document.getElementById("hlColorB"),
    hlColorC: document.getElementById("hlColorC"),
    quoteLineColorA: document.getElementById("quoteLineColorA"),
    quoteLineColorB: document.getElementById("quoteLineColorB"),

    bubbleColorLeft: document.getElementById("bubbleColorLeft"),
    bubbleTextColorLeft: document.getElementById("bubbleTextColorLeft"),
    bubbleColorRight: document.getElementById("bubbleColorRight"),
    bubbleTextColorRight: document.getElementById("bubbleTextColorRight"),

    enableQuoteColor: document.getElementById("enableQuoteColor"),
    quoteColorA: document.getElementById("quoteColorA"),
    quoteColorB: document.getElementById("quoteColorB"),
    enableParenColor: document.getElementById("enableParenColor"),
    parenColorA: document.getElementById("parenColorA"),
    parenColorB: document.getElementById("parenColorB"),

    fontSelect: document.getElementById("fontSelect"),
    alignH: document.getElementById("alignH"),
    wordBreak: document.getElementById("wordBreak"),
    bodyWeight: document.getElementById("bodyWeight"),
    tabs: document.querySelectorAll(".tab-btn"),
    panels: document.querySelectorAll(".tab-panel"),

    fontSize: document.getElementById("fontSize"),
    letterSpacing: document.getElementById("letterSpacing"),
    lineHeight: document.getElementById("lineHeight"),
    paraSpacing: document.getElementById("paraSpacing"),
    fontScaleX: document.getElementById("fontScaleX"),
    captureArea: document.getElementById("captureArea"),

    enableTextShadow: document.getElementById("enableTextShadow"),
    textShadowColor: document.getElementById("textShadowColor"),
    textShadowBlur: document.getElementById("textShadowBlur")
};

function applyBubbleColors(container) {
    if (!container) return;
    const bubbles = container.querySelectorAll(".chat-bubble");
    bubbles.forEach((b) => {
        const inner = b.querySelector(".bubble-inner") || b;
        const isRight = b.classList.contains("side-right");
        if (isRight) {
            inner.style.background = els.bubbleColorRight ? els.bubbleColorRight.value : "#3e5c55";
            inner.style.color = els.bubbleTextColorRight ? els.bubbleTextColorRight.value : "#f7f5ef";
        } else {
            inner.style.background = els.bubbleColorLeft ? els.bubbleColorLeft.value : "#efece4";
            inner.style.color = els.bubbleTextColorLeft ? els.bubbleTextColorLeft.value : "#2b2a26";
        }
    });
}

// 본문 내 삽입형 블록(제목/부제목/박스) 스타일 실시간 동기화
function applyInlineContentBlocks(container) {
    if (!container) return;
    // 🆕 본문 텍스트 스타일(크기/색상 제외)을 제목/부제목에도 동일하게 적용
    const applyBodyStyleExceptSizeColor = (el) => {
        el.style.textAlign = els.alignH.value;
        el.style.letterSpacing = `${els.letterSpacing.value}px`;
        el.style.wordBreak = els.wordBreak.value;
        if (els.enableTextShadow && els.enableTextShadow.checked) {
            const shadowColor = els.textShadowColor ? els.textShadowColor.value : "rgba(0,0,0,0.3)";
            const shadowBlur = els.textShadowBlur ? els.textShadowBlur.value : 4;
            el.style.textShadow = `1px 1px ${shadowBlur}px ${shadowColor}`;
        } else {
            el.style.textShadow = "none";
        }
    };

    const titleBlocks = container.querySelectorAll(".inline-title-block");
    titleBlocks.forEach((el) => {
        el.style.fontFamily = els.fontSelect.value;
        el.style.fontSize = `${els.titleSize.value}px`;
        el.style.fontWeight = els.titleWeight.value;
        el.style.color = els.globalTextColor.value;
        applyBodyStyleExceptSizeColor(el);
    });

    const subtitleBlocks = container.querySelectorAll(".inline-subtitle-block");
    subtitleBlocks.forEach((el) => {
        el.style.fontFamily = els.fontSelect.value;
        el.style.fontSize = `${els.subtitleSize.value}px`;
        el.style.fontWeight = els.subtitleWeight.value;
        el.style.color = els.subTextColor.value;
        applyBodyStyleExceptSizeColor(el);
    });

    const boxes = container.querySelectorAll(".content-box");
    boxes.forEach((el) => {
        el.style.borderColor = els.globalTextColor.value;
        el.style.color = els.globalTextColor.value;
    });
}

// 🆕 장평(가로 스케일) 적용 공용 함수 — 본문/제목/부제목 모두 동일한 로직 사용
function applyHorizontalScale(el, scaleFactor, alignValue) {
    el.style.width = `${100 / scaleFactor}%`;
    el.style.transform = `scaleX(${scaleFactor})`;
    if (alignValue === "center") {
        el.style.transformOrigin = "center top";
        el.style.marginLeft = `calc((100% - 100% / ${scaleFactor}) / 2)`;
    } else if (alignValue === "right") {
        el.style.transformOrigin = "right top";
        el.style.marginLeft = `calc(100% - 100% / ${scaleFactor})`;
    } else {
        el.style.transformOrigin = "left top";
        el.style.marginLeft = "0";
    }
}

function syncTextBlock(inputEl, wrapperEl, sizeEl, weightEl, fallbackColor) {
    if (!inputEl || !wrapperEl) return;
    const text = inputEl.value.trim();
    wrapperEl.textContent = text;
    wrapperEl.style.display = text ? "block" : "none";
    wrapperEl.style.fontFamily = els.fontSelect.value;
    wrapperEl.style.fontSize = `${sizeEl.value}px`;
    wrapperEl.style.fontWeight = weightEl.value;
    wrapperEl.style.textAlign = els.alignH.value;
    wrapperEl.style.color = fallbackColor;

    // 🆕 자간/장평/줄바꿈/텍스트 그림자도 본문 설정과 동일하게 동기화 (크기·색상 제외)
    wrapperEl.style.letterSpacing = `${els.letterSpacing.value}px`;
    wrapperEl.style.wordBreak = els.wordBreak.value;

    if (els.enableTextShadow && els.enableTextShadow.checked) {
        const shadowColor = els.textShadowColor ? els.textShadowColor.value : "rgba(0,0,0,0.3)";
        const shadowBlur = els.textShadowBlur ? els.textShadowBlur.value : 4;
        wrapperEl.style.textShadow = `1px 1px ${shadowBlur}px ${shadowColor}`;
    } else {
        wrapperEl.style.textShadow = "none";
    }

    if (text) {
        const scaleFactor = (parseInt(els.fontScaleX.value) || 100) / 100;
        applyHorizontalScale(wrapperEl, scaleFactor, els.alignH.value);
    }
}

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
    const gradientDirWrapper = document.getElementById("gradientDirWrapper");
    const bgImageControls = document.getElementById("bgImageControls");
    const bgImageLayer = document.getElementById("bgImageLayer");
    const bgOverlayLayer = document.getElementById("bgOverlayLayer");

    const dirVal = els.gradientDir ? els.gradientDir.value : "to bottom";

    if (bgImageControls) bgImageControls.style.display = bgTypeVal === "image" ? "flex" : "none";
    if (bgImageLayer) bgImageLayer.style.display = bgTypeVal === "image" ? "block" : "none";
    if (bgOverlayLayer) bgOverlayLayer.style.display = bgTypeVal === "image" ? "block" : "none";

    if (bgTypeVal === "color") {
        if (grad1Wrapper) grad1Wrapper.style.display = "flex";
        if (grad2Wrapper) grad2Wrapper.style.display = "none";
        if (grad3Wrapper) grad3Wrapper.style.display = "none";
        if (gradientDirWrapper) gradientDirWrapper.style.display = "none";

        els.captureArea.style.background = els.gradColor1.value;
    } else if (bgTypeVal === "grad2") {
        if (grad1Wrapper) grad1Wrapper.style.display = "flex";
        if (grad2Wrapper) grad2Wrapper.style.display = "flex";
        if (grad3Wrapper) grad3Wrapper.style.display = "none";
        if (gradientDirWrapper) gradientDirWrapper.style.display = "flex";

        els.captureArea.style.background = `linear-gradient(${dirVal}, ${els.gradColor1.value}, ${els.gradColor2.value})`;
    } else if (bgTypeVal === "grad3") {
        if (grad1Wrapper) grad1Wrapper.style.display = "flex";
        if (grad2Wrapper) grad2Wrapper.style.display = "flex";
        if (grad3Wrapper) grad3Wrapper.style.display = "flex";
        if (gradientDirWrapper) gradientDirWrapper.style.display = "flex";

        els.captureArea.style.background = `linear-gradient(${dirVal}, ${els.gradColor1.value}, ${els.gradColor2.value}, ${els.gradColor3.value})`;
    } else {
        // 이미지 배경
        if (grad1Wrapper) grad1Wrapper.style.display = "flex";
        if (grad2Wrapper) grad2Wrapper.style.display = "none";
        if (grad3Wrapper) grad3Wrapper.style.display = "none";
        if (gradientDirWrapper) gradientDirWrapper.style.display = "none";

        els.captureArea.style.background = els.gradColor1.value;
    }

    // 3. 제목 / 부제목 동기화
    syncTextBlock(
        els.cardTitleInput,
        els.canvasTitleWrapper,
        els.titleSize,
        els.titleWeight,
        els.globalTextColor.value
    );
    syncTextBlock(
        els.cardSubtitleInput,
        els.canvasSubtitleWrapper,
        els.subtitleSize,
        els.subtitleWeight,
        els.subTextColor.value
    );

    // 4. 에디터 텍스트 동기화 및 스타일 바인딩
    const textWrapper = document.getElementById("canvasTextWrapper");
    if (textWrapper) {
        let rawHTML = els.editor.innerHTML || "<div><br></div>";
        textWrapper.innerHTML = rawHTML;

        normalizeParagraphs(textWrapper);

        textWrapper.style.setProperty("--quote-line-color-a", els.quoteLineColorA.value);
        textWrapper.style.setProperty("--quote-line-color-b", els.quoteLineColorB.value);
        if (els.editor) {
            els.editor.style.setProperty("--quote-line-color-a", els.quoteLineColorA.value);
            els.editor.style.setProperty("--quote-line-color-b", els.quoteLineColorB.value);
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
        textWrapper.style.fontWeight = els.bodyWeight ? els.bodyWeight.value : "400";
        textWrapper.style.textAlign = els.alignH.value;
        textWrapper.style.letterSpacing = `${els.letterSpacing.value}px`;
        textWrapper.style.lineHeight = `${els.lineHeight.value}px`;
        textWrapper.style.whiteSpace = "pre-wrap";
        textWrapper.style.wordBreak = els.wordBreak.value;
        textWrapper.style.color = els.globalTextColor.value;

        if (els.editor) {
            els.editor.style.fontWeight = els.bodyWeight ? els.bodyWeight.value : "400";
        }

        // 대화 버블 색상 동기화 (에디터 + 캔버스 양쪽)
        applyBubbleColors(els.editor);
        applyBubbleColors(textWrapper);

        // 본문 삽입 블록(제목/부제목/박스) 스타일 동기화 (에디터 + 캔버스 양쪽)
        applyInlineContentBlocks(els.editor);
        applyInlineContentBlocks(textWrapper);

        // 가로 구분선 색상 실시간 연동
        const currentTextColor = els.globalTextColor.value;
        const allDividers = document.querySelectorAll(
            "#textEditor .fade-divider-line, #canvasTextWrapper .fade-divider-line"
        );
        allDividers.forEach((hr) => {
            hr.style.setProperty(
                "background",
                `linear-gradient(to right, transparent 15%, ${currentTextColor} 45%, ${currentTextColor} 55%, transparent 85%)`,
                "important"
            );
            hr.style.setProperty("border", "none", "important");
            hr.style.setProperty("height", "1px", "important");
        });

        if (els.enableTextShadow && els.enableTextShadow.checked) {
            const shadowColor = els.textShadowColor ? els.textShadowColor.value : "rgba(0,0,0,0.3)";
            const shadowBlur = els.textShadowBlur ? els.textShadowBlur.value : 4;
            textWrapper.style.textShadow = `1px 1px ${shadowBlur}px ${shadowColor}`;
        } else {
            textWrapper.style.textShadow = "none";
        }

        // 장평(ScaleX) 제어
        const scaleFactor = (parseInt(els.fontScaleX.value) || 100) / 100;
        textWrapper.style.display = "block";
        applyHorizontalScale(textWrapper, scaleFactor, els.alignH.value);

        // 문단 간격 조정
        const allParagraphs = textWrapper.querySelectorAll(
            "#canvasTextWrapper > div, #canvasTextWrapper > p, #canvasTextWrapper > .dialogue-line, #canvasTextWrapper > .chat-bubble"
        );
        allParagraphs.forEach((p, idx) => {
            if (idx === allParagraphs.length - 1) {
                p.style.marginBottom = "0px";
                p.style.paddingBottom = "0px";
            } else {
                p.style.marginBottom = `${els.paraSpacing.value}px`;
            }
        });
    }

    // 5. 정보 영역(작품명/작가명)
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
        const computedFontSize = `${parseFloat(els.fontSize.value) * 0.7}px`;

        const titleVal = els.titleInput.value.trim();
        const creatorVal = els.creatorInput.value.trim();
        let infoHTML = "";

        if (titleVal || creatorVal) {
            infoHTML += `<div style="display: flex; align-items: center; gap: 6px;">`;
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
}

// 스마트 괄호/따옴표 하이라이트 알고리즘
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
            intervals.push({ start: match.index, end: match.index + match[0].length, type: "quote" });
        }
    }
    if (hasParens) {
        const parenRegex = /(\([^)\n]*\)|\[[^\]\n]*\]|\{[^}\n]*\}|〈[^〉\n]*〉|《[^》\n]*\s*》)/g;
        let match;
        while ((match = parenRegex.exec(fullText)) !== null) {
            intervals.push({ start: match.index, end: match.index + match[0].length, type: "paren" });
        }
    }

    intervals.sort((a, b) => b.start - a.start);
    intervals.forEach((item) => {
        for (let i = nodeOffsets.length - 1; i >= 0; i--) {
            const info = nodeOffsets[i];
            const overlapStart = Math.max(item.start, info.start);
            const overlapEnd = Math.min(item.end, info.end);

            if (overlapStart < overlapEnd) {
                const node = info.node;
                const parentCheck = node.parentNode;
                // 🆕 사용자가 수동으로 지정한 따옴표 색 구간은 자동 재색칠에서 제외한다.
                if (item.type === "quote" && parentCheck.closest && parentCheck.closest("[data-manual-quote-color]")) {
                    continue;
                }

                const localStart = overlapStart - info.start;
                const localEnd = overlapEnd - info.start;
                const text = node.nodeValue;

                const p3 = text.substring(localEnd);
                const p2 = text.substring(localStart, localEnd);
                const p1 = text.substring(0, localStart);

                const parent = node.parentNode;
                const bubbleAncestor = parent.closest ? parent.closest(".chat-bubble") : null;
                const isRightBubble = !!(bubbleAncestor && bubbleAncestor.classList.contains("side-right"));
                let resolvedColor;
                if (item.type === "quote") {
                    resolvedColor = isRightBubble
                        ? els.quoteColorB
                            ? els.quoteColorB.value
                            : els.quoteColorA.value
                        : els.quoteColorA
                          ? els.quoteColorA.value
                          : "#b7472a";
                } else {
                    resolvedColor = isRightBubble
                        ? els.parenColorB
                            ? els.parenColorB.value
                            : els.parenColorA.value
                        : els.parenColorA
                          ? els.parenColorA.value
                          : "#4c7a72";
                }

                const span = document.createElement("span");
                span.style.color = resolvedColor;
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

let lastHlColors = { A: "#fbe27a", B: "#bcd8bd", C: "#c3d3e6" };
let lastSubTextColor = "#8a8375";
let lastQuoteColorBManual = "#efdbff";

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
    let baseQuoteBManual = lastQuoteColorBManual;

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
    const oldRgbQuoteBManual = hexToRgb(baseQuoteBManual).replace(/\s+/g, "");

    const targetColorA = els.hlColorA ? els.hlColorA.value : baseA;
    const targetColorB = els.hlColorB ? els.hlColorB.value : baseB;
    const targetColorC = els.hlColorC ? els.hlColorC.value : baseC;
    const targetColorSub = els.subTextColor ? els.subTextColor.value : baseSub;
    const targetQuoteBManual = els.quoteColorB ? els.quoteColorB.value : baseQuoteBManual;

    const updateSpansColor = (container) => {
        if (!container) return;
        const elements = container.querySelectorAll("span, font");

        for (let el of elements) {
            // 🆕 수동으로 지정된 따옴표 B색 구간은 표식으로 바로 갱신 (색상 피커를 바꿨을 때 반영)
            if (el.getAttribute("data-manual-quote-color") === "B") {
                el.style.color = targetQuoteBManual;
            }

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

            let fg = el.style.color || el.getAttribute("color");
            if (fg && fg !== "transparent" && fg !== "initial") {
                let normalizedFg = fg;
                if (fg.indexOf("#") !== -1) {
                    normalizedFg = hexToRgb(fg);
                }

                if (normalizedFg) {
                    normalizedFg = normalizedFg.replace(/\s+/g, "");
                    if (normalizedFg === oldRgbSub) {
                        if (el.tagName.toLowerCase() === "font") {
                            el.removeAttribute("color");
                        }
                        el.style.color = targetColorSub;
                    } else if (normalizedFg === oldRgbQuoteBManual) {
                        if (el.tagName.toLowerCase() === "font") {
                            el.removeAttribute("color");
                        }
                        el.style.color = targetQuoteBManual;
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
    if (els.quoteColorB) lastQuoteColorBManual = els.quoteColorB.value;
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
    document.execCommand("foreColor", false, els.subTextColor ? els.subTextColor.value : "#8a8375");
    if (typeof syncLiveHighlights === "function") syncLiveHighlights();
    updateCanvas();
});

// 🆕 드래그한 텍스트에 따옴표 B색을 수동으로 적용 (기본값은 따옴표 A색 자동 감지)
// data-manual-quote-color 표식을 남겨서 자동 하이라이트 로직(applySmartHighlighting)이
// 이 구간을 다시 자동 색으로 덮어쓰지 않도록 한다. (본문입력란 + 미리보기 양쪽 모두 반영됨)
document.getElementById("btnQuoteColorB").addEventListener("click", () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!els.editor.contains(range.commonAncestorContainer)) return;

    const span = document.createElement("span");
    span.setAttribute("data-manual-quote-color", "B");
    span.style.color = els.quoteColorB ? els.quoteColorB.value : "#efdbff";
    span.style.fontWeight = "inherit";
    span.style.fontFamily = "inherit";
    span.appendChild(range.extractContents());
    range.insertNode(span);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    newRange.collapse(false);
    selection.addRange(newRange);

    if (typeof syncLiveHighlights === "function") syncLiveHighlights();
    updateCanvas();
});

document.getElementById("selHighlight").addEventListener("change", function () {
    const val = this.value;
    if (!val) return;
    let color = "#fbe27a";
    if (val === "A") color = els.hlColorA.value;
    if (val === "B") color = els.hlColorB.value;
    if (val === "C") color = els.hlColorC.value;
    document.execCommand("backColor", false, color);
    this.value = "";
    updateCanvas();
});

// 🆕 강조선 A/B 공용 토글 함수: 같은 종류를 다시 누르면 해제, 다른 종류를 누르면 전환
function toggleQuoteLine(variant) {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;

    let node = selection.anchorNode;
    let block = node.nodeType === 3 ? node.parentNode : node;

    while (
        block &&
        block.id !== "textEditor" &&
        block.tagName !== "DIV" &&
        block.tagName !== "P" &&
        !block.classList?.contains("dialogue-line")
    ) {
        block = block.parentNode;
    }

    if (block && block.id !== "textEditor") {
        const currentVariant = block.getAttribute("data-line-variant") || "A";
        if (block.classList.contains("dialogue-line") && currentVariant === variant) {
            block.classList.remove("dialogue-line");
            block.removeAttribute("data-line-variant");
        } else {
            block.classList.add("dialogue-line");
            block.setAttribute("data-line-variant", variant);
        }
    } else {
        document.execCommand("formatBlock", false, "div");
        let newNode = window.getSelection().anchorNode;
        let newBlock = newNode.nodeType === 3 ? newNode.parentNode : newNode;
        if (newBlock && newBlock.id !== "textEditor") {
            newBlock.classList.add("dialogue-line");
            newBlock.setAttribute("data-line-variant", variant);
        }
    }
    updateCanvas();
}

document.getElementById("btnQuoteLineA").addEventListener("click", () => toggleQuoteLine("A"));
document.getElementById("btnQuoteLineB").addEventListener("click", () => toggleQuoteLine("B"));

// 🆕 따옴표가 포함된 모든 문단에 강조선 A를 자동으로 적용
function autoApplyQuoteLines() {
    const quoteRegex = /("[^"\n]*"|“[^”\n]*”|「[^」\n]*」|『[^』\n]*』|‹[^›\n]*›|«[^»\n]*»)/;
    const blocks = Array.from(els.editor.children);
    blocks.forEach((block) => {
        if (
            block.classList.contains("chat-bubble") ||
            block.classList.contains("inline-title-block") ||
            block.classList.contains("inline-subtitle-block") ||
            block.classList.contains("content-box") ||
            block.classList.contains("content-image-block") ||
            block.tagName === "HR"
        ) {
            return;
        }
        const text = block.textContent || "";
        if (quoteRegex.test(text)) {
            block.classList.add("dialogue-line");
            block.setAttribute("data-line-variant", "A");
        }
    });
    updateCanvas();
}
document.getElementById("btnAutoQuoteLine").addEventListener("click", autoApplyQuoteLines);

// 🆕 대화 버블(채팅 느낌) 삽입/전환
document.getElementById("btnChatBubble").addEventListener("click", () => {
    els.editor.focus();
    const selection = window.getSelection();
    let range;
    let selectedText = "";

    if (selection.rangeCount && !selection.getRangeAt(0).collapsed) {
        range = selection.getRangeAt(0);
        selectedText = range.toString();
        range.deleteContents();
    } else if (selection.rangeCount) {
        range = selection.getRangeAt(0);
    } else {
        range = document.createRange();
        range.selectNodeContents(els.editor);
        range.collapse(false);
    }

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble side-left";
    bubble.setAttribute("data-side", "left");
    bubble.setAttribute("contenteditable", "false");

    const inner = document.createElement("div");
    inner.className = "bubble-inner";

    const speaker = document.createElement("span");
    speaker.className = "bubble-speaker";
    speaker.setAttribute("data-ph", "이름");
    speaker.setAttribute("contenteditable", "true");

    const content = document.createElement("span");
    content.className = "bubble-text";
    content.setAttribute("contenteditable", "true");
    content.textContent = selectedText || "대사를 입력하세요";

    const flipBtn = document.createElement("button");
    flipBtn.type = "button";
    flipBtn.className = "bubble-flip";
    flipBtn.setAttribute("contenteditable", "false");
    flipBtn.title = "좌우 전환";
    flipBtn.textContent = "⇄";
    flipBtn.addEventListener("mousedown", (e) => e.preventDefault());
    flipBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isLeft = bubble.classList.contains("side-left");
        bubble.classList.toggle("side-left", !isLeft);
        bubble.classList.toggle("side-right", isLeft);
        bubble.setAttribute("data-side", isLeft ? "right" : "left");
        updateCanvas();
    });

    inner.appendChild(speaker);
    inner.appendChild(content);
    inner.appendChild(flipBtn);
    bubble.appendChild(inner);

    range.insertNode(bubble);

    const br = document.createElement("div");
    br.innerHTML = "<br>";
    bubble.parentNode.insertBefore(br, bubble.nextSibling);

    const newRange = document.createRange();
    newRange.selectNodeContents(content);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);

    updateCanvas();
});

// 🆕 본문 중간 삽입형 블록(제목 / 부제목 / 강조 박스) 공용 삽입 함수
function insertContentBlock(className, placeholderText) {
    els.editor.focus();
    const selection = window.getSelection();
    let range;
    let selectedText = "";

    if (
        selection.rangeCount &&
        !selection.getRangeAt(0).collapsed &&
        els.editor.contains(selection.getRangeAt(0).commonAncestorContainer)
    ) {
        range = selection.getRangeAt(0);
        selectedText = range.toString();
        range.deleteContents();
    } else if (selection.rangeCount && els.editor.contains(selection.getRangeAt(0).commonAncestorContainer)) {
        range = selection.getRangeAt(0);
    } else {
        range = document.createRange();
        range.selectNodeContents(els.editor);
        range.collapse(false);
    }

    const block = document.createElement("div");
    block.className = className;
    block.setAttribute("contenteditable", "true");
    block.setAttribute("data-ph", placeholderText);
    if (selectedText) block.textContent = selectedText;

    range.insertNode(block);

    const br = document.createElement("div");
    br.innerHTML = "<br>";
    block.parentNode.insertBefore(br, block.nextSibling);

    const newRange = document.createRange();
    newRange.selectNodeContents(block);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);

    updateCanvas();
}

document.getElementById("btnAddTitleBlock").addEventListener("click", () => {
    insertContentBlock("inline-title-block", "제목을 입력하세요");
});
document.getElementById("btnAddSubtitleBlock").addEventListener("click", () => {
    insertContentBlock("inline-subtitle-block", "부제목을 입력하세요");
});

// 🆕 IME(한글 등) 조합 중에는 문단 재구성 로직이 개입하지 않도록 상태 추적
let isComposingIME = false;
els.editor.addEventListener("compositionstart", () => {
    isComposingIME = true;
});
els.editor.addEventListener("compositionend", () => {
    isComposingIME = false;
});

// 🆕 주어진 노드에서 #textEditor의 "직계 자식" 블록(문단)을 찾는다.
// 문단 구조가 항상 textEditor의 직계 자식 div로 유지되어야 너비/행간/문단간격 스타일이 일관되게 적용된다.
function findDirectChildBlock(node) {
    let el = node && node.nodeType === 3 ? node.parentNode : node;
    while (el && el.parentNode !== els.editor) {
        el = el.parentNode;
    }
    return el && el !== els.editor ? el : null;
}

// 🆕 캐럿 위치에서 현재 문단을 정확히 둘로 나눠 각각 textEditor의 직계 자식 div로 만든다.
// (문단 기준 = 엔터). 서식이 적용된 span 등은 Range.extractContents가 경계에서 자동으로 분리해준다.
function splitParagraphAtCaret() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (!els.editor.contains(range.commonAncestorContainer)) return;
    range.deleteContents();

    let blockEl = findDirectChildBlock(range.startContainer);

    if (!blockEl) {
        // 감싸는 블록이 없는 평문 텍스트인 경우, 우선 전체를 하나의 문단으로 감싼다.
        const wrapper = document.createElement("div");
        while (els.editor.firstChild) wrapper.appendChild(els.editor.firstChild);
        els.editor.appendChild(wrapper);
        blockEl = wrapper;
    }

    const newBlock = document.createElement("div");
    // 정렬/들여쓰기 등 문단 서식은 새 문단에도 이어진다.
    if (blockEl.className) newBlock.className = blockEl.className;
    if (blockEl.style && blockEl.style.textAlign) newBlock.style.textAlign = blockEl.style.textAlign;

    const afterRange = document.createRange();
    afterRange.setStart(range.startContainer, range.startOffset);
    afterRange.setEndAfter(blockEl.lastChild || blockEl);
    const afterContents = afterRange.extractContents();
    newBlock.appendChild(afterContents);

    if (blockEl.parentNode === els.editor) {
        els.editor.insertBefore(newBlock, blockEl.nextSibling);
    } else {
        els.editor.appendChild(newBlock);
    }

    if (!blockEl.hasChildNodes() || blockEl.textContent === "") {
        blockEl.innerHTML = "";
        blockEl.appendChild(document.createElement("br"));
    }
    if (!newBlock.hasChildNodes() || newBlock.textContent === "") {
        newBlock.innerHTML = "";
        newBlock.appendChild(document.createElement("br"));
    }

    const newRange = document.createRange();
    newRange.setStart(newBlock, 0);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    return newBlock;
}

// 🆕 문단 맨 앞에서 Backspace를 누르면 이전 문단과 깔끔하게 병합한다.
function mergeParagraphBackward() {
    const selection = window.getSelection();
    if (!selection.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    if (!els.editor.contains(range.startContainer)) return false;

    const blockEl = findDirectChildBlock(range.startContainer);
    if (!blockEl) return false;

    const isSpecialBlock = (el) =>
        el.classList.contains("chat-bubble") ||
        el.classList.contains("inline-title-block") ||
        el.classList.contains("inline-subtitle-block") ||
        el.classList.contains("content-image-block") ||
        el.classList.contains("content-box");

    if (isSpecialBlock(blockEl)) return false;

    const preRange = document.createRange();
    preRange.selectNodeContents(blockEl);
    preRange.setEnd(range.startContainer, range.startOffset);
    if (preRange.toString().length !== 0) return false;

    const prevBlock = blockEl.previousElementSibling;
    if (!prevBlock || isSpecialBlock(prevBlock)) return false;

    if (prevBlock.childNodes.length === 1 && prevBlock.firstChild.nodeName === "BR") {
        prevBlock.innerHTML = "";
    }

    const caretMarker = document.createElement("span");
    caretMarker.setAttribute("data-caret-marker", "1");
    prevBlock.appendChild(caretMarker);

    const isEmptyBlock = blockEl.childNodes.length === 1 && blockEl.firstChild.nodeName === "BR";
    if (!isEmptyBlock) {
        while (blockEl.firstChild) {
            prevBlock.appendChild(blockEl.firstChild);
        }
    }
    blockEl.remove();

    const marker = prevBlock.querySelector("[data-caret-marker]");
    if (marker) {
        const newRange = document.createRange();
        newRange.setStartBefore(marker);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        marker.remove();
    }
    return true;
}

// 🆕 문단 맨 끝에서 Delete를 누르면 다음 문단과 깔끔하게 병합한다. (mergeParagraphBackward와 대칭)
function mergeParagraphForward() {
    const selection = window.getSelection();
    if (!selection.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    if (!els.editor.contains(range.startContainer)) return false;

    const blockEl = findDirectChildBlock(range.startContainer);
    if (!blockEl) return false;

    const isSpecialBlock = (el) =>
        el.classList.contains("chat-bubble") ||
        el.classList.contains("inline-title-block") ||
        el.classList.contains("inline-subtitle-block") ||
        el.classList.contains("content-image-block") ||
        el.classList.contains("content-box");

    if (isSpecialBlock(blockEl)) return false;

    const postRange = document.createRange();
    postRange.selectNodeContents(blockEl);
    postRange.setStart(range.startContainer, range.startOffset);
    if (postRange.toString().length !== 0) return false;

    const nextBlock = blockEl.nextElementSibling;
    if (!nextBlock || isSpecialBlock(nextBlock)) return false;

    if (blockEl.childNodes.length === 1 && blockEl.firstChild.nodeName === "BR") {
        blockEl.innerHTML = "";
    }

    const caretMarker = document.createElement("span");
    caretMarker.setAttribute("data-caret-marker", "1");
    blockEl.appendChild(caretMarker);

    const isEmptyBlock = nextBlock.childNodes.length === 1 && nextBlock.firstChild.nodeName === "BR";
    if (!isEmptyBlock) {
        while (nextBlock.firstChild) {
            blockEl.appendChild(nextBlock.firstChild);
        }
    }
    nextBlock.remove();

    const marker = blockEl.querySelector("[data-caret-marker]");
    if (marker) {
        const newRange = document.createRange();
        newRange.setStartBefore(marker);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        marker.remove();
    }
    return true;
}

els.editor.addEventListener("keydown", function (e) {
    if (isComposingIME) return;

    if (e.key === "Enter") {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const node = selection.anchorNode;
        const el = node.nodeType === 3 ? node.parentNode : node;
        const inDialogue = el.closest(".dialogue-line");
        const inBubble = el.closest(".bubble-text, .bubble-speaker");
        const inTitleBlock = el.closest(".inline-title-block, .inline-subtitle-block");
        if (inDialogue || inBubble || inTitleBlock) {
            e.preventDefault();
            document.execCommand("insertLineBreak");
            return;
        }
        // 일반 문단: 항상 깔끔한 직계 자식 div 두 개로 분리해 너비/행간/문단간격이 일관되게 유지되도록 한다.
        e.preventDefault();
        splitParagraphAtCaret();
        updateCanvas();
        return;
    }

    if (e.key === "Backspace") {
        const handled = mergeParagraphBackward();
        if (handled) {
            e.preventDefault();
            updateCanvas();
        }
    }

    if (e.key === "Delete") {
        const handled = mergeParagraphForward();
        if (handled) {
            e.preventDefault();
            updateCanvas();
        }
    }
});

// 구분선 버튼
document.getElementById("btnFadeLine").addEventListener("click", () => {
    els.editor.focus();

    const baseColor = els.globalTextColor ? els.globalTextColor.value : "#22201c";
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

    updateCanvas();
});

// 🆕 본문 중간 사진 블록 삽입
let pendingImageInsertRange = null;

document.getElementById("btnAddImage").addEventListener("click", () => {
    els.editor.focus();
    const selection = window.getSelection();
    if (selection.rangeCount && els.editor.contains(selection.getRangeAt(0).commonAncestorContainer)) {
        pendingImageInsertRange = selection.getRangeAt(0).cloneRange();
    } else {
        const range = document.createRange();
        range.selectNodeContents(els.editor);
        range.collapse(false);
        pendingImageInsertRange = range;
    }
    const fileInput = document.getElementById("inlineImageInput");
    fileInput.value = "";
    fileInput.click();
});

document.getElementById("inlineImageInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        insertImageBlock(event.target.result);
    };
    reader.readAsDataURL(file);
});

function insertImageBlock(dataUrl) {
    els.editor.focus();
    const selection = window.getSelection();

    let range = pendingImageInsertRange;
    if (!range || !els.editor.contains(range.commonAncestorContainer)) {
        range = document.createRange();
        range.selectNodeContents(els.editor);
        range.collapse(false);
    }
    selection.removeAllRanges();
    selection.addRange(range);

    // 클릭 지점의 문단을 둘로 나누고 그 사이에 사진 블록을 끼워 넣는다.
    const afterBlock = splitParagraphAtCaret();

    const block = document.createElement("div");
    block.className = "content-image-block";
    block.setAttribute("contenteditable", "false");
    block.style.height = "240px";
    block.dataset.scale = "100";
    block.dataset.posX = "50";
    block.dataset.posY = "50";

    const inner = document.createElement("div");
    inner.className = "content-image-inner";
    inner.style.backgroundImage = `url(${dataUrl})`;
    inner.style.backgroundSize = "100% auto";
    inner.style.backgroundPosition = "50% 50%";

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "content-image-resize-handle";
    resizeHandle.setAttribute("contenteditable", "false");

    block.appendChild(inner);
    block.appendChild(resizeHandle);

    if (afterBlock && afterBlock.parentNode === els.editor) {
        els.editor.insertBefore(block, afterBlock);
    } else {
        els.editor.appendChild(block);
    }

    pendingImageInsertRange = null;
    updateCanvas();
}

// 사진 블록 상호작용: 마우스 휠 확대/축소, 드래그로 위치 이동, 하단 가장자리 드래그로 세로 길이 조절
els.editor.addEventListener(
    "wheel",
    (e) => {
        const inner = e.target.closest(".content-image-inner");
        if (!inner) return;
        e.preventDefault();
        const block = inner.parentElement;
        let scale = parseFloat(block.dataset.scale || "100");
        const delta = e.deltaY > 0 ? -5 : 5;
        scale = Math.min(400, Math.max(20, scale + delta));
        block.dataset.scale = String(scale);
        inner.style.backgroundSize = `${scale}% auto`;
        updateCanvas();
    },
    { passive: false }
);

let imgDragState = null;

els.editor.addEventListener("mousedown", (e) => {
    const resizeHandle = e.target.closest(".content-image-resize-handle");
    const inner = e.target.closest(".content-image-inner");

    if (resizeHandle) {
        const block = resizeHandle.parentElement;
        imgDragState = {
            type: "resize",
            block: block,
            startY: e.clientY,
            startHeight: block.getBoundingClientRect().height
        };
        e.preventDefault();
    } else if (inner) {
        const block = inner.parentElement;
        imgDragState = {
            type: "move",
            block: block,
            inner: inner,
            startX: e.clientX,
            startY: e.clientY,
            startPosX: parseFloat(block.dataset.posX || "50"),
            startPosY: parseFloat(block.dataset.posY || "50")
        };
        e.preventDefault();
    }
});

document.addEventListener("mousemove", (e) => {
    if (!imgDragState) return;

    if (imgDragState.type === "resize") {
        const deltaY = e.clientY - imgDragState.startY;
        const newHeight = Math.max(60, imgDragState.startHeight + deltaY);
        imgDragState.block.style.height = `${newHeight}px`;
    } else if (imgDragState.type === "move") {
        const rect = imgDragState.block.getBoundingClientRect();
        const deltaX = e.clientX - imgDragState.startX;
        const deltaY = e.clientY - imgDragState.startY;
        const posX = Math.min(100, Math.max(0, imgDragState.startPosX - (deltaX / rect.width) * 100));
        const posY = Math.min(100, Math.max(0, imgDragState.startPosY - (deltaY / rect.height) * 100));
        imgDragState.block.dataset.posX = String(posX);
        imgDragState.block.dataset.posY = String(posY);
        imgDragState.inner.style.backgroundPosition = `${posX}% ${posY}%`;
    }
});

document.addEventListener("mouseup", () => {
    if (imgDragState) {
        imgDragState = null;
        updateCanvas();
    }
});

// 초기화 바인딩 및 관찰 리스너 등록
document.addEventListener("DOMContentLoaded", () => {
    const alignCommandMap = {
        left: "justifyLeft",
        center: "justifyCenter",
        right: "justifyRight",
        justify: "justifyFull"
    };

    document.querySelectorAll(".segmented-control button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const parent = btn.parentElement;
            const targetId = parent.getAttribute("data-target");
            const value = btn.getAttribute("data-value");

            if (targetId === "alignH") {
                const selection = window.getSelection();
                const hasActiveSelection =
                    selection.rangeCount > 0 &&
                    !selection.getRangeAt(0).collapsed &&
                    els.editor.contains(selection.getRangeAt(0).commonAncestorContainer);

                if (hasActiveSelection) {
                    // 드래그한 문장에만 정렬 적용 (기본 정렬과 무관하게 개별 적용)
                    els.editor.focus();
                    document.execCommand(alignCommandMap[value] || "justifyLeft", false, null);
                    updateCanvas();
                    return;
                }
            }

            parent.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const hiddenInput = document.getElementById(targetId);
            if (hiddenInput) {
                hiddenInput.value = value;
                updateCanvas();
            }
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
        els.cardTitleInput,
        els.titleSize,
        els.titleWeight,
        els.cardSubtitleInput,
        els.subtitleSize,
        els.subtitleWeight,
        els.titleInput,
        els.creatorInput,
        els.canvasWidth,
        els.paddingY,
        els.paddingX,
        els.bgType,
        els.gradColor1,
        els.gradColor2,
        els.gradColor3,
        els.gradientDir,
        els.globalTextColor,
        els.subTextColor,
        els.hlColorA,
        els.hlColorB,
        els.hlColorC,
        els.quoteLineColorA,
        els.quoteLineColorB,
        els.bubbleColorLeft,
        els.bubbleTextColorLeft,
        els.bubbleColorRight,
        els.bubbleTextColorRight,
        els.enableQuoteColor,
        els.quoteColorA,
        els.quoteColorB,
        els.enableParenColor,
        els.parenColorA,
        els.parenColorB,
        els.fontSelect,
        els.wordBreak,
        els.bodyWeight,
        els.fontSize,
        els.letterSpacing,
        els.lineHeight,
        els.paraSpacing,
        els.fontScaleX,
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

// 이미지 캡처 및 저장 기능
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

// 배경 이미지 업로드 및 제어
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

// 🆕 붙여넣기: 클립보드의 서식(HTML)은 전부 무시하고 순수 텍스트 + 줄바꿈만 반영한다.
// 줄바꿈으로 만들어지는 문단은 직접 엔터를 쳤을 때(splitParagraphAtCaret)와
// 완전히 동일한 구조(#textEditor의 직계 자식 div)로 만들어서 문단 너비/행간/문단간격이
// 항상 일관되게 적용되도록 한다.
document.getElementById("textEditor").addEventListener("paste", function (e) {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");
    if (!text) return;
    const lines = text.split(/\r\n|\r|\n/);

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    if (!els.editor.contains(range.commonAncestorContainer)) return;
    range.deleteContents();

    if (lines.length === 1) {
        // 줄바꿈이 없는 단순 텍스트는 현재 위치에 그대로 삽입
        const textNode = document.createTextNode(lines[0]);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        // 여러 줄: 첫 줄은 현재 문단에 이어 붙이고, 나머지 줄들은 새 문단(직계 div)으로 분리
        const firstTextNode = document.createTextNode(lines[0]);
        range.insertNode(firstTextNode);

        let blockEl = findDirectChildBlock(firstTextNode);
        if (!blockEl) {
            const wrapper = document.createElement("div");
            while (els.editor.firstChild) wrapper.appendChild(els.editor.firstChild);
            els.editor.appendChild(wrapper);
            blockEl = wrapper;
        }

        let insertAfter = blockEl;
        let lastInsertedNode = firstTextNode;
        for (let i = 1; i < lines.length; i++) {
            const newDiv = document.createElement("div");
            if (lines[i].length > 0) {
                lastInsertedNode = document.createTextNode(lines[i]);
                newDiv.appendChild(lastInsertedNode);
            } else {
                newDiv.appendChild(document.createElement("br"));
                lastInsertedNode = newDiv;
            }
            insertAfter.parentNode.insertBefore(newDiv, insertAfter.nextSibling);
            insertAfter = newDiv;
        }

        const newRange = document.createRange();
        if (lastInsertedNode.nodeType === 3) {
            newRange.setStart(lastInsertedNode, lastInsertedNode.length);
        } else {
            newRange.selectNodeContents(lastInsertedNode);
        }
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }

    updateCanvas();
});

function normalizeParagraphs(container) {
    const paragraphs = [];
    let currentParagraphNodes = [];
    let currentParaMeta = null;

    function flushParagraph() {
        if (currentParagraphNodes.length > 0 || currentParaMeta) {
            paragraphs.push({ nodes: currentParagraphNodes, meta: currentParaMeta });
        }
        currentParagraphNodes = [];
        currentParaMeta = null;
    }
    function isAtomicBlock(node) {
        return (
            node.classList.contains("dialogue-line") ||
            node.classList.contains("chat-bubble") ||
            node.classList.contains("inline-title-block") ||
            node.classList.contains("inline-subtitle-block") ||
            node.classList.contains("content-box") ||
            node.classList.contains("content-image-block")
        );
    }
    // 문단 자체(직계 div)에 걸려있는 서식(들여쓰기, 정렬)을 보존하기 위해 메타데이터로 추출한다.
    function captureMeta(node) {
        const meta = { textAlign: "" };
        if (node.style && node.style.textAlign) {
            meta.textAlign = node.style.textAlign;
        }
        return meta.textAlign ? meta : null;
    }
    function parseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            currentParagraphNodes.push(node.cloneNode(true));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName;
            if (tagName === "BR") {
                if (currentParagraphNodes.length > 0 || currentParaMeta) {
                    flushParagraph();
                } else {
                    paragraphs.push({ nodes: [], meta: null });
                }
            } else if (isAtomicBlock(node)) {
                flushParagraph();
                paragraphs.push(node.cloneNode(true));
                flushParagraph();
            } else if (tagName === "DIV" || tagName === "P" || /^H[1-6]$/.test(tagName)) {
                flushParagraph();
                const meta = captureMeta(node);
                Array.from(node.childNodes).forEach(parseNodes);
                if (meta && !currentParaMeta) currentParaMeta = meta;
                flushParagraph();
            } else {
                if (
                    node.querySelector(
                        "div, p, br, .dialogue-line, .chat-bubble, .inline-title-block, .inline-subtitle-block, .content-box, .content-image-block"
                    )
                ) {
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
            const isTextEmpty = lastPara.nodes.every((node) => node.textContent.trim() === "");
            if (isTextEmpty && !lastPara.meta) {
                paragraphs.pop();
                continue;
            }
        }
        break;
    }
    container.innerHTML = "";
    paragraphs.forEach((pEntry) => {
        if (pEntry instanceof HTMLElement) {
            container.appendChild(pEntry);
        } else {
            const newDiv = document.createElement("div");
            if (pEntry.meta) {
                if (pEntry.meta.textAlign) newDiv.style.textAlign = pEntry.meta.textAlign;
            }
            if (pEntry.nodes.length === 0) {
                newDiv.appendChild(document.createElement("br"));
            } else {
                pEntry.nodes.forEach((n) => newDiv.appendChild(n));
            }
            container.appendChild(newDiv);
        }
    });
    if (container.childNodes.length === 0) container.innerHTML = "<div><br></div>";
}
