import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const roots = ["app", "components", "features"];
const extensions = new Set([".js", ".jsx", ".ts", ".tsx"]);

const walk = async (relativeDirectory) => {
  const entries = await readdir(path.join(root, relativeDirectory), { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const target = path.join(relativeDirectory, entry.name);
        return entry.isDirectory()
          ? walk(target)
          : Promise.resolve(extensions.has(path.extname(entry.name)) ? [target] : []);
      }),
    )
  ).flat();
};

const boundaries = [];
for (const file of (await Promise.all(roots.map(walk))).flat()) {
  const source = await readFile(path.join(root, file), "utf8");
  if (!/^\s*["']use client["'];/m.test(source)) continue;
  boundaries.push({
    file: file.replaceAll("\\", "/"),
    sourceBytes: (await stat(path.join(root, file))).size,
  });
}

const byRoot = Object.fromEntries(
  roots.map((directory) => [directory, boundaries.filter(({ file }) => file.startsWith(`${directory}/`)).length]),
);
const routeBoundaries = boundaries.filter(({ file }) => /\/(?:page|layout)\.tsx$/.test(file));
const largest = [...boundaries].sort((a, b) => b.sourceBytes - a.sourceBytes).slice(0, 15);
const report = { total: boundaries.length, byRoot, routeBoundaries: routeBoundaries.length, largest };

if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`Client boundaries: ${report.total} (${roots.map((directory) => `${directory}: ${byRoot[directory]}`).join(", ")})`);
  console.log(`Route-level boundaries: ${routeBoundaries.length}`);
  console.log("Largest client source files (source size is a review signal, not emitted chunk size):");
  for (const boundary of largest) console.log(`- ${boundary.sourceBytes.toString().padStart(7)} B  ${boundary.file}`);
}
