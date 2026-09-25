# Luciola browser extension

Highlights probable hate speech on pages you choose to scan, in English and
Portuguese. The classifier runs fully inside your browser: no server, no
account, and no text ever leaves your device. The extension has no network
permission at all.

It is a triage tool. It marks blocks with a probability so a human can look;
it never blocks, removes or reports anything.

## How it works

The model is the linear member of the [Luciola research
study](https://isasaade-23.github.io/hate-speech-nlp-en-pt/): TF-IDF word and
character features into a logistic regression, Platt-calibrated on a held-out
validation split (corpus v5, 113,826 rows, test ROC-AUC 0.884). The exact Python pipeline is
ported to JavaScript and verified by a parity test (`node test/parity.test.js`,
max deviation under 1e-8 on the golden set).

- `model/luciola_linear_v5.json` is exported by
  `hate-speech-project/scripts/export_extension_model.py`.
- `src/clean.js`, `src/tfidf.js`, `src/model.js` reproduce cleaning,
  featurization and scoring.
- `background.js` scores batches; `content.js` collects visible text blocks and
  draws the highlights; `popup/` has the scan button and threshold slider.

## Install (developer mode)

1. `chrome://extensions` and turn on Developer mode.
2. Load unpacked and select this folder.
3. Open `demo/test.html`, click the Luciola icon and press Scan this page.

## Honest limits

The study behind this tool measures real over-flagging of some identity terms:
a neutral or even positive mention of an identity group can be flagged (the v5
model, trained on adversarial examples, catches more implicit hate than v4 but
also flags some pro-minority sentences — see the demo page). Probabilities are
a model representation, not a human verdict. Research and educational use only:
the training data licenses do not allow commercial use of the model weights.

## Support

This is independent research, self-funded and unpaid outside the author's stipend.
One-off donations: [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/ailuciola)

## License

**Code**: [GNU Affero General Public License v3.0](LICENSE). The extension runs
entirely in your browser and talks to no server, so in practice this behaves
like the GPL: use it, study it, change it, and pass on the same freedoms with
the source.

**Model weights** (`model/luciola_linear_v5.json`): research and educational use
only, no commercial use. Not under the AGPL, because the training-data licenses
restrict what can be granted downstream. See [`LICENSE-MODEL.md`](LICENSE-MODEL.md)
and the study's `methodology/data_provenance.md`.
