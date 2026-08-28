import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const baseSha = process.env.MIGRATION_BASE_SHA?.trim();
const sourcePattern = /\.(?:js|jsx|mjs|cjs|ts|tsx)$/;

const git = (...args) => {
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
const files = [
  ...new Set(
    ranges
      .flatMap((args) => git(...args).split(/\r?\n/))
      .map((file) => file.trim().replaceAll("\\", "/"))
      .filter((file) => sourcePattern.test(file) && existsSync(file)),
  ),
];
const reviewFiles = files.filter((file) =>
  /^(?:app|components|features|api_services|lib|hooks|store)\//.test(file),
);

const clientFiles = [];
const serverFiles = [];
const routes = [];
const modules = new Set();
const signals = {
  data: false,
  image: false,
  loading: false,
  remoteSearch: false,
  mutation: false,
};

for (const file of reviewFiles) {
  const source = readFileSync(file, "utf8");
  (/^\s*["']use client["'];/m.test(source) ? clientFiles : serverFiles).push(file);
  if (/^app\/.+\/(?:page|layout)\.tsx$/.test(file)) routes.push(file);
  const moduleMatch = file.match(/^components\/modules\/([^/]+)/);
  if (moduleMatch) modules.add(moduleMatch[1]);
  signals.data ||= /useQuery|useMutation|serverCall|queryOptions|mutationOptions/.test(source);
  signals.image ||= /next\/image|<img\b/.test(source);
  signals.loading ||= /Skeleton|isPending|isFetching/.test(source);
  signals.remoteSearch ||= /search/i.test(file) && /useQuery|fetch|apiCall/.test(source);
  signals.mutation ||= /useMutation|mutationOptions/.test(source);
}

const output = {
  changedSourceFiles: files.length,
  reviewedApplicationFiles: reviewFiles.length,
  routes,
  modules: [...modules].sort(),
  clientFiles,
  serverFiles,
  requiredManualChecks: [
    "desktop, mobile and RTL smoke test",
    "direct navigation, client navigation and back/forward",
    "loading, empty, error and success states",
    ...(signals.loading ? ["skeleton dimensions, CLS, dark mode and reduced motion"] : []),
    ...(signals.data ? ["development and production network trace; request count before/after"] : []),
    ...(signals.remoteSearch ? ["debounce, cancellation and out-of-order response"] : []),
    ...(signals.mutation ? ["double-submit, idempotency and unmount during request"] : []),
    ...(signals.image ? ["image bytes, LCP/CLS, sizes and optimizer cache"] : []),
    ...(routes.length > 0 ? ["SSR/SEO output without JavaScript when applicable"] : []),
  ],
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(output, null, 2));
} else {
  console.log("Migration review scope:");
  console.log(`- changed source files: ${output.changedSourceFiles}`);
  console.log(`- reviewed application files: ${output.reviewedApplicationFiles}`);
  console.log(`- server files: ${serverFiles.length}`);
  console.log(`- client files: ${clientFiles.length}`);
  console.log(`- routes: ${routes.length ? routes.join(", ") : "none"}`);
  console.log(`- modules: ${output.modules.length ? output.modules.join(", ") : "none"}`);
  console.log("Manual acceptance checks:");
  for (const check of output.requiredManualChecks) console.log(`- [ ] ${check}`);
}
