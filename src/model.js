// Scoring: concat(word block, char block) -> dot(coef) + intercept ->
// sigmoid (LogisticRegression probability) -> Platt sigmoid (calibrated
// probability, fit on the validation split only).

import { cleanText, initEmoji } from "./clean.js";
import { featurize } from "./tfidf.js";

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

class LuciolaModel {
  constructor(data) {
    this.blocks = data.blocks;
    this.coef = data.coef;
    this.intercept = data.intercept;
    this.platt = data.platt;
    this.threshold = data.threshold;
    this.meta = { model: data.model, git_sha: data.git_sha, policy: data.policy };
    initEmoji(data.emoji);
  }

  score(text) {
    const cleaned = cleanText(text);
    let z = this.intercept;
    for (const vec of featurize(cleaned, this.blocks)) {
      for (const [idx, v] of vec) z += v * this.coef[idx];
    }
    const raw = sigmoid(z);
    const prob = sigmoid(this.platt.a * raw + this.platt.b);
    return { cleaned, raw, prob, hate: prob >= this.threshold };
  }
}

export { LuciolaModel, sigmoid };
