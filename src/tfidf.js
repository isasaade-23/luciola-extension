// Faithful port of the trained sklearn FeatureUnion:
//   word  TfidfVectorizer(lowercase, token_pattern \b\w\w+\b, ngram 1-2,
//                         sublinear_tf, smooth idf, L2)
//   char  TfidfVectorizer(analyzer char_wb, ngram 3-5, same tf-idf settings)
// FeatureUnion L2-normalizes EACH block independently, then concatenates.

const WORD_TOKEN_RE = /[\p{L}\p{N}_]{2,}/gu;

function wordGrams(lowered) {
  const tokens = lowered.match(WORD_TOKEN_RE) || [];
  const grams = tokens.slice();
  for (let i = 0; i + 1 < tokens.length; i++) {
    grams.push(tokens[i] + " " + tokens[i + 1]);
  }
  return grams;
}

// sklearn _char_wb_ngrams, including the short-word single-count rule
function charWbGrams(lowered, minN, maxN) {
  const grams = [];
  const words = lowered.split(/\s+/).filter(Boolean);
  for (const raw of words) {
    const w = " " + raw + " ";
    const wLen = w.length;
    for (let n = minN; n <= maxN; n++) {
      let offset = 0;
      grams.push(w.slice(offset, offset + n));
      while (offset + n < wLen) {
        offset += 1;
        grams.push(w.slice(offset, offset + n));
      }
      if (offset === 0) break; // word shorter than n: count once, stop
    }
  }
  return grams;
}

// Per-block sparse tf-idf: returns Map(globalIndex -> value), L2-normalized
function blockVector(grams, block) {
  const counts = new Map();
  for (const g of grams) {
    const idx = block.vocab[g];
    if (idx !== undefined) counts.set(idx, (counts.get(idx) || 0) + 1);
  }
  if (counts.size === 0) return counts;
  let sq = 0;
  for (const [idx, c] of counts) {
    const v = (1 + Math.log(c)) * block.idf[idx];
    counts.set(idx, v);
    sq += v * v;
  }
  const norm = Math.sqrt(sq) || 1;
  const out = new Map();
  for (const [idx, v] of counts) out.set(block.offset + idx, v / norm);
  return out;
}

function featurize(cleaned, blocks) {
  const lowered = cleaned.toLowerCase();
  const vecs = [];
  for (const block of blocks) {
    const grams =
      block.analyzer === "word"
        ? wordGrams(lowered)
        : charWbGrams(lowered, block.ngram_range[0], block.ngram_range[1]);
    vecs.push(blockVector(grams, block));
  }
  return vecs;
}

export { featurize, wordGrams, charWbGrams };
