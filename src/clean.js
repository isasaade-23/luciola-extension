// Light cleaning profile, a faithful port of hsc/clean.py::clean_text with
// configs/data.yaml -> clean.profiles.light. Order of operations is fixed:
// NFC -> strip controls -> strip RT -> url token -> user token -> hashtag ->
// demojize -> collapse whitespace. No lowercasing here (the vectorizer does it).

const URL_RE = /https?:\/\/\S+|www\.\S+/gi;
const MENTION_RE = /@\w+/gu;
const RT_RE = /^\s*RT\b[:\s]*/i;
const HASHTAG_RE = /#(\w+)/gu;
// C0 controls (except tab/newline/cr) and C1 controls (0x80-0x9f)
const CONTROL_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/g;
const WS_RE = /\s+/g;

let emojiRe = null;
let emojiMap = null;

function initEmoji(map) {
  emojiMap = map;
  // longest-first alternation so multi-codepoint emojis win over their prefixes
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  emojiRe = new RegExp(escaped.join("|"), "gu");
}

function demojize(text) {
  if (!emojiRe) return text;
  return text.replace(emojiRe, (m) => ` :${emojiMap[m]}: `);
}

function cleanText(text) {
  if (text == null) return "";
  let t = String(text).normalize("NFC");
  t = t.replace(CONTROL_RE, " ");
  t = t.replace(RT_RE, "");
  t = t.replace(URL_RE, " <url> ");
  t = t.replace(MENTION_RE, " <user> ");
  t = t.replace(HASHTAG_RE, "$1");
  t = demojize(t);
  t = t.replace(WS_RE, " ").trim();
  return t;
}

export { cleanText, initEmoji };
