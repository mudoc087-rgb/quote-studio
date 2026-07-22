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
    infoMarginTop: document.getElementById("infoMarginTop"),

    ratioSelect: document.getElementById("ratioSelect"),
    canvasWidth: document.getElementById("canvasWidth"),
    paddingY: document.getElementById("paddingY"),
    paddingX: document.getElementById("paddingX"),
    bgType: document.getElementById("bgType"),
    bgOverlayColor: document.getElementById("bgOverlayColor"),
    bgOverlayOpacity: document.getElementById("bgOverlayOpacity"),
    bgOverlayLayer: document.getElementById("bgOverlayLayer"),
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
    textShadowBlur: document.getElementById("textShadowBlur"),

    autoParenBreak: document.getElementById("autoParenBreak"),
    layoutSelect: document.getElementById("layoutSelect"),
    midGap: document.getElementById("midGap") // 새 여백 조절 바 등록
};

function applyBubbleColors(container) {
    if (!container) return;
    const bubbles = container.querySelectorAll(".chat-bubble");
    bubbles.forEach((b) => {
        const inner = b.querySelector(".bubble-inner") || b;
        const isRight = b.classList.contains("side-right");
        const textNode = b.querySelector(".bubble-text") || inner;
        textNode.style.wordBreak = els.wordBreak ? els.wordBreak.value : "keep-all";
        const leftBg = els.bubbleColorLeft ? els.bubbleColorLeft.value : "#f5f9ff";
        const leftText = els.bubbleTextColorLeft ? els.bubbleTextColorLeft.value : "#252442";
        const rightBg = els.bubbleColorRight ? els.bubbleColorRight.value : "#7081ff";
        const rightText = els.bubbleTextColorRight ? els.bubbleTextColorRight.value : "#ffffff";

        if (isRight) {
            inner.style.backgroundColor = rightBg;
            textNode.style.color = rightText;
        } else {
            inner.style.backgroundColor = leftBg;
            textNode.style.color = leftText;
        }
    });
}

function applyInlineContentBlocks(container) {
    if (!container) return;
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
    const is2Col = els.layoutSelect && els.layoutSelect.value === "2column";
    const midGapArea = document.getElementById("midGapArea");
    const midGapVal = document.getElementById("midGapVal");
    const gapValue = els.midGap ? els.midGap.value : 40;

    if (midGapVal) midGapVal.textContent = `${gapValue}px`;
    // 1. 전체 캔버스(captureArea)에 강제로 먹혀있던 Grid 속성 제거
    if (midGapArea) midGapArea.style.display = is2Col ? "block" : "none";
    els.captureArea.classList.remove("layout-2column");
    els.captureArea.style.display = "";
    els.captureArea.style.gridTemplateColumns = "";
    els.captureArea.style.gap = "";
    els.captureArea.style.padding = `${els.paddingY.value}px ${els.paddingX.value}px`;
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
    if (bgTypeVal === "image" && els.bgOverlayColor && els.bgOverlayOpacity) {
        bgOverlayLayer.style.backgroundColor = els.bgOverlayColor.value;
        bgOverlayLayer.style.opacity = els.bgOverlayOpacity.value;
    }
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
        if (grad1Wrapper) grad1Wrapper.style.display = "flex";
        if (grad2Wrapper) grad2Wrapper.style.display = "none";
        if (grad3Wrapper) grad3Wrapper.style.display = "none";
        if (gradientDirWrapper) gradientDirWrapper.style.display = "none";

        els.captureArea.style.background = els.gradColor1.value;
    }

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

    const textWrapper = document.getElementById("canvasTextWrapper");
    if (textWrapper) {
        let rawHTML = els.editor.innerHTML || "<div><br></div>";
        textWrapper.innerHTML = rawHTML;

        const canvasBubbles = textWrapper.querySelectorAll(".chat-bubble");
        canvasBubbles.forEach((bubble) => {
            const memberId = bubble.getAttribute("data-member-id");
            const member = chatMembers.find((m) => m.id == memberId);
            if (member) {
                const speaker = bubble.querySelector(".bubble-speaker");
                if (speaker) {
                    speaker.textContent = member.name;

                    speaker.style.color = member.color;
                }
            }
        });

        const canvasSpeakers = textWrapper.querySelectorAll(".bubble-speaker");
        canvasSpeakers.forEach((speaker) => {
            if (!speaker.textContent.trim() || speaker.textContent.trim() === "이름") {
                speaker.textContent = "";
                speaker.style.display = "none";
                const parentBubble = speaker.closest(".chat-bubble");
                if (parentBubble) {
                    parentBubble.style.display = "none";
                }
            }
        });

        normalizeParagraphs(textWrapper);

        textWrapper.style.setProperty("--quote-line-color-a", els.quoteLineColorA.value);
        textWrapper.style.setProperty("--quote-line-color-b", els.quoteLineColorB.value);
        if (els.editor) {
            els.editor.style.setProperty("--quote-line-color-a", els.quoteLineColorA.value);
            els.editor.style.setProperty("--quote-line-color-b", els.quoteLineColorB.value);
        }

        applySmartHighlighting(textWrapper);

        if (document.activeElement !== els.editor) {
            applySmartHighlighting(els.editor);
        }

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

        textWrapper.style.overflowWrap = "break-word";
        textWrapper.style.wordWrap = "break-word";

        textWrapper.style.color = els.globalTextColor.value;

        if (is2Col) {
            textWrapper.style.columnCount = "2";
            textWrapper.style.columnGap = `${gapValue}px`;
            textWrapper.style.columnRule = "none"; // 세로줄 완전히 없애기
        } else {
            textWrapper.style.columnCount = "1";
            textWrapper.style.columnGap = "normal";
            textWrapper.style.columnRule = "none";
        }
        if (els.editor) {
            els.editor.style.fontWeight = els.bodyWeight ? els.bodyWeight.value : "400";
            els.editor.style.color = els.globalTextColor.value;
            els.editor.style.setProperty("--parent-lh", `${els.lineHeight.value}px`);
        }

        applyBubbleColors(els.editor);
        applyBubbleColors(textWrapper);

        applyInlineContentBlocks(els.editor);
        applyInlineContentBlocks(textWrapper);

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

        const scaleFactor = (parseInt(els.fontScaleX.value) || 100) / 100;
        textWrapper.style.display = "block";
        applyHorizontalScale(textWrapper, scaleFactor, els.alignH.value);

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

    const infoContainer = document.getElementById("canvasInfo");
    const textContainer = document.getElementById("canvasTextContainer");

    if (infoContainer && textContainer) {
        if (infoContainer.parentNode !== textContainer) {
            textContainer.appendChild(infoContainer);
        }
        const infoMarginVal = els.infoMarginTop ? els.infoMarginTop.value : 35;

        infoContainer.style.marginTop = `${infoMarginVal}px`;

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
        if (
            span.classList.contains("bubble-speaker") ||
            span.classList.contains("bubble-text") ||
            span.closest(".bubble-profile") ||
            span.closest(".bubble-action-btn") ||
            span.closest(".inline-title-block") ||
            span.closest(".inline-subtitle-block")
        ) {
            return;
        }

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

document.getElementById("btnQuoteColorB").addEventListener("click", () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!els.editor.contains(range.commonAncestorContainer)) return;

    const container = document.createElement("div");
    container.appendChild(range.cloneContents());
    const nestedSpans = container.querySelectorAll("span");
    nestedSpans.forEach((s) => {
        // 기존 스타일이나 속성을 초기화하여 텍스트만 남깁니다.
        s.removeAttribute("data-manual-quote-color");
        s.style.color = "";
    });

    const fragment = range.extractContents();

    const innerSpans = fragment.querySelectorAll ? fragment.querySelectorAll("span") : [];
    if (innerSpans.length > 0) {
        innerSpans.forEach((s) => {
            s.setAttribute("data-manual-quote-color", "B");
            s.style.color = els.quoteColorB ? els.quoteColorB.value : "#efdbff";
        });
    }

    const span = document.createElement("span");
    span.setAttribute("data-manual-quote-color", "B");
    span.style.color = els.quoteColorB ? els.quoteColorB.value : "#efdbff";
    span.style.fontWeight = "inherit";
    span.style.fontFamily = "inherit";

    span.appendChild(fragment);
    range.insertNode(span);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    newRange.collapse(false);
    selection.addRange(newRange);

    if (typeof syncLiveHighlights === "function") syncLiveHighlights();
    updateCanvas();
});

let savedHighlightRange = null;

document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    if (selection.rangeCount && !selection.getRangeAt(0).collapsed) {
        const range = selection.getRangeAt(0);
        if (els.editor.contains(range.commonAncestorContainer)) {
            savedHighlightRange = range.cloneRange();
        }
    }
});

document.getElementById("selHighlight").addEventListener("change", function () {
    const val = this.value;
    if (!val) return;
    let color = "#fbe27a";
    if (val === "A") color = els.hlColorA.value;
    if (val === "B") color = els.hlColorB.value;
    if (val === "C") color = els.hlColorC.value;

    if (savedHighlightRange) {
        try {
            const span = document.createElement("span");
            span.style.backgroundColor = color;
            span.appendChild(savedHighlightRange.extractContents());
            savedHighlightRange.insertNode(span);
        } catch (e) {
            console.error("하이라이트 적용 실패:", e);
        }
        savedHighlightRange = null;
    }

    this.value = "";
    updateCanvas();
});

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

let isComposingIME = false;
els.editor.addEventListener("compositionstart", () => {
    isComposingIME = true;
});
els.editor.addEventListener("compositionend", () => {
    isComposingIME = false;
});

function findDirectChildBlock(node) {
    let el = node && node.nodeType === 3 ? node.parentNode : node;
    while (el && el.parentNode !== els.editor) {
        el = el.parentNode;
    }
    return el && el !== els.editor ? el : null;
}

function splitParagraphAtCaret() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (!els.editor.contains(range.commonAncestorContainer)) return;
    range.deleteContents();

    let blockEl = findDirectChildBlock(range.startContainer);

    if (!blockEl) {
        const wrapper = document.createElement("div");
        while (els.editor.firstChild) wrapper.appendChild(els.editor.firstChild);
        els.editor.appendChild(wrapper);
        blockEl = wrapper;
    }

    const newBlock = document.createElement("div");
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

    const resizeHandleLeft = document.createElement("div");
    resizeHandleLeft.className = "content-image-resize-handle-left";
    resizeHandleLeft.setAttribute("contenteditable", "false");

    const resizeHandleRight = document.createElement("div");
    resizeHandleRight.className = "content-image-resize-handle-right";
    resizeHandleRight.setAttribute("contenteditable", "false");

    block.appendChild(inner);
    block.appendChild(resizeHandle);
    block.appendChild(resizeHandleLeft);
    block.appendChild(resizeHandleRight);

    if (afterBlock && afterBlock.parentNode === els.editor) {
        els.editor.insertBefore(block, afterBlock);
    } else {
        els.editor.appendChild(block);
    }

    pendingImageInsertRange = null;
    updateCanvas();
}

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

function getEventPoint(e) {
    if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (e.changedTouches && e.changedTouches.length > 0)
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    return { x: e.clientX, y: e.clientY };
}

function handleImgDragStart(e) {
    const resizeHandle = e.target.closest(".content-image-resize-handle");
    const resizeHandleH = e.target.closest(".content-image-resize-handle-left, .content-image-resize-handle-right");
    const inner = e.target.closest(".content-image-inner");
    const point = getEventPoint(e);

    if (resizeHandleH) {
        const block = resizeHandleH.parentElement;
        imgDragState = {
            type: "resize-width",
            block,
            startX: point.x,
            startWidth: block.getBoundingClientRect().width
        };
        e.preventDefault();
    } else if (resizeHandle) {
        const block = resizeHandle.parentElement;
        imgDragState = { type: "resize", block, startY: point.y, startHeight: block.getBoundingClientRect().height };
        e.preventDefault();
    } else if (inner) {
        const block = inner.parentElement;
        imgDragState = {
            type: "move",
            block,
            inner,
            startX: point.x,
            startY: point.y,
            startPosX: parseFloat(block.dataset.posX || "50"),
            startPosY: parseFloat(block.dataset.posY || "50")
        };
        e.preventDefault();
    }
}

function handleImgDragMove(e) {
    if (!imgDragState) return;
    const point = getEventPoint(e);

    if (imgDragState.type === "resize") {
        const deltaY = point.y - imgDragState.startY;
        imgDragState.block.style.height = `${Math.max(60, imgDragState.startHeight + deltaY)}px`;
    } else if (imgDragState.type === "resize-width") {
        const deltaX = point.x - imgDragState.startX;
        const containerWidth = imgDragState.block.parentElement.getBoundingClientRect().width;
        const minWidth = containerWidth * 0.3;
        const newWidth = Math.min(containerWidth, Math.max(minWidth, imgDragState.startWidth + deltaX * 2));
        imgDragState.block.style.width = `${newWidth}px`;
    } else if (imgDragState.type === "move") {
        const rect = imgDragState.block.getBoundingClientRect();
        const deltaX = point.x - imgDragState.startX;
        const deltaY = point.y - imgDragState.startY;
        const posX = Math.min(100, Math.max(0, imgDragState.startPosX - (deltaX / rect.width) * 100));
        const posY = Math.min(100, Math.max(0, imgDragState.startPosY - (deltaY / rect.height) * 100));
        imgDragState.block.dataset.posX = String(posX);
        imgDragState.block.dataset.posY = String(posY);
        imgDragState.inner.style.backgroundPosition = `${posX}% ${posY}%`;
    }
    if (e.cancelable) e.preventDefault();
}

function handleImgDragEnd() {
    if (imgDragState) {
        imgDragState = null;
        updateCanvas();
    }
}

els.editor.addEventListener("mousedown", handleImgDragStart);
els.editor.addEventListener("touchstart", handleImgDragStart, { passive: false });

document.addEventListener("mousemove", handleImgDragMove);
document.addEventListener("touchmove", handleImgDragMove, { passive: false });

document.addEventListener("mouseup", handleImgDragEnd);
document.addEventListener("touchend", handleImgDragEnd);
/* =========================================================
   [개선 완료] 채팅 멤버 관리, 접기, 대본 파싱 및 독립 이벤트 로직
   ========================================================= */

let chatMembers = [
    { id: Date.now(), name: "A", color: "#97cddf", profile: "" },
    { id: Date.now() + 1, name: "B", color: "#e697ba", profile: "" }
];

let memberPanelCollapsed = false;
document.getElementById("btnToggleMemberPanel")?.addEventListener("click", () => {
    memberPanelCollapsed = !memberPanelCollapsed;
    const content = document.getElementById("memberPanelContent");
    const arrow = document.getElementById("memberPanelArrow");
    if (content && arrow) {
        content.style.display = memberPanelCollapsed ? "none" : "block";
        arrow.textContent = memberPanelCollapsed ? "▶" : "▼";
    }
});

function renderMembers() {
    const container = document.getElementById("memberListContainer");
    if (!container) return;
    container.innerHTML = "";

    chatMembers.forEach((member, index) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "4px";
        row.style.alignItems = "center";
        row.style.border = "1px solid #e2e8f0";
        row.style.padding = "4px";
        row.style.borderRadius = "6px";
        row.style.background = "#f8fafc";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        const maxSize = 200;
                        canvas.width = maxSize;
                        canvas.height = maxSize;

                        const size = Math.min(img.width, img.height);
                        const sx = (img.width - size) / 2;
                        const sy = (img.height - size) / 2;

                        ctx.drawImage(img, sx, sy, size, size, 0, 0, maxSize, maxSize);

                        member.profile = canvas.toDataURL("image/jpeg", 0.85);
                        renderMembers();
                        updateCanvas();
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        const profileBtn = document.createElement("button");
        profileBtn.style.width = "24px";
        profileBtn.style.height = "24px";
        profileBtn.style.padding = "0";
        profileBtn.style.border = "1px dashed #cbd5e1";
        profileBtn.style.borderRadius = "50%";
        profileBtn.style.backgroundSize = "cover";
        profileBtn.style.backgroundPosition = "center";
        profileBtn.style.cursor = "pointer";
        profileBtn.style.fontSize = "9px";
        profileBtn.style.color = "#64748b";
        profileBtn.style.flexShrink = "0";
        profileBtn.style.backgroundImage = member.profile ? `url(${member.profile})` : "none";
        profileBtn.style.backgroundColor = member.profile ? "transparent" : member.color;
        profileBtn.textContent = member.profile ? "" : "P";
        profileBtn.onclick = () => fileInput.click();

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = member.name;
        nameInput.placeholder = "이름";
        nameInput.style.width = "100%";
        nameInput.style.flex = "1";
        nameInput.style.fontSize = "11px";
        nameInput.style.padding = "2px 4px";
        nameInput.style.border = "1px solid #cbd5e1";
        nameInput.style.borderRadius = "4px";

        nameInput.addEventListener("input", (e) => {
            member.name = e.target.value;

            const matchBubbles = els.editor.querySelectorAll(`.chat-bubble[data-member-id="${member.id}"]`);
            matchBubbles.forEach((bubble) => {
                const speakerNode = bubble.querySelector(".bubble-speaker");
                if (speakerNode) {
                    speakerNode.style.color = member.color;
                }
                const profileImgNode = bubble.querySelector(".bubble-profile");
                if (profileImgNode && !member.profile) {
                    profileImgNode.style.backgroundColor = member.color;
                }
            });
            profileBtn.style.backgroundColor = member.profile ? "transparent" : member.color;
            updateCanvas();
        });

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = member.color;
        colorInput.style.width = "20px";
        colorInput.style.height = "20px";
        colorInput.style.padding = "0";
        colorInput.style.border = "none";
        colorInput.style.cursor = "pointer";
        colorInput.style.background = "none";
        colorInput.style.flexShrink = "0";
        colorInput.onchange = (e) => {
            member.color = e.target.value;

            const matchBubbles = els.editor.querySelectorAll(`.chat-bubble[data-member-id="${member.id}"]`);
            matchBubbles.forEach((bubble) => {
                const speakerNode = bubble.querySelector(".bubble-speaker");
                if (speakerNode) {
                    speakerNode.style.color = member.color;
                }
            });
            updateCanvas();
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "×";
        delBtn.style.width = "16px";
        delBtn.style.border = "none";
        delBtn.style.background = "none";
        delBtn.style.cursor = "pointer";
        delBtn.style.color = "#ef4444";
        delBtn.style.fontWeight = "bold";
        delBtn.style.fontSize = "12px";
        delBtn.style.flexShrink = "0";
        delBtn.onclick = () => {
            chatMembers.splice(index, 1);
            renderMembers();
            updateCanvas();
        };

        row.appendChild(fileInput);
        row.appendChild(profileBtn);
        row.appendChild(nameInput);
        row.appendChild(colorInput);
        row.appendChild(delBtn);
        container.appendChild(row);
    });
}

document.getElementById("btnAddMember")?.addEventListener("click", () => {
    chatMembers.push({ id: Date.now(), name: "새 인물", color: "#000000", profile: "" });
    renderMembers();
    updateCanvas();
});

renderMembers();

document.getElementById("btnAutoChatParse")?.addEventListener("click", () => {
    if (chatMembers.length === 0) {
        alert("최소 1명 이상의 멤버를 등록해주세요.");
        return;
    }

    const editor = document.getElementById("textEditor");
    let rawText = editor.innerText;
    editor.innerHTML = "";

    const lines = rawText.split("\n");
    const autoBreak = els.autoParenBreak ? els.autoParenBreak.checked : true;

    const chatRegex = /^([^|:]+)\s*[|:]\s*(.+)$/;
    const startQuotes = ['"', "'", "“", "「", "『"];
    const endQuotes = ['"', "'", "”", "」", "』"];

    lines.forEach((line) => {
        const text = line.trim();
        if (!text) {
            const brDiv = document.createElement("div");
            brDiv.innerHTML = "<br>";
            editor.appendChild(brDiv);
            return;
        }

        const matchChat = text.match(chatRegex);
        const firstChar = text.charAt(0);
        const lastChar = text.charAt(text.length - 1);
        const matchQuote = startQuotes.includes(firstChar);

        if (matchChat) {
            const speakerName = matchChat[1].trim();
            let dialogue = matchChat[2].trim();

            if (autoBreak) {
                dialogue = dialogue.replace(/(["”」』›»])\s*(\(|\[|\{|<)/g, "$1\n$2");
            }

            const bubble = createParsedBubble(speakerName, dialogue);
            editor.appendChild(bubble);
        } else if (matchQuote) {
            let dialogue = text;

            if (autoBreak) {
                dialogue = dialogue.replace(/(["”」』›»])\s*(\(|\[|\{|<)/g, "$1\n$2");
            }

            const defaultSpeaker = chatMembers[0].name;
            const bubble = createParsedBubble(defaultSpeaker, dialogue);
            editor.appendChild(bubble);
        } else {
            const div = document.createElement("div");
            div.textContent = text;
            editor.appendChild(div);
        }
    });

    updateCanvas();
});

function createParsedBubble(speakerName, contentStr) {
    let member = chatMembers.find((m) => m.name === speakerName);
    if (!member) member = chatMembers[0];

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble side-left";
    bubble.setAttribute("data-side", "left");
    bubble.setAttribute("contenteditable", "false");
    bubble.setAttribute("data-member-id", member.id);

    const profileImg = document.createElement("div");
    profileImg.className = "bubble-profile";
    profileImg.setAttribute("data-action", "change-member");
    if (member.profile) {
        profileImg.style.backgroundImage = `url(${member.profile})`;
        profileImg.style.backgroundColor = "transparent";
    } else {
        profileImg.style.backgroundColor = member.color;
    }

    const contentCol = document.createElement("div");
    contentCol.className = "bubble-content-col";

    const infoRow = document.createElement("div");
    infoRow.className = "bubble-info";

    const speaker = document.createElement("span");
    speaker.className = "bubble-speaker";
    speaker.textContent = member.name;
    speaker.style.color = member.color;
    speaker.setAttribute("data-action", "change-member");

    const flipBtn = document.createElement("button");
    flipBtn.className = "bubble-action-btn bubble-flip-btn";
    flipBtn.innerHTML = "⇄";
    flipBtn.title = "좌우 전환";
    flipBtn.setAttribute("data-action", "flip-bubble");

    const delBtn = document.createElement("button");
    delBtn.className = "bubble-action-btn bubble-delete-btn";
    delBtn.innerHTML = "✕";
    delBtn.title = "삭제";
    delBtn.setAttribute("data-action", "delete-bubble");

    infoRow.appendChild(speaker);
    infoRow.appendChild(flipBtn);
    infoRow.appendChild(delBtn);

    const inner = document.createElement("div");
    inner.className = "bubble-inner";

    const content = document.createElement("span");
    content.className = "bubble-text";
    content.setAttribute("contenteditable", "true");

    const lines = contentStr.split("\n");
    lines.forEach((l, idx) => {
        content.appendChild(document.createTextNode(l));
        if (idx < lines.length - 1) content.appendChild(document.createElement("br"));
    });

    inner.appendChild(content);
    contentCol.appendChild(infoRow);
    contentCol.appendChild(inner);

    bubble.appendChild(profileImg);
    bubble.appendChild(contentCol);

    return bubble;
}

document.getElementById("textEditor").addEventListener("click", (e) => {
    const delBtn = e.target.closest('[data-action="delete-bubble"]');
    if (delBtn) {
        const bubble = delBtn.closest(".chat-bubble");
        if (bubble) {
            bubble.remove();
            updateCanvas();
        }
        e.stopPropagation();
        e.preventDefault();
        return;
    }

    const flipBtn = e.target.closest('[data-action="flip-bubble"]');
    if (flipBtn) {
        const bubble = flipBtn.closest(".chat-bubble");
        if (bubble) {
            const isLeft = bubble.classList.contains("side-left");
            bubble.classList.toggle("side-left", !isLeft);
            bubble.classList.toggle("side-right", isLeft);
            bubble.setAttribute("data-side", isLeft ? "right" : "left");
            updateCanvas();
        }
        e.stopPropagation();
        e.preventDefault();
        return;
    }

    const memberTrigger = e.target.closest('[data-action="change-member"]');
    if (memberTrigger) {
        const bubble = memberTrigger.closest(".chat-bubble");
        if (bubble && chatMembers.length > 0) {
            const currentId = bubble.getAttribute("data-member-id");
            if (!currentId) return;

            let idx = chatMembers.findIndex((m) => m.id == currentId);
            let nextIdx = (idx + 1) % chatMembers.length;
            const nextMember = chatMembers[nextIdx];

            bubble.setAttribute("data-member-id", nextMember.id);

            const speaker = bubble.querySelector(".bubble-speaker");
            if (speaker) {
                speaker.textContent = nextMember.name;
                speaker.style.color = nextMember.color;
            }

            let profileImg = bubble.querySelector(".bubble-profile");
            if (nextMember.profile) {
                if (!profileImg) {
                    profileImg = document.createElement("div");
                    profileImg.className = "bubble-profile";
                    profileImg.style.width = "24px";
                    profileImg.style.height = "24px";
                    profileImg.style.borderRadius = "50%";
                    profileImg.style.backgroundSize = "cover";
                    profileImg.setAttribute("data-action", "change-member");
                    speaker.parentNode.insertBefore(profileImg, speaker);
                }
                profileImg.style.backgroundImage = `url(${nextMember.profile})`;
                profileImg.style.backgroundColor = "transparent";
            } else if (profileImg) {
                profileImg.style.backgroundImage = "none";
                profileImg.style.backgroundColor = nextMember.color;
            }

            updateCanvas();
        }
        e.stopPropagation();
        e.preventDefault();
        return;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const alignCommandMap = {
        left: "justifyLeft",
        center: "justifyCenter",
        right: "justifyRight",
        justify: "justifyFull"
    };
    const toggleProfile = document.getElementById("toggleProfile");
    const toggleName = document.getElementById("toggleName");

    const editorContainer = document.getElementById("textEditor");
    const canvasContainer = document.getElementById("canvasTextWrapper");

    if (toggleProfile) {
        toggleProfile.addEventListener("change", (e) => {
            const hasChecked = e.target.checked;
            if (editorContainer) {
                if (hasChecked) editorContainer.classList.remove("hide-profiles");
                else editorContainer.classList.add("hide-profiles");
            }
            if (canvasContainer) {
                if (hasChecked) canvasContainer.classList.remove("hide-profiles");
                else canvasContainer.classList.add("hide-profiles");
            }
            updateCanvas();
        });
    }

    if (toggleName) {
        toggleName.addEventListener("change", (e) => {
            const hasChecked = e.target.checked;
            if (editorContainer) {
                if (hasChecked) editorContainer.classList.remove("hide-names");
                else editorContainer.classList.add("hide-names");
            }
            if (canvasContainer) {
                if (hasChecked) canvasContainer.classList.remove("hide-names");
                else canvasContainer.classList.add("hide-names");
            }
            updateCanvas();
        });
    }

    if (els.autoParenBreak) {
        els.autoParenBreak.addEventListener("change", () => {
            updateCanvas();
        });
    }

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

    els.editor.addEventListener("input", scheduleUpdateCanvas);
    if (typeof renderPresets === "function") renderPresets();

    const autoTriggers = [
        els.cardTitleInput,
        els.titleSize,
        els.titleWeight,
        els.cardSubtitleInput,
        els.subtitleSize,
        els.subtitleWeight,
        els.titleInput,
        els.creatorInput,
        els.infoMarginTop,
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
    let _updateCanvasRAF = null;
    function scheduleUpdateCanvas() {
        if (_updateCanvasRAF) cancelAnimationFrame(_updateCanvasRAF);
        _updateCanvasRAF = requestAnimationFrame(() => {
            _updateCanvasRAF = null;
            updateCanvas();
        });
    }

    autoTriggers.forEach((element) => {
        if (element) {
            element.addEventListener("input", scheduleUpdateCanvas);
            element.addEventListener("change", scheduleUpdateCanvas);
        }
    });

    setTimeout(() => {
        updateCanvas();
    }, 50);
});

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
    overlayLayer.style.backgroundColor = document.getElementById("bgOverlayColor").value;
    overlayLayer.style.opacity = document.getElementById("bgOverlayOpacity").value;
}
["bgImageSize", "bgImageX", "bgImageY", "bgImageBlur", "bgOverlayColor", "bgOverlayOpacity"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateBgImageStyles);
});

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
        const textNode = document.createTextNode(lines[0]);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
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

// 2. 레이아웃 및 중간 여백 슬라이더 변경 시 실시간 반영
document.getElementById("layoutSelect").addEventListener("change", updateCanvas);
if (els.midGap) {
    els.midGap.addEventListener("input", updateCanvas);
}

// 1. 페이지 분할선 삽입 버튼 이벤트
document.getElementById("btnPageBreak").addEventListener("click", () => {
    els.editor.focus();

    const hrHTML = `<hr class="page-break-line" style="border: none; margin: 24px 0; width: 100%;" contenteditable="false" />`;

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
document.getElementById("btnSplitSave").addEventListener("click", async () => {
    if (!els.captureArea) return;

    const textWrapper = document.getElementById("canvasTextWrapper");
    if (!textWrapper) return;

    const pageBreaks = Array.from(textWrapper.querySelectorAll(".page-break-line"));
    if (pageBreaks.length === 0) {
        alert("페이지 분할선이 없습니다. 먼저 분할선을 삽입해주세요!");
        return;
    }

    prepareCanvasForCapture(els.captureArea);

    // 분할선이 문단(div) 안쪽에 중첩돼 있어도 textWrapper의 "직계 자식" 레벨까지 끌어올림
    function promoteDividersToTopLevel(root) {
        const dividers = Array.from(root.querySelectorAll(".page-break-line"));
        dividers.forEach((divider) => {
            while (divider.parentNode !== root) {
                const parent = divider.parentNode;
                const grandParent = parent.parentNode;

                const afterFragment = document.createDocumentFragment();
                let sibling = divider.nextSibling;
                while (sibling) {
                    const next = sibling.nextSibling;
                    afterFragment.appendChild(sibling);
                    sibling = next;
                }

                grandParent.insertBefore(divider, parent.nextSibling);

                if (afterFragment.childNodes.length > 0) {
                    const afterClone = parent.cloneNode(false);
                    afterClone.appendChild(afterFragment);
                    grandParent.insertBefore(afterClone, divider.nextSibling);
                }

                if (parent.childNodes.length === 0) {
                    parent.remove();
                }
            }
        });
    }

    // 실제 편집화면은 안 건드리고, 복제본에서만 분할선을 최상위로 끌어올려 분할 처리
    const workWrapper = textWrapper.cloneNode(true);
    promoteDividersToTopLevel(workWrapper);

    const originalNodes = Array.from(workWrapper.childNodes);
    const chunks = [];
    let currentChunk = [];

    for (const node of originalNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("page-break-line")) {
            chunks.push(currentChunk);
            currentChunk = [];
        } else {
            currentChunk.push(node);
        }
    }
    if (currentChunk.length > 0) chunks.push(currentChunk);

    // 분할선 뒤에 자동으로 붙는 빈 <br>이 다음 페이지 상단 여백을 깨는 것 방지
    chunks.forEach((chunk, idx) => {
        if (idx === 0 || chunk.length === 0) return;
        let first = chunk[0];
        if (first.nodeType === Node.ELEMENT_NODE && first.tagName === "BR") {
            chunk.shift();
            first = chunk[0];
        }
        if (
            first &&
            first.nodeType === Node.ELEMENT_NODE &&
            first.firstChild &&
            first.firstChild.nodeType === Node.ELEMENT_NODE &&
            first.firstChild.tagName === "BR"
        ) {
            first.removeChild(first.firstChild);
        }
    });

    console.log("분할된 페이지 수:", chunks.length);

    const captureWidth = els.captureArea.offsetWidth;
    const zip = new JSZip();

    for (let i = 0; i < chunks.length; i++) {
        const clone = els.captureArea.cloneNode(true);

        const cloneTextWrapper = clone.querySelector("#canvasTextWrapper");
        const cloneTitle = clone.querySelector("#canvasTitleWrapper");
        const cloneSubtitle = clone.querySelector("#canvasSubtitleWrapper");

        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));

        clone.style.position = "fixed";
        clone.style.left = "-99999px";
        clone.style.top = "0";
        clone.style.margin = "0";
        clone.style.width = `${captureWidth}px`;
        clone.style.height = "auto";
        clone.style.aspectRatio = "auto";
        clone.style.maxHeight = "none";

        cloneTextWrapper.innerHTML = "";
        chunks[i].forEach((n) => cloneTextWrapper.appendChild(n.cloneNode(true)));

        if (i > 0) {
            if (cloneTitle) cloneTitle.style.display = "none";
            if (cloneSubtitle) cloneSubtitle.style.display = "none";
        }

        clone.querySelectorAll(".bubble-action-btn").forEach((btn) => (btn.style.display = "none"));

        document.body.appendChild(clone);

        try {
            const canvas = await html2canvas(clone, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 2
            });
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
            zip.file(`excerpt_part${i + 1}.png`, blob);
        } catch (err) {
            console.error(`분할 캡처 중 오류 발생 (페이지 ${i + 1}):`, err);
        } finally {
            document.body.removeChild(clone);
        }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(zipBlob);
    const zipLink = document.createElement("a");
    zipLink.download = `excerpt_split_${Date.now()}.zip`;
    zipLink.href = zipUrl;
    zipLink.click();
    URL.revokeObjectURL(zipUrl);

    restoreCanvasAfterCapture(els.captureArea);
});
