// Score an arbitrary list of texts with the extension's linear model.
// Usage: node test/score_file.mjs input.json output.json
// input.json: ["text", ...]  ->  output.json: [{prob}, ...]
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { LuciolaModel } from "../src/model.js";

const here = dirname(fileURLToPath(import.meta.url));
const model = new LuciolaModel(
  JSON.parse(readFileSync(join(here, "..", "model", "luciola_linear_v5.json"), "utf-8"))
);

const [input, output] = process.argv.slice(2);
const texts = JSON.parse(readFileSync(input, "utf-8"));
const results = texts.map((t) => ({ prob: model.score(t).prob }));
writeFileSync(output, JSON.stringify(results));
console.log(`scored ${results.length} texts`);
