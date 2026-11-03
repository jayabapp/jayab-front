// Keeps the pre-paint bootstrap script and the TypeScript resolver on one contract
// (docs/dark-light-i18n/02-theme-engine.md). Reads lib/theme, installs nothing, writes nothing.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const read = (file) => readFile(path.join(process.cwd(), "lib/theme", file), "utf8");

const load = async (flag) => {
  const exportsOf = {};
  const run = async (file, requires = {}) => {
    const { outputText } = ts.transpileModule(await read(file), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    const sandboxModule = { exports: {} };
    vm.runInNewContext(outputText, {
      module: sandboxModule,
      exports: sandboxModule.exports,
      require: (name) => requires[name],
      process: { env: flag === undefined ? {} : { NEXT_PUBLIC_THEME_ENABLED: flag } },
    });
    return sandboxModule.exports;
  };
  exportsOf.config = await run("config.ts");
  exportsOf.bootstrap = await run("bootstrap.ts", { "./config": exportsOf.config });
  return exportsOf;
};

const cookies = [
  undefined,
  "",
  "jayab_theme=dark",
  "jayab_theme=light",
  "jayab_theme=system",
  "jayab_theme=dark-invalid",
  "jayab_theme=DARK",
  "xjayab_theme=dark",
  "a=b; jayab_theme=dark; c=d",
  "a=b; jayab_theme=light",
];

let cases = 0;
for (const flag of [undefined, "0", "true", "1"]) {
  const { config, bootstrap } = await load(flag);
  const enabled = flag === "1";
  assert.equal(config.THEME_ENABLED, enabled, `flag ${flag}`);
  assert.equal(bootstrap.themeBootstrapScript === "", !enabled, `script presence with flag ${flag}`);

  for (const cookie of cookies) {
    for (const prefersDark of [false, true]) {
      const expected = config.resolveTheme(config.readCookieChoice(cookie ?? ""), prefersDark);
      if (!enabled) assert.equal(expected, "light", "engine off is always light");

      const attributes = {};
      const root = { setAttribute: (name, value) => (attributes[name] = value), style: {} };
      if (enabled) {
        vm.runInNewContext(bootstrap.themeBootstrapScript, {
          document: { cookie: cookie ?? "", documentElement: root },
          matchMedia: () => ({ matches: prefersDark }),
        });
        assert.equal(attributes["data-theme"], expected, `script vs resolver: ${cookie} dark=${prefersDark}`);
        assert.equal(root.style.colorScheme, expected, "color-scheme follows data-theme");
      }
      cases++;
    }
  }

  if (enabled) {
    // storage or matchMedia failures must leave html untouched (light), not throw.
    for (const sandbox of [
      { document: { get cookie() { throw new Error("blocked"); }, documentElement: { setAttribute() {}, style: {} } }, matchMedia: () => ({ matches: true }) },
      { document: { cookie: "", documentElement: { setAttribute() {}, style: {} } } },
    ]) assert.doesNotThrow(() => vm.runInNewContext(bootstrap.themeBootstrapScript, sandbox));
    assert.equal(bootstrap.themeBootstrapScript.includes("</script"), false);
  }
}

console.log(`Theme contract passed: ${cases} script/resolver cases across 4 flag values, failure paths silent.`);
