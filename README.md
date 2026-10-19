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

## YouTube live chat mode (1.1)

While you watch a live stream or a chat replay on YouTube, the extension scores
each new chat message and blurs the ones above the chosen level, with the label
"Luciola: possible hate speech — show". Nothing is deleted: a click reveals the
message. A small counter in the chat header shows "X of Y messages blurred".
The popup has an on/off switch and three sensitivity levels; the default is
conservative, which prefers letting a message through over blurring political
criticism. Messages are scored in batches by the service worker (about 0.6 ms
per message measured on a debate replay) and are neither sent nor stored.

| Level | Threshold | Precision | Recall | False positives |
|---|---|---|---|---|
| Conservative (default) | 0.67 | 0.71 | 0.16 | 0.6% |
| Balanced | 0.57 | 0.70 | 0.22 | 0.9% |
| Sensitive | 0.424 | 0.67 | 0.32 | 1.5% |

Thresholds were chosen by false positive rate on the Portuguese validation
split; the figures are on the Portuguese test split (n = 4,748). The corpus is
not debate chat, so the rate of blurred political criticism is not measured
directly.

**Party names are removed before scoring.** In the Portuguese corpus, texts
that name a party are 40-44% hate (8.6% overall), and the model learned the
party acronym as a hate cue: "PT" alone scores 0.89, "PL" 0.12, and "Votei no
PT a vida toda" 0.47 against 0.06 with PL. In the chat mode, PT, PL, PSOL,
PSDB, MDB, petista, bolsonarista, lulista, petralha and bolsominion are removed
from the text sent to the model (the chat still shows the full message). Both
sides then score alike; scores of attacks on groups do not change, and the
metrics above move by at most 2 points. An attack on a group that also names a
party loses part of its score.

**Test with the fixture.** Open
`chrome-extension://<extension id>/test/yt_chat_fixture.html` (the id is shown
on the extensions page). It mimics the chat markup with 18 synthetic messages
and lists the expected result for each level.

**Test on a debate replay.**

1. Load the extension unpacked (below). After any code change, press reload on
   the extension card and reload the YouTube tab.
2. Open a debate video that has a chat replay and press "Show chat replay".
3. Play the video. The counter appears in the chat header once messages arrive.
4. Switch the level in the popup: the chat updates without reloading.
5. In the chat frame console, `[Luciola]` lines show batch timing only, never
   message text.

## Install (developer mode)

1. `chrome://extensions` and turn on Developer mode.
2. Load unpacked and select this folder.
3. Open `demo/test.html`, click the Luciola icon and press Scan this page.

## Honest limits

The study behind this tool measures real over-flagging of some identity terms:
a neutral or even positive mention of an identity group can be flagged (the v5
model, trained on adversarial examples, catches more implicit hate than v4 but
also flags some pro-minority sentences — see the demo page). Probabilities are
a model representation, not a human verdict. In the YouTube chat mode the
model detects only part of the hate speech in Portuguese, can be wrong both
ways, and does not replace channel moderation. Research and educational use only:
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
