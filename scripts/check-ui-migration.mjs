// Enforces the migrated axes of scripts/ui-migration-manifest.json
// (docs/dark-light-i18n/10-rollout-and-qa.md). Reads TS/TSX through the TypeScript parser, so
// comments and import paths never count; only JSX text and string/template literals do.
//   color: raw Tailwind palette utilities, bg-white/text-black, hex and rgb() literals
//   i18n:  Persian/Arabic letters in JSX text or string literals
// A hit is allowed only when a manifest exception lists it (`hits`) with a reason, so a file
// with an exception still fails when it gains a new raw colour or Persian string. `kind` is
// "valid" (correct by design) or "pending" (baseline debt to migrate). Direction is enforced
// separately by `yarn direction:check`.
// Usage: node scripts/check-ui-migration.mjs [--report | --print-hits]
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const ts = createRequire(import.meta.url)("typescript");
const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, "scripts/ui-migration-manifest.json"), "utf8"));
const report = process.argv.includes("--report");
const printHits = process.argv.includes("--print-hits");

const FAMILIES = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|brand|success|warning|danger";
const UTILITIES = "bg|text|border|ring|divide|from|via|to|fill|stroke|outline|decoration|accent|caret|shadow|placeholder";
const VARIANTS = String.raw`(?:[\w[\]&>*=():-]+?:)*!?-?`;
const COLOR = new RegExp(
  String.raw`(?<![\w-])${VARIANTS}(?:${UTILITIES})-(?:(?:white|black|canvas)(?![\w-])|(?:${FAMILIES})-\d{2,3}(?![\w-]))` +
    String.raw`|#[0-9a-fA-F]{3,8}(?![\w-])|\brgba?\(\s*\d`,
  "g",
);
// ء-ي and ٱ-ۓ are the letters (including پ چ ژ ک گ ی); digits and punctuation are not.
const LETTER = /[ء-يٱ-ۓ]/;

const AXIS_CHECKS = {
  color: (text) => text.match(COLOR) ?? [],
  i18n: (text) => (LETTER.test(text) ? [text.trim().replace(/\s+/g, " ").slice(0, 40)] : []),
};

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!/^(node_modules|\.next)$/.test(entry.name)) walk(full, out);
    } else if (/\.tsx?$/.test(entry.name) && !/\.(test|d)\.ts$/.test(entry.name)) out.push(full);
  }
  return out;
};

const textsOf = (file) => {
  const source = readFileSync(file, "utf8");
  const kind = file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  const texts = [];
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isJsxText(node)) texts.push({ text: node.text, jsx: true });
    else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) texts.push({ text: node.text });
    else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) texts.push({ text: node.text });
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return texts;
};

const exceptionsFor = (rel, axis) =>
  manifest.exceptions.filter((item) => item.axis === axis && (item.file === rel || (item.file.endsWith("/") && rel.startsWith(item.file))));

const problems = [];
const found = [];
const usedExceptions = new Set();
for (const entry of manifest.paths) {
  const target = path.join(root, entry.path);
  for (const file of walk(target)) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    const texts = textsOf(file);
    for (const axis of entry.axes) {
      const hits = new Set(texts.flatMap(({ text }) => AXIS_CHECKS[axis](text)));
      if (!hits.size) continue;
      found.push({ axis, file: rel, hits: [...hits] });
      const allowed = exceptionsFor(rel, axis);
      const left = [...hits].filter((hit) => !allowed.some((item) => item.hits.includes(hit)));
      allowed.forEach((item) => usedExceptions.add(item));
      if (left.length) problems.push(`${axis.padEnd(5)} ${rel}: ${left.slice(0, 4).join(" | ")}${left.length > 4 ? ` (+${left.length - 4})` : ""}`);
    }
  }
}

if (printHits) {
  console.log(JSON.stringify(found, null, 2));
  process.exit(0);
}

for (const item of manifest.exceptions) {
  const current = found.find((entry) => entry.axis === item.axis && entry.file === item.file)?.hits ?? [];
  const gone = (item.hits ?? []).filter((hit) => !current.includes(hit));
  if (gone.length) problems.push(`stale hits (migrated or changed, remove from the manifest): ${item.axis} ${item.file}: ${gone.join(" | ")}`);
}
const stale = manifest.exceptions.filter((item) => !usedExceptions.has(item));
if (stale.length) {
  problems.push(...stale.map((item) => `stale exception (nothing matches any more, remove it): ${item.axis} ${item.file}`));
}
for (const item of manifest.exceptions) {
  if (!item.reason || !["valid", "pending"].includes(item.kind) || !item.hits?.length) {
    problems.push(`exception needs kind (valid|pending), reason and hits: ${item.axis} ${item.file}`);
  }
}

if (problems.length) {
  console.error(`ui migration check failed (${problems.length}). Fix the class/text, or add a manifest exception with a reason:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  process.exit(1);
}
const count = (kind) => manifest.exceptions.filter((item) => item.kind === kind).length;
console.log(`ui migration check passed (${manifest.paths.length} path groups; exceptions: ${count("valid")} valid by design, ${count("pending")} pending migration).`);
if (report) {
  for (const item of manifest.exceptions.filter((entry) => entry.kind === "pending")) console.log(`  pending ${item.axis.padEnd(5)} ${item.file}: ${item.hits.join(" | ")}`);
}
