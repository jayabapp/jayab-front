// Read-only inventory. Run from Front; counts are candidates, not migration tasks.
import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const roots = ["app", "components", "features"];
const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : /\.tsx?$/.test(file) ? [file] : [];
  }))).flat();
};
const files = (await Promise.all(roots.map(walk))).flat();
const sources = await Promise.all(files.map(async (file) => ({
  file: file.replaceAll("\\", "/"), source: await readFile(file, "utf8"),
})));
const patterns = {
  bgWhite: /\bbg-white\b/g,
  darkVariant: /\bdark:/g,
  legacyColor: /\b(?:primary|btnColor)-[\w-]+/g,
  localStringsImport: /\bfrom\s+["'][^"']*LocalStrings["']/g,
  momentImport: /\bfrom\s+["']moment-jalaali["']/g,
  arabicScriptCandidate: /[\u0600-\u06ff]/g,
  physicalDirection: /\b(?:ml|mr|pl|pr|left|right|rounded-l|rounded-r|border-l|border-r)-|\btext-(?:left|right)\b/g,
};
const inventory = Object.fromEntries(Object.entries(patterns).map(([name, expression]) => {
  const matches = sources.map(({ file, source }) => ({ file, count: [...source.matchAll(expression)].length })).filter(({ count }) => count);
  return [name, { occurrences: matches.reduce((sum, { count }) => sum + count, 0), files: matches.length }];
}));
const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
console.log(JSON.stringify({ branch: git("branch", "--show-current"), commit: git("rev-parse", "--short=8", "HEAD"), roots, sourceFiles: files.length, tsxFiles: files.filter((file) => file.endsWith(".tsx")).length, inventory }, null, 2));
