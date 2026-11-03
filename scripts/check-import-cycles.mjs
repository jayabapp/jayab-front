import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const roots = [
  "app/(profile)/profile/support",
  "components/elements",
  "components/layouts",
  "components/modules",
  "components/templates",
  "features/support",
  "types",
];
const extensions = [".ts", ".tsx", ".js", ".jsx", ".mjs"];
const aliasRoots = new Map([
  ["@app/", "app/"],
  ["@elements/", "components/elements/"],
  ["@features/", "features/"],
  ["@generated/", "generated/"],
  ["@hooks/", "hooks/"],
  ["@layouts/", "components/layouts/"],
  ["@lib/", "lib/"],
  ["@modules/", "components/modules/"],
  ["@templates/", "components/templates/"],
  ["@utils/", "utils/"],
  ["@/", ""],
]);

const walk = (directory) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : extensions.includes(path.extname(entry.name)) ? [target] : [];
  });
};

const files = roots.flatMap((directory) => walk(path.join(root, directory)));
const normalizedFiles = new Map(files.map((file) => [path.normalize(file), file]));
const importPattern = /\b(?:import|export)\s+(?:[^"'`;]*?\s+from\s+)?["']([^"']+)["']/g;

const resolveImport = (fromFile, specifier) => {
  let candidate;
  if (specifier.startsWith(".")) {
    candidate = path.resolve(path.dirname(fromFile), specifier);
  } else {
    const alias = [...aliasRoots].find(([prefix]) => specifier.startsWith(prefix));
    if (!alias) return null;
    candidate = path.join(root, alias[1], specifier.slice(alias[0].length));
  }

  const candidates = [
    candidate,
    ...extensions.map((extension) => `${candidate}${extension}`),
    ...extensions.map((extension) => path.join(candidate, `index${extension}`)),
  ];
  return candidates.map((file) => path.normalize(file)).find((file) => normalizedFiles.has(file)) ?? null;
};

const graph = new Map();
for (const file of files) {
  const dependencies = [];
  for (const match of readFileSync(file, "utf8").matchAll(importPattern)) {
    const dependency = resolveImport(file, match[1]);
    if (dependency) dependencies.push(dependency);
  }
  graph.set(path.normalize(file), [...new Set(dependencies)]);
}

const visiting = new Set();
const visited = new Set();
const stack = [];
const cycles = new Set();

const visit = (file) => {
  if (visiting.has(file)) {
    const cycleStart = stack.indexOf(file);
    const cycle = [...stack.slice(cycleStart), file]
      .map((entry) => path.relative(root, entry).replaceAll("\\", "/"))
      .join(" -> ");
    cycles.add(cycle);
    return;
  }
  if (visited.has(file)) return;

  visiting.add(file);
  stack.push(file);
  for (const dependency of graph.get(file) ?? []) visit(dependency);
  stack.pop();
  visiting.delete(file);
  visited.add(file);
};

for (const file of graph.keys()) visit(file);

if (cycles.size > 0) {
  console.error("Import cycles detected:\n");
  console.error([...cycles].map((cycle) => `- ${cycle}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Import cycle check passed (${files.length} files checked).`);
}

