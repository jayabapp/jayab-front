// Package checks only: not full ICU validation, browser QA, or a next-intl build.
// Uses the repo's existing TypeScript/PostCSS; installs nothing, writes nothing.
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const postcss = require("postcss");
const starter = path.dirname(fileURLToPath(import.meta.url));
const docs = path.dirname(starter);
const load = (file) => readFile(path.join(starter, file), "utf8");
const flatten = (value, prefix = "") => Object.entries(value).flatMap(([key, item]) => {
  const name = prefix ? `${prefix}.${key}` : key;
  assert(!key.includes("."), `Message key must be nested: ${name}`);
  if (typeof item === "string") {
    assert(item.trim(), `Empty message: ${name}`);
    return [[name, item]];
  }
  assert(item && !Array.isArray(item) && typeof item === "object", `Invalid message: ${name}`);
  return flatten(item, name);
});
const catalogs = Object.fromEntries(await Promise.all(["fa", "ar", "en"].map(async (locale) =>
  [locale, Object.fromEntries(flatten(JSON.parse(await load(`messages/${locale}.json`))))],
)));
const keys = Object.keys(catalogs.fa).sort();
const argumentsOf = (message) => [...new Set([...message.matchAll(/\{\s*([a-zA-Z]\w*)\s*(?:,|\})/g)].map((match) => match[1]))].sort();
for (const [locale, catalog] of Object.entries(catalogs)) {
  assert.deepEqual(Object.keys(catalog).sort(), keys, `${locale}: key parity`);
  for (const key of keys) {
    const message = catalog[key];
    let depth = 0;
    for (const character of message) {
      if (character === "{") depth++;
      if (character === "}") depth--;
      assert(depth >= 0, `${locale}.${key}: unexpected closing brace`);
    }
    assert.equal(depth, 0, `${locale}.${key}: unbalanced braces`);
    assert.deepEqual(argumentsOf(message), argumentsOf(catalogs.fa[key]), `${locale}.${key}: argument parity`);
    if (message.includes(", plural,")) {
      assert(/\bother\s*\{/.test(message), `${locale}.${key}: missing other`);
      if (locale === "ar") {
        for (const category of ["zero", "one", "two", "few", "many", "other"])
          assert(new RegExp(`\\b${category}\\s*\\{`).test(message), `${locale}.${key}: missing ${category}`);
      }
    }
  }
}

const css = postcss.parse(await load("tokens.css"));
const themes = {};
css.walkRules((rule) => {
  if (![":root", 'html[data-theme="dark"]'].includes(rule.selector)) return;
  const variables = {};
  rule.walkDecls((declaration) => {
    if (!declaration.prop.startsWith("--")) return;
    assert(!(declaration.prop in variables), `Duplicate variable: ${declaration.prop}`);
    variables[declaration.prop] = declaration.value;
  });
  themes[rule.selector] = variables;
});
assert.deepEqual(Object.keys(themes).sort(), [":root", 'html[data-theme="dark"]'].sort());
assert.deepEqual(Object.keys(themes[":root"]).sort(), Object.keys(themes['html[data-theme="dark"]']).sort(), "Theme variable parity");
const luminance = (rgb) => rgb.map((channel) => {
  const n = channel / 255;
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}).reduce((sum, n, index) => sum + n * [0.2126, 0.7152, 0.0722][index], 0);
const ratio = (a, b) => {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
let pairs = 0;
for (const [selector, variables] of Object.entries(themes)) {
  const rgb = {};
  for (const [name, value] of Object.entries(variables).filter(([name]) => name.startsWith("--c-"))) {
    assert(/^\d+ \d+ \d+$/.test(value), `${name}: expected RGB channels`);
    rgb[name] = value.split(" ").map(Number);
    assert(rgb[name].every((n) => n >= 0 && n <= 255), `${name}: invalid channel`);
  }
  const check = (foreground, background, minimum) => {
    const actual = ratio(rgb[`--c-${foreground}`], rgb[`--c-${background}`]);
    assert(actual >= minimum, `${selector}: ${foreground}/${background} ${actual.toFixed(2)} < ${minimum}`);
    pairs++;
  };
  for (const background of ["page", "surface", "surface-muted"]) {
    for (const foreground of ["ink", "ink-muted", "link"]) check(foreground, background, 4.5);
    for (const foreground of ["control", "focus"]) check(foreground, background, 3);
  }
  check("on-action", "action", 4.5);
  check("on-action", "action-hover", 4.5);
  check("on-selected", "selected", 4.5);
  for (const status of ["danger", "success", "warning"]) check(`status-${status}`, `status-${status}-bg`, 4.5);
  // Pairs added after review: the action control itself, card edges, muted text and status text on neutral surfaces.
  for (const background of ["page", "surface"]) {
    check("action", background, 3);
    check("line-strong", background, 1.4);
  }
  check("ink-subtle", "surface", 4.5);
  check("ink-subtle", "page", 4.5);
  check("action-hover", "surface", 3);
  check("link", "selected", 4.5);
  check("line-strong", "surface-muted", selector === ":root" ? 1.2 : 1.8);
  for (const status of ["danger", "success", "warning"]) for (const background of ["page", "surface", "surface-muted"]) check(`status-${status}`, background, 4.5);
}

const sample = await load("i18n-config.ts.txt");
const blocks = [...sample.matchAll(/^\/\/ FILE: (.+)\r?\n([\s\S]*?)(?=^\/\/ FILE: |^\/\/ INTEGRATION NOTES|$(?![\s\S]))/gm)];
assert.equal(blocks.length, 3, "Expected three separate TS starter blocks");
for (const [, name, source] of blocks) {
  const diagnostics = ts.transpileModule(source, {
    fileName: name,
    compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, strict: true },
    reportDiagnostics: true,
  }).diagnostics ?? [];
  assert.equal(diagnostics.length, 0, `${name}: TS syntax diagnostics`);
}
const configSource = blocks.find(([, name]) => name === "i18n/config.ts")[2];
const compiled = ts.transpileModule(configSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const evaluate = (flag) => {
  const context = vm.createContext({ exports: {}, process: { env: { NEXT_PUBLIC_ENABLED_LOCALES: flag } } });
  vm.runInContext(compiled, context);
  return context.exports;
};
for (const flag of [undefined, "", "invalid", "fa"]) {
  const config = evaluate(flag);
  assert.equal(config.enabledLocales.join(","), "fa");
  for (const cookie of [undefined, "en", "ar", "en-US", "invalid"]) assert.equal(config.resolveLocale(cookie), "fa");
}
const config = evaluate(" en,ar,unknown,en ");
assert.equal(config.enabledLocales.join(","), "fa,ar,en");
for (const locale of ["fa", "ar", "en"]) assert.equal(config.resolveLocale(locale), locale);
assert.equal(config.resolveLocale("../en"), "fa");
assert.equal(config.dirOf("en"), "ltr");
assert.equal(config.dirOf("ar"), "rtl");

let links = 0;
for (const file of (await readdir(docs)).filter((name) => name.endsWith(".md"))) {
  const source = await readFile(path.join(docs, file), "utf8");
  for (const [, target] of source.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)) {
    if (/^https?:\/\//.test(target) || target.startsWith("#")) continue;
    await access(path.resolve(docs, target.split("#")[0]));
    links++;
  }
}
console.log(`Starter passed: ${keys.length} keys × 3 locales, ${pairs} contrast pairs, 3 TS syntax blocks, locale flag cases, ${links} local links.`);
console.log("Limits: brace/argument checks are not a complete ICU parser; TS syntax checks are not next-intl type integration or browser QA.");
