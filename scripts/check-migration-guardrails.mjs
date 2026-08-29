import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sourcePattern = /\.(?:js|jsx|mjs|cjs|ts|tsx)$/;
const baseSha = process.env.MIGRATION_BASE_SHA?.trim();

const git = (...args) => {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status || 1);
  }
  return result.stdout;
};

const listChangedFiles = () => {
  const ranges = baseSha
    ? [["diff", "--name-only", "--diff-filter=ACMR", `${baseSha}...HEAD`]]
    : [
        ["diff", "--name-only", "--diff-filter=ACMR", "HEAD"],
        ["diff", "--cached", "--name-only", "--diff-filter=ACMR"],
        ["ls-files", "--others", "--exclude-standard"],
      ];

  return [
    ...new Set(
      ranges
        .flatMap((args) => git(...args).split(/\r?\n/))
        .map((file) => file.trim().replaceAll("\\", "/"))
        .filter(Boolean),
    ),
  ];
};

const changedFiles = listChangedFiles().filter((file) => existsSync(file));
const sourceFiles = changedFiles.filter((file) => sourcePattern.test(file));
const violations = [];
const diffRange = baseSha ? [`${baseSha}...HEAD`] : ["HEAD"];

const addedSource = (file) => {
  const diff = git("diff", "--unified=0", ...diffRange, "--", file);
  const additions = diff
    .split(/\r?\n/)
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .map((line) => line.slice(1))
    .join("\n");

  if (additions) return additions;
  const isUntracked = git("ls-files", "--others", "--exclude-standard", "--", file).trim();
  return isUntracked ? readFileSync(file, "utf8") : "";
};

for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  const additions = addedSource(file);
  const isMigratedUi = /^(?:app|components|features)\//.test(file);

  if (isMigratedUi && /\b(?:LottieLoading|SmallLoading)\b/.test(additions)) {
    violations.push(`${file}: migrated UI must use a domain skeleton instead of a legacy loading component`);
  }
  if (/\binvalidateQueries\s*\(\s*\)/.test(additions)) {
    violations.push(`${file}: broad query invalidation requires an explicit query key`);
  }
  if (/from\s+["']lodash["']/.test(additions)) {
    violations.push(`${file}: import lodash functions from their direct module`);
  }
  if (/^(?:app|components)\//.test(file) && /<img\b/.test(additions)) {
    violations.push(`${file}: new bitmap UI must use next/image or a documented exception`);
  }
  if (/\bURL\.createObjectURL\s*\(/.test(additions) && !/\bURL\.revokeObjectURL\s*\(/.test(source)) {
    violations.push(`${file}: object URLs require lifecycle cleanup with URL.revokeObjectURL`);
  }
  if (/\.addEventListener\s*\(/.test(additions) && !/\.removeEventListener\s*\(/.test(source)) {
    violations.push(`${file}: DOM event listeners require cleanup`);
  }
  if (/\bsetTimeout\s*\(/.test(additions) && !/\bclearTimeout\s*\(/.test(source)) {
    violations.push(`${file}: timers require cleanup or a shared lifecycle-safe abstraction`);
  }
}

if (violations.length > 0) {
  console.error("Migration guardrail violations:\n");
  console.error(violations.map((violation) => `- ${violation}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Migration guardrails passed (${sourceFiles.length} changed source files checked).`);
}
