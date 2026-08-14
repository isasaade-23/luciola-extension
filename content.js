// Injected on demand (activeTab): collects visible text blocks, asks the
// service worker for scores, and highlights blocks above the threshold.
// Triage only: it marks, it never removes or blocks anything.
// The popup drives it by calling window.__luciolaRescan(threshold).
(() => {
  if (window.__luciolaRescan) return;

  const STYLE = `
  .luciola-flag { outline: 2px solid rgba(238,108,77,.85); outline-offset: 2px;
                  border-radius: 4px; position: relative; }
  .luciola-chip { position: absolute; top: -10px; right: -6px; z-index: 2147483646;
                  background: #1F3050; color: #fff; border: 1px solid #EE6C4D;
                  border-radius: 999px; padding: 1px 7px; font: 700 10px/1.5 sans-serif;
                  letter-spacing: .4px; pointer-events: none; }
  `;
  const styleEl = document.createElement("style");
  styleEl.textContent = STYLE;
  document.documentElement.appendChild(styleEl);

  const SELECTOR =
    'p, li, blockquote, [data-testid="tweetText"], [data-ad-comet-preview="message"]';

  function candidateBlocks() {
    const out = [];
    for (const el of document.querySelectorAll(SELECTOR)) {
      if (el.closest("nav, header, footer, script, style")) continue;
      if (el.querySelector(SELECTOR)) continue; // keep leaves only
      const text = (el.innerText || "").trim();
      if (text.length < 8 || text.length > 2000) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      out.push({ el, text: text.slice(0, 1000) });
    }
    return out;
  }

  function clearFlags() {
    for (const el of document.querySelectorAll(".luciola-flag")) {
      el.classList.remove("luciola-flag");
    }
    for (const chip of document.querySelectorAll(".luciola-chip")) chip.remove();
  }

  window.__luciolaRescan = async (threshold) => {
    clearFlags();
    const blocks = candidateBlocks();
    if (blocks.length === 0) return { scanned: 0, flagged: 0 };
    const resp = await chrome.runtime.sendMessage({
      type: "luciola:score",
      texts: blocks.map((b) => b.text),
      threshold,
    });
    let flagged = 0;
    resp.results.forEach((r, i) => {
      if (!r.hate) return;
      flagged += 1;
      const el = blocks[i].el;
      el.classList.add("luciola-flag");
      el.title =
        "Luciola: " + Math.round(r.prob * 100) +
        "% — model representation, not a human verdict";
      const chip = document.createElement("span");
      chip.className = "luciola-chip";
      chip.textContent = Math.round(r.prob * 100) + "%";
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.appendChild(chip);
    });
    return { scanned: blocks.length, flagged };
  };
})();
