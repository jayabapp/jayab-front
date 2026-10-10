// Fails when a component uses a physical direction utility (ml-, pr-, left-, text-right,
// border-l, rounded-r ...) outside the documented exceptions in exceptions.json.
// RTL physical left is "end" and physical right is "start" (docs/dark-light-i18n/08),
// so a new physical class silently breaks English. Usage: node scripts/direction/check.mjs
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const exceptions = JSON.parse(readFileSync(path.join(root, "scripts/direction/exceptions.json"), "utf8"));
const allowed = new Map(Object.entries(exceptions));

const PREFIX = String.raw`(?<![\w-])(?:[\w[\]&>*=():-]+?:)*!?-?`;
const WITH_VALUE = String.raw`(?:ml|mr|pl|pr|left|right)-[\w[\]/%.()-]+`;
const FLAGS = String.raw`(?:text-left|text-right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br)(?=[\s"'\x60-]|$)`;
const PHYSICAL = new RegExp(`${PREFIX}(?:${WITH_VALUE}|${FLAGS})`, "g");
const CENTERED = /(?:left|right)-(?:1\/2|\[50%\])/;
const LITERAL = /"[^"\n]*"|'[^'\n]*'|`[^`]*`/g;

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(entry.name)) out.push(full);
  }
  return out;
};

const problems = [];
for (const dir of ["components", "app", "features"]) {
  for (const file of walk(path.join(root, dir))) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (allowed.has(rel) || [...allowed.keys()].some((key) => key.endsWith("/") && rel.startsWith(key))) continue;
    const text = readFileSync(file, "utf8");
    const hits = new Set();
    for (const literal of text.match(LITERAL) ?? []) {
      for (const match of literal.match(PHYSICAL) ?? []) {
        if (!CENTERED.test(match)) hits.add(match);
      }
    }
    if (hits.size) problems.push(`${rel}: ${[...hits].slice(0, 4).join(", ")}`);
  }
}

if (problems.length) {
  console.error(`direction check failed (${problems.length}). Use ms-/me-/ps-/pe-/start-/end-/text-start/text-end, or list the file in scripts/direction/exceptions.json with a reason:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  process.exit(1);
}
console.log(`direction check passed (${allowed.size} documented exceptions).`);
