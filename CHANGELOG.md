# Changelog

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
