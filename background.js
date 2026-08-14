// Service worker: holds the model and scores text batches sent by the
// content script. Everything runs locally; the extension has no network
// permission and makes no requests.

import { LuciolaModel } from "./src/model.js";

let modelPromise = null;

function getModel() {
  if (!modelPromise) {
    modelPromise = fetch(chrome.runtime.getURL("model/luciola_linear_v4.json"))
      .then((r) => r.json())
      .then((data) => new LuciolaModel(data));
  }
  return modelPromise;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "luciola:score") {
    getModel().then((model) => {
      const threshold = typeof msg.threshold === "number" ? msg.threshold : model.threshold;
      const results = msg.texts.map((t) => {
        const r = model.score(t);
        return { prob: r.prob, hate: r.prob >= threshold };
      });
      const flagged = results.filter((r) => r.hate).length;
      if (sender.tab && sender.tab.id != null) {
        chrome.action.setBadgeBackgroundColor({ color: "#EE6C4D", tabId: sender.tab.id });
        chrome.action.setBadgeText({
          text: flagged > 0 ? String(flagged) : "",
          tabId: sender.tab.id,
        });
      }
      sendResponse({ results, defaultThreshold: model.threshold });
    });
    return true; // async response
  }
  if (msg && msg.type === "luciola:meta") {
    getModel().then((model) => sendResponse({ threshold: model.threshold, meta: model.meta }));
    return true;
  }
  return false;
});
