// YouTube live chat mode. Runs inside the chat iframe (live_chat and
// live_chat_replay), watches for new messages, sends them in batches to the
// service worker and blurs the ones above the threshold. Nothing is removed:
// a click reveals the message. Texts stay in memory only while a batch is
// being scored; only the probability is kept, attached to the element.
(() => {
  if (window.__luciolaYtChat) return;
  window.__luciolaYtChat = true;
  document.documentElement.dataset.luciola = "ytchat"; // visible to page and tests

  const MSG_SELECTOR =
    "yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer";
  // Provisional thresholds per sensitivity level; "conservative" only blurs
  // when the model is quite sure, so political criticism tends to pass.
  const LEVELS = { conservative: 0.7, balanced: 0.55, sensitive: 0.424 };
  const BATCH_MAX = 40;
  const BATCH_WAIT_MS = 200;

  const t = (k, fallback, subs) => {
    try { return chrome.i18n.getMessage(k, subs) || fallback; } catch (e) { return fallback; }
  };

  const settings = { enabled: true, level: "conservative" };
  const probs = new WeakMap(); // element -> probability
  const seen = new Set();      // elements scored in this frame, for the counter
  let queue = [];
  let timer = null;
  const perf = { msgs: 0, ms: 0 };

  const style = document.createElement("style");
  style.textContent = `
  .luciola-blur #message { filter: blur(6px); user-select: none; }
  .luciola-reveal { all: unset; cursor: pointer; display: inline-block; margin: 2px 0 0;
    padding: 1px 8px; border-radius: 999px; background: #1F3050; color: #fff;
    border: 1px solid #EE6C4D; font: 600 11px/1.6 Roboto, Arial, sans-serif; }
  .luciola-reveal:hover { background: #EE6C4D; }
  #luciola-counter { position: fixed; left: 8px; bottom: 64px; z-index: 2147483646;
    padding: 2px 9px; border-radius: 999px; background: rgba(31,48,80,.82); color: #fff;
    font: 500 11px/1.6 Roboto, Arial, sans-serif; pointer-events: none; }
  `;
  document.documentElement.appendChild(style);

  const counter = document.createElement("div");
  counter.id = "luciola-counter";

  function threshold() {
    return LEVELS[settings.level] ?? LEVELS.conservative;
  }

  function textOf(el) {
    const m = el.querySelector("#message");
    return m ? (m.innerText || "").trim().slice(0, 1000) : "";
  }

  function blur(el) {
    if (el.classList.contains("luciola-blur") || el.dataset.luciolaRevealed) return;
    el.classList.add("luciola-blur");
    const btn = document.createElement("button");
    btn.className = "luciola-reveal";
    btn.textContent = t("yt_blur_label", "Luciola: possível discurso de ódio — mostrar");
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      el.dataset.luciolaRevealed = "1";
      unblur(el);
      updateCounter();
    });
    const m = el.querySelector("#message");
    (m ? m.parentElement : el).appendChild(btn);
  }

  function unblur(el) {
    el.classList.remove("luciola-blur");
    const btn = el.querySelector(".luciola-reveal");
    if (btn) btn.remove();
  }

  function apply(el) {
    const p = probs.get(el);
    if (p == null) return;
    if (settings.enabled && p >= threshold()) blur(el);
    else unblur(el);
  }

  function updateCounter() {
    let total = 0;
    let blurred = 0;
    for (const el of seen) {
      if (!el.isConnected) { seen.delete(el); continue; }
      total += 1;
      if (el.classList.contains("luciola-blur")) blurred += 1;
    }
    if (!settings.enabled || total === 0) { counter.remove(); return; }
    counter.textContent = t("yt_counter", `${blurred} de ${total} mensagens embaçadas`,
      [String(blurred), String(total)]);
    if (!counter.isConnected) document.body.appendChild(counter);
  }

  async function flush() {
    timer = null;
    const batch = queue.filter((el) => el.isConnected);
    queue = [];
    if (batch.length === 0) return;
    const texts = batch.map(textOf);
    let resp;
    try {
      resp = await chrome.runtime.sendMessage({ type: "luciola:scoreChat", texts });
    } catch (e) {
      return; // extension reloaded or worker unavailable: leave the chat as is
    }
    batch.forEach((el, i) => {
      probs.set(el, texts[i] ? resp.probs[i] : 0);
      seen.add(el);
      apply(el);
    });
    perf.msgs += batch.length;
    perf.ms += resp.ms;
    // Timing only, never message text.
    console.debug(`[Luciola] lote de ${batch.length} em ${resp.ms.toFixed(1)} ms ` +
      `(média ${(perf.ms / perf.msgs).toFixed(2)} ms por mensagem)`);
    updateCounter();
  }

  function enqueue(el) {
    if (probs.has(el) || queue.includes(el)) return;
    queue.push(el);
    if (queue.length >= BATCH_MAX) { clearTimeout(timer); flush(); }
    else if (!timer) timer = setTimeout(flush, BATCH_WAIT_MS);
  }

  function scan(root) {
    if (root.nodeType !== 1) return;
    if (root.matches(MSG_SELECTOR)) enqueue(root);
    else for (const el of root.querySelectorAll(MSG_SELECTOR)) enqueue(el);
  }

  function start() {
    scan(document.body);
    new MutationObserver((records) => {
      if (!settings.enabled) return;
      for (const r of records) for (const n of r.addedNodes) scan(n);
    }).observe(document.body, { childList: true, subtree: true });
  }

  chrome.storage.sync.get(["ytEnabled", "ytLevel"], (st) => {
    if (typeof st.ytEnabled === "boolean") settings.enabled = st.ytEnabled;
    if (st.ytLevel in LEVELS) settings.level = st.ytLevel;
    start();
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.ytEnabled) settings.enabled = changes.ytEnabled.newValue;
    if (changes.ytLevel && changes.ytLevel.newValue in LEVELS) settings.level = changes.ytLevel.newValue;
    for (const el of seen) apply(el);
    if (settings.enabled) scan(document.body);
    updateCounter();
  });
})();
