// Which message namespaces does each route entry need in the browser?
// A client component can only read namespaces that an ancestor NextIntlClientProvider
// carries (docs/dark-light-i18n/03). Each app entry (layout/page/not-found) must
// declare them, either in the root layout's provider or in <IntlNamespaces>.
// This script walks the import graph, collects the namespaces used by client files
// and fails when an entry declares fewer. Usage: node scripts/i18n/namespaces.mjs [--list]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const list = process.argv.includes("--list");
const messages = JSON.parse(readFileSync(path.join(root, "messages/fa.json"), "utf8"));
const NAMESPACES = Object.keys(messages);
const keySet = new Set();
const objectSet = new Set();
const collect = (node, prefix) => {
  for (const [key, value] of Object.entries(node)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") keySet.add(full);
    else {
      objectSet.add(full);
      collect(value, full);
    }
  }
};
collect(messages, "");

const tsconfig = JSON.parse(readFileSync(path.join(root, "tsconfig.json"), "utf8").replace(/\/\/.*$/gm, ""));
const aliases = Object.entries(tsconfig.compilerOptions.paths).map(([pattern, [target]]) => [
  pattern.replace("/*", "/"),
  target.replace(/^\.\//, "").replace("/*", "/"),
]);

const EXT = [".ts", ".tsx", "/index.ts", "/index.tsx"];
const resolveFile = (base) => {
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of EXT) if (existsSync(base + ext)) return base + ext;
  return null;
};
const resolveImport = (from, spec) => {
  let base = null;
  if (spec.startsWith(".")) base = path.join(path.dirname(from), spec);
  else {
    for (const [prefix, target] of aliases) {
      if (spec.startsWith(prefix)) {
        base = path.join(root, target + spec.slice(prefix.length));
        break;
      }
    }
  }
  return base ? resolveFile(base) : null;
};

const cache = new Map();
const read = (file) => {
  if (!cache.has(file)) {
    const text = readFileSync(file, "utf8");
    const imports = new Set();
    for (const match of text.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g)) {
      const resolved = resolveImport(file, match[1]);
      if (resolved) imports.add(resolved);
    }
    const namespaces = new Set();
    for (const match of text.matchAll(/(?:useTranslations|getTranslations)\(\s*["']([a-zA-Z]+)(?:\.[^"']*)?["']/g)) namespaces.add(match[1]);
    for (const match of text.matchAll(/["'`]([a-zA-Z]+)\.[^"'`]*["'`]/g)) {
      const literal = match[0].slice(1, -1);
      if (NAMESPACES.includes(match[1]) && (keySet.has(literal) || /\$\{/.test(literal))) namespaces.add(match[1]);
    }
    cache.set(file, { text, imports, namespaces, client: /^\s*["']use client["']/.test(text) });
  }
  return cache.get(file);
};

// A string that looks like a message key ("listing.roomsCount") but is not in fa.json
// would render as a raw key at runtime; helpers that take a loose translator are not
// covered by the TypeScript key check, so look for them here.
const danglingKeys = () => {
  const found = [];
  const dirs = ["app", "components", "features", "hooks", "lib", "helpers", "utils", "api_services"];
  const scan = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) scan(full);
      else if (/\.(ts|tsx)$/.test(entry.name)) {
        const text = readFileSync(full, "utf8");
        for (const match of text.matchAll(/["'](?:common|auth|errors|header|language|listing|routes|search|theme|footer|calendar|content|chat|advisor|profile|owner|reserve|validation)\.[A-Za-z][A-Za-z0-9_-]*(?:\.[A-Za-z0-9_-]+)*["']/g)) {
          const literal = match[0].slice(1, -1);
          if (!keySet.has(literal) && !objectSet.has(literal)) found.push(`${path.relative(root, full).split(path.sep).join("/")}: "${literal}" is not in messages/fa.json`);
        }
      }
    }
  };
  for (const dir of dirs) scan(path.join(root, dir));
  return found;
};

const closure = (entry) => {
  const seen = new Set();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    for (const dep of read(file).imports) stack.push(dep);
  }
  return seen;
};

// Files that execute in the browser: "use client" files and everything they import.
const clientFiles = new Set();
const markClient = (file) => {
  if (clientFiles.has(file)) return;
  clientFiles.add(file);
  for (const dep of read(file).imports) markClient(dep);
};

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
};
const appFiles = walk(path.join(root, "app"));
for (const file of [...appFiles, ...["components", "features", "hooks", "lib"].flatMap((d) => walk(path.join(root, d)))])
  if (read(file).client) markClient(file);

const ENTRY = /(^|[\\/])(page|layout|template|not-found|error|global-error|loading|default)\.tsx$/;
const entries = appFiles.filter((file) => ENTRY.test(file));

const declared = (file) => {
  const text = read(file).text;
  const found = new Set();
  for (const block of text.matchAll(/namespaces=\{\[([^\]]*)\]\}/g))
    for (const name of block[1].matchAll(/["']([a-zA-Z]+)["']/g)) found.add(name[1]);
  return found;
};

const rootLayout = path.join(root, "app/layout.tsx");
const rootDeclared = (() => {
  const text = read(rootLayout).text;
  const found = new Set();
  const block = text.match(/ROOT_NAMESPACES\s*=\s*\[([^\]]*)\]/);
  if (block) for (const name of block[1].matchAll(/["']([a-zA-Z]+)["']/g)) found.add(name[1]);
  return found;
})();

const required = (entry) => {
  const need = new Set();
  for (const file of closure(entry)) if (clientFiles.has(file)) for (const ns of read(file).namespaces) need.add(ns);
  return need;
};

const rootNeed = required(rootLayout);
const problems = [];
const rows = [];
for (const entry of entries) {
  const rel = path.relative(root, entry).split(path.sep).join("/");
  if (entry === rootLayout) {
    rows.push([rel, [...rootNeed].sort(), [...rootDeclared].sort()]);
    for (const ns of rootNeed) if (!rootDeclared.has(ns)) problems.push(`${rel}: ROOT_NAMESPACES is missing "${ns}"`);
    continue;
  }
  // The page provider merges onto the root one, so an entry needs everything its
  // client files read minus what the root layout already carries.
  const need = required(entry);
  const have = declared(entry);
  for (const ns of need)
    if (!rootDeclared.has(ns) && !have.has(ns)) problems.push(`${rel}: needs "${ns}" but neither ROOT_NAMESPACES nor <IntlNamespaces> carries it`);
  rows.push([rel, [...need].filter((ns) => !rootDeclared.has(ns)).sort(), [...have].sort()]);
}
problems.push(...danglingKeys());
if (process.argv.includes("--json")) {
  console.log(JSON.stringify(Object.fromEntries(rows.map(([rel, need]) => [rel, need]))));
  process.exit(0);
}
if (list) for (const [rel, need, have] of rows) console.log(`${rel}\n   need: ${need.join(",") || "-"}\n   have: ${have.join(",") || "-"}`);
if (problems.length) {
  console.error(`namespace check failed (${problems.length}):\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  process.exit(1);
}
console.log(`namespace check passed for ${entries.length} app entries.`);
