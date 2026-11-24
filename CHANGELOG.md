# Changelog

## 1.1.0 — 2026-10-19

- YouTube live chat mode (`content_ytchat.js`): works on live chats and chat
  replays, watches new messages, scores them in batches in the service worker
  and blurs the ones above the chosen level. A click reveals; nothing is
  removed. Counter "X of Y messages blurred" in the chat header.
- Popup: on/off switch, three sensitivity levels (conservative 0.67, balanced
  0.57, sensitive 0.424; default conservative) and a limitations note.
- Thresholds chosen by false positive rate on the Portuguese validation split.
- Party acronyms (PT, PL, PSOL, PSDB, MDB) removed before scoring, to undo a
  learned party bias ("PT" alone scored 0.89, "PL" 0.12). Voter labels
  (petista, bolsonarista, ...) are kept, following the strict v2 guideline
  (political affiliation is a protected group); fixture message 16 is now
  expected hate at every level.
- Fixture `test/yt_chat_fixture.html` with 18 synthetic messages.
- No server, no collection, no message logging.

## 0.3.0 — 2026-08-16

- Brand icons rendered from the official Luciola mark (replacing placeholders).
- Privacy policy page (`docs/privacy.md`, served via GitHub Pages).
- `homepage_url` in the manifest.
- Chrome Web Store listing assets and copy (`store/`).

## 0.2.0 — 2026-08-16

- Model upgraded to the corpus v5 linear member (`luciola_linear_v5.json`,
  11.2 MB, threshold 0.424). Parity vs Python: max deviation 6.4e-9 over the
  137-text golden set.
- Demo page and Honest limits rewritten to describe actual v5 behavior:
  part of the no-slur implicit section now flags; a pro-minority sentence
  false-positives (identity-term bias sharpened both ways by adversarial
  training).

## 0.1.0 — 2026-08-14

- First release: MV3 extension, fully local inference (no network permission),
  popup with threshold slider, EN and pt-BR locales, local test page.
