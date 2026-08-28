import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , name, ...flags] = process.argv;
if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error("Usage: yarn module:scaffold PascalCaseName [--client] [--skeleton] [--dry-run]");
  process.exit(1);
}

const withClient = flags.includes("--client");
const withSkeleton = flags.includes("--skeleton");
const dryRun = flags.includes("--dry-run");
const unknownFlags = flags.filter((flag) => !["--client", "--skeleton", "--dry-run"].includes(flag));
if (unknownFlags.length > 0) {
  console.error(`Unknown flags: ${unknownFlags.join(", ")}`);
  process.exit(1);
}

const root = process.cwd();
const moduleDirectory = path.join(root, "components", "modules", name);
const typeName = `${name}Props`;
const typeFileName = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const typePath = path.join(root, "types", "components", "modules", `${typeFileName}.ts`);

const files = new Map([
  [
    path.join(moduleDirectory, `${name}.tsx`),
    withClient
      ? `import { ${name}Client } from "./${name}.client";\n\nimport type { ${typeName} } from "@/types/components/modules/${typeFileName}";\n\nexport const ${name} = (props: ${typeName}) => <${name}Client {...props} />;\n`
      : `import type { ${typeName} } from "@/types/components/modules/${typeFileName}";\n\nexport const ${name} = (_props: ${typeName}) => <section />;\n`,
  ],
  [path.join(moduleDirectory, "index.ts"), `export { ${name} } from "./${name}";\n`],
  [typePath, `export type ${typeName} = Record<string, never>;\n`],
]);

if (withClient) {
  files.set(
    path.join(moduleDirectory, `${name}.client.tsx`),
    `"use client";\n\nimport type { ${typeName} } from "@/types/components/modules/${typeFileName}";\n\nexport const ${name}Client = (_props: ${typeName}) => <section />;\n`,
  );
}
if (withSkeleton) {
  files.set(
    path.join(moduleDirectory, "parts", `${name}Skeleton.tsx`),
    `export const ${name}Skeleton = () => (\n  <section aria-hidden="true" className="animate-pulse motion-reduce:animate-none" />\n);\n`,
  );
}

for (const file of files.keys()) {
  if (existsSync(file)) {
    console.error(`Refusing to overwrite existing file: ${path.relative(root, file)}`);
    process.exit(1);
  }
}

for (const [file, content] of files) {
  if (dryRun) {
    console.log(`would create ${path.relative(root, file).replaceAll("\\", "/")}`);
    continue;
  }
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content, { flag: "wx" });
  console.log(`created ${path.relative(root, file).replaceAll("\\", "/")}`);
}
