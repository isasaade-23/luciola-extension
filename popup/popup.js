const $ = (id) => document.getElementById(id);
const t = (k) => chrome.i18n.getMessage(k);

$("scan").textContent = t("scan");
$("thlabel").textContent = t("threshold");
$("note").innerHTML =
  t("disclaimer") +
  ' <a href="https://isasaade-23.github.io/hate-speech-nlp-en-pt/" target="_blank" rel="noopener">' +
  t("learn_more") + "</a>";

const state = { threshold: 0.424 };

chrome.runtime.sendMessage({ type: "luciola:meta" }, (resp) => {
  if (resp && typeof resp.threshold === "number") state.threshold = resp.threshold;
  chrome.storage.sync.get("threshold", (st) => {
    if (typeof st.threshold === "number") state.threshold = st.threshold;
    $("th").value = state.threshold;
    $("thval").textContent = Math.round(state.threshold * 100) + "%";
  });
});

$("th").addEventListener("input", () => {
  state.threshold = parseFloat($("th").value);
  $("thval").textContent = Math.round(state.threshold * 100) + "%";
  chrome.storage.sync.set({ threshold: state.threshold });
});

async function scan() {
  $("stats").textContent = t("scanning");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (th) => window.__luciolaRescan(th),
      args: [state.threshold],
    });
    const s = res.result || { scanned: 0, flagged: 0 };
    $("stats").innerHTML = t("stats_scanned") + " " + s.scanned +
      " · " + t("stats_flagged") + " <b>" + s.flagged + "</b>";
  } catch (e) {
    $("stats").textContent = t("cannot_scan");
  }
}

$("scan").addEventListener("click", scan);

// YouTube live chat mode: content_ytchat.js reads these keys and re-applies
// them to the open chat as soon as they change.
for (const k of ["yt_section", "yt_enabled", "yt_level", "yt_level_conservative",
  "yt_level_balanced", "yt_level_sensitive", "yt_level_hint", "yt_limits"]) {
  $(k).textContent = t(k);
}

chrome.storage.sync.get(["ytEnabled", "ytLevel"], (st) => {
  const enabled = st.ytEnabled !== false; // on by default
  const level = st.ytLevel || "conservative";
  $("ytEnabled").checked = enabled;
  $("ytLevels").disabled = !enabled;
  const radio = document.querySelector(`input[name="ytLevel"][value="${level}"]`);
  if (radio) radio.checked = true;
});

$("ytEnabled").addEventListener("change", () => {
  $("ytLevels").disabled = !$("ytEnabled").checked;
  chrome.storage.sync.set({ ytEnabled: $("ytEnabled").checked });
});

for (const r of document.querySelectorAll('input[name="ytLevel"]')) {
  r.addEventListener("change", () => chrome.storage.sync.set({ ytLevel: r.value }));
}
