import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sourcePattern = /\.(?:js|jsx|mjs|cjs|ts|tsx)$/;
const baseSha = process.env.MIGRATION_BASE_SHA?.trim();

const run = (program, args, options = {}) => {
  console.log(`\n> ${program} ${args.join(" ")}`);
  const result = spawnSync(program, args, { stdio: "inherit", ...options });
  if (result.status !== 0) process.exit(result.status || 1);
};

const gitOutput = (...args) => {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) process.exit(result.status || 1);
  return result.stdout;
};

const ranges = baseSha
  ? [["diff", "--name-only", "--diff-filter=ACMR", `${baseSha}...HEAD`]]
  : [
      ["diff", "--name-only", "--diff-filter=ACMR", "HEAD"],
      ["diff", "--cached", "--name-only", "--diff-filter=ACMR"],
      ["ls-files", "--others", "--exclude-standard"],
    ];
const changedSources = [
  ...new Set(
    ranges
      .flatMap((args) => gitOutput(...args).split(/\r?\n/))
      .map((file) => file.trim())
      .filter((file) => sourcePattern.test(file) && existsSync(file)),
  ),
];
const migrationLintRoots = [
  "architecture/",
  "app/(pages)/",
  "components/elements/",
  "components/modules/",
  "components/templates/",
  "scripts/",
  "types/components/elements/",
  "types/components/modules/",
  "types/components/templates/",
  "utils/LocalStrings.ts",
];
const lintSources = changedSources.filter((file) => {
  const normalizedFile = file.replaceAll("\\", "/");
  return migrationLintRoots.some((root) => normalizedFile.startsWith(root));
});

run(process.execPath, ["scripts/check-layer-contracts.mjs"]);
run(process.execPath, ["scripts/check-import-cycles.mjs"]);
run(process.execPath, ["scripts/check-migration-guardrails.mjs"]);
run(process.execPath, ["scripts/report-migration-review.mjs"]);

if (lintSources.length > 0) {
  run(process.execPath, ["node_modules/eslint/bin/eslint.js", ...lintSources]);
} else {
  console.log("\nNo changed source files require ESLint.");
}

run(process.execPath, ["--max-old-space-size=2048", "node_modules/typescript/bin/tsc", "--noEmit"]);

if (process.argv.includes("--build")) {
  run(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
    env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=2048" },
  });
}

console.log("\nMigration verification passed.");
