import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { legacyClientRoutes } from "../architecture/adr/legacy-client-routes.mjs";

const root = process.cwd();
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const architectureRoots = ["components/elements", "components/layouts", "components/modules", "components/templates"];
const violations = [];

const walk = async (relativeDirectory) => {
  const absoluteDirectory = path.join(root, relativeDirectory);
  let entries;
  try {
    entries = await readdir(absoluteDirectory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

  const files = await Promise.all(
    entries.map((entry) => {
      const relativePath = path.join(relativeDirectory, entry.name);
      return entry.isDirectory()
        ? walk(relativePath)
        : Promise.resolve(sourceExtensions.has(path.extname(entry.name)) ? [relativePath] : []);
    }),
  );
  return files.flat();
};

const readImports = (source) => {
  const imports = [];
  const staticImport = /\b(?:import|export)\s+(?:[^"'`;]*?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicImport = /\bimport\(\s*["']([^"']+)["']\s*\)/g;
  for (const expression of [staticImport, dynamicImport]) {
    for (const match of source.matchAll(expression)) imports.push(match[1]);
  }
  return imports;
};

const isOneOf = (specifier, prefixes) =>
  prefixes.some((prefix) => specifier === prefix || specifier.startsWith(`${prefix}/`));

const report = (file, message) => violations.push(`${file.replaceAll("\\", "/")}: ${message}`);

const appFiles = await walk("app");
const clientAppFiles = new Set();
for (const file of appFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  if (!/^\s*["']use client["'];/m.test(source)) continue;

  const normalizedFile = file.replaceAll("\\", "/");
  clientAppFiles.add(normalizedFile);
  const isRouteBoundary = /\/(?:page|layout)\.tsx$/.test(normalizedFile);
  if (isRouteBoundary && !legacyClientRoutes.includes(normalizedFile)) {
    report(file, "route-level Client Components require an explicit ADR exception");
  }
  if (!isRouteBoundary && !normalizedFile.endsWith(".client.tsx")) {
    report(file, 'non-route Client Components in app must use the ".client.tsx" suffix');
  }
}

for (const exception of legacyClientRoutes) {
  if (!clientAppFiles.has(exception)) {
    report(exception, "stale client-route ADR exception; remove it after migration");
  }
}

const componentFiles = await walk("components");
for (const file of componentFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  if (/Skeleton[^/]*\.tsx$/.test(file) && /^\s*["']use client["'];/m.test(source)) {
    report(file, "skeletons must remain server-compatible; use CSS for loading animation");
  }
  for (const specifier of readImports(source)) {
    if (isOneOf(specifier, ["@/app", "@app"])) {
      report(file, `components cannot import the app layer (${specifier})`);
    }
  }
}

for (const architectureRoot of architectureRoots) {
  const files = await walk(architectureRoot);
  const layer = architectureRoot.split("/").at(-1);

  for (const file of files) {
    const source = await readFile(path.join(root, file), "utf8");
    const imports = readImports(source);
    const hasClientDirective = /^\s*["']use client["'];/m.test(source);

    if (layer === "templates" && hasClientDirective) {
      report(file, "templates must remain Server Components");
    }
    if (["layouts", "modules"].includes(layer) && hasClientDirective && !file.endsWith(".client.tsx")) {
      report(file, 'client islands in layouts/modules must use the ".client.tsx" suffix');
    }

    for (const specifier of imports) {
      if (
        layer === "elements" &&
        isOneOf(specifier, ["@/api_services", "@/features", "@features", "@/generated", "@generated", "@/store", "@modules", "@templates", "@layouts"])
      ) {
        report(file, `elements cannot depend on application or domain state (${specifier})`);
      }
      if (
        layer === "templates" &&
        isOneOf(specifier, ["@/api_services", "@/features", "@features", "@/generated", "@generated", "@/store", "@tanstack/react-query", "zustand"])
      ) {
        report(file, `templates only compose data and slots supplied by the page (${specifier})`);
      }
      if (
        layer === "layouts" &&
        isOneOf(specifier, ["@/api_services", "@/features", "@features", "@/generated", "@generated", "@/store", "@modules", "@templates"])
      ) {
        report(file, `layouts cannot own page/module domain logic (${specifier})`);
      }
      if (layer === "modules" && /^@modules\/[^/]+\/parts(?:\/|$)/.test(specifier)) {
        report(file, `module parts are private; import the other module's public index (${specifier})`);
      }
    }
  }
}

const moduleRoot = path.join(root, "components/modules");
try {
  const moduleDirectories = (await readdir(moduleRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
  for (const directory of moduleDirectories) {
    const files = await readdir(path.join(moduleRoot, directory.name));
    if (!files.includes("index.ts") && !files.includes("index.tsx")) {
      report(path.join("components/modules", directory.name), "each module requires a public index.ts or index.tsx entry point");
    }
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

if (violations.length > 0) {
  console.error("Layer contract violations:\n");
  console.error(violations.map((violation) => `- ${violation}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Layer contracts passed (${componentFiles.length} component files checked).`);
}
