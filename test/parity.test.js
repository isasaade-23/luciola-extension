// Parity gate: the JS runtime must reproduce the Python scores on the golden
// set. Run with: node test/parity.test.js
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { LuciolaModel } from "../src/model.js";

const here = dirname(fileURLToPath(import.meta.url));
const model = new LuciolaModel(
  JSON.parse(readFileSync(join(here, "..", "model", "luciola_linear_v4.json"), "utf-8"))
);
const golden = JSON.parse(readFileSync(join(here, "golden.json"), "utf-8"));

const TOL = 1e-4;
let worst = { d: 0 };
let cleanedMismatch = 0;
let fails = 0;

for (const g of golden) {
  const r = model.score(g.text);
  if (r.cleaned !== g.cleaned) {
    cleanedMismatch += 1;
    if (cleanedMismatch <= 5) {
      console.log(`CLEAN MISMATCH\n  py: ${JSON.stringify(g.cleaned)}\n  js: ${JSON.stringify(r.cleaned)}`);
    }
  }
  const d = Math.abs(r.prob - g.prob);
  if (d > worst.d) worst = { d, text: g.text, py: g.prob, js: r.prob };
  if (d > TOL) fails += 1;
}

console.log(`texts: ${golden.length}  clean mismatches: ${cleanedMismatch}  prob fails(>${TOL}): ${fails}`);
console.log(`worst |dprob| = ${worst.d.toExponential(3)} on ${JSON.stringify((worst.text || "").slice(0, 60))}`);
if (fails > 0 || cleanedMismatch > 0) {
  process.exit(1);
}
console.log("PARITY OK");
