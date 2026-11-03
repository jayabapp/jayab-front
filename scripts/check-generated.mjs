import { spawnSync } from "node:child_process";

const yarnCommand = process.platform === "win32" ? "yarn.cmd" : "yarn";
const generation = spawnSync(yarnCommand, ["api:generate"], { stdio: "inherit" });
if (generation.status !== 0) process.exit(generation.status || 1);

const status = spawnSync("git", ["status", "--porcelain", "--", "generated/api"], { encoding: "utf8" });
if (status.status !== 0) process.exit(status.status || 1);
if (status.stdout.trim()) {
  console.error("Generated API is out of date. Run `yarn api:generate` and commit the result.");
  console.error(status.stdout.trim());
  process.exit(1);
}
