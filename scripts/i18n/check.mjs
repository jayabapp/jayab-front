// Release gate for messages/*.json (docs/dark-light-i18n/04-translation-files.md).
// fa is the source of the key schema; ar and en must match it. Reads only, writes nothing.
// Usage: node scripts/i18n/check.mjs [--dir <messages dir>]
import { parse, TYPE } from "@formatjs/icu-messageformat-parser";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Mirrors supportedLocales in i18n/config.ts (a TS module, so not imported here).
const SOURCE = "fa";
const LOCALES = [SOURCE, "ar", "en"];
// Rich text is rendered only through t.rich, so only these tags may appear.
const TAG_ALLOWLIST = new Set(["b", "i", "em", "strong", "br", "link"]);
// Message arguments that are not plural/select/tag are compared by name + type.
const TYPE_NAME = Object.fromEntries(
  Object.entries(TYPE)
    .filter(([, value]) => typeof value === "number")
    .map(([name, value]) => [value, name]),
);

const dirFlag = process.argv.indexOf("--dir");
const dir = path.resolve(
  process.cwd(),
  dirFlag > 0 ? process.argv[dirFlag + 1] : "messages",
);

const errors = [];
const fail = (locale, key, text) =>
  errors.push(`${locale}${key ? `  ${key}` : ""}: ${text}`);

const flatten = (locale, node, prefix = "", out = new Map()) => {
  for (const [name, value] of Object.entries(node)) {
    const key = prefix ? `${prefix}.${name}` : name;
    if (typeof value === "string") out.set(key, value);
    else if (value && typeof value === "object" && !Array.isArray(value))
      flatten(locale, value, key, out);
    else fail(locale, key, "value must be a string or an object");
  }
  return out;
};

// Collects "name:kind" for every argument (and the option keys of select) in one message.
const describe = (locale, key, message) => {
  const args = new Set();
  let ast;
  try {
    ast = parse(message, { requiresOtherClause: true });
  } catch (error) {
    fail(locale, key, `invalid ICU: ${error.message}`);
    return null;
  }
  const categories = new Set(
    new Intl.PluralRules(locale).resolvedOptions().pluralCategories,
  );
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.type === TYPE.literal || node.type === TYPE.pound) continue;
      if (node.type === TYPE.tag) {
        if (!TAG_ALLOWLIST.has(node.value))
          fail(locale, key, `tag <${node.value}> is not in the allowlist`);
        args.add(`${node.value}:tag`);
        walk(node.children);
        continue;
      }
      args.add(`${node.value}:${TYPE_NAME[node.type]}`);
      if (node.type !== TYPE.plural && node.type !== TYPE.select) continue;
      for (const [selector, option] of Object.entries(node.options)) {
        if (
          node.type === TYPE.plural &&
          !selector.startsWith("=") &&
          !categories.has(selector)
        ) {
          fail(
            locale,
            key,
            `plural selector "${selector}" does not exist in ${locale} (${[...categories].join("/")})`,
          );
        }
        if (node.type === TYPE.select)
          args.add(`${node.value}:option=${selector}`);
        walk(option.value);
      }
    }
  };
  walk(ast);
  return args;
};

const load = async (locale) => {
  let raw;
  try {
    raw = await readFile(path.join(dir, `${locale}.json`), "utf8");
  } catch {
    fail(locale, "", `${locale}.json not found in ${dir}`);
    return null;
  }
  try {
    return flatten(locale, JSON.parse(raw));
  } catch (error) {
    fail(locale, "", `invalid JSON: ${error.message}`);
    return null;
  }
};

const catalogs = new Map();
for (const locale of LOCALES) {
  const messages = await load(locale);
  if (messages) catalogs.set(locale, messages);
}

const source = catalogs.get(SOURCE);
const described = new Map();
for (const [locale, messages] of catalogs) {
  for (const [key, message] of messages) {
    if (!message.trim()) fail(locale, key, "empty message");
    else described.set(`${locale}\0${key}`, describe(locale, key, message));
  }
  if (locale === SOURCE || !source) continue;
  for (const key of source.keys())
    if (!messages.has(key)) fail(locale, key, "missing (present in fa)");
  for (const key of messages.keys())
    if (!source.has(key)) fail(locale, key, "extra (not in fa)");
}

if (source) {
  for (const key of source.keys()) {
    const expected = described.get(`${SOURCE}\0${key}`);
    if (!expected) continue;
    for (const locale of LOCALES.slice(1)) {
      const actual = described.get(`${locale}\0${key}`);
      if (!actual) continue;
      const missing = [...expected].filter((arg) => !actual.has(arg));
      const extra = [...actual].filter((arg) => !expected.has(arg));
      if (missing.length || extra.length) {
        fail(
          locale,
          key,
          `arguments differ from fa (missing: ${missing.join(", ") || "-"}; extra: ${extra.join(", ") || "-"})`,
        );
      }
    }
  }
}

if (errors.length) {
  console.error(
    `i18n check failed (${errors.length}):\n${errors.map((line) => `  - ${line}`).join("\n")}`,
  );
  process.exit(1);
}
console.log(
  `i18n check passed: ${source?.size ?? 0} messages x ${LOCALES.length} locales (${LOCALES.join(", ")}).`,
);
