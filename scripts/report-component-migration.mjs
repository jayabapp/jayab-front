import { componentMigrationMap } from "../architecture/component-migration-map.mjs";

const totals = componentMigrationMap.reduce(
  (result, entry) => ({ ...result, [entry.status]: (result[entry.status] ?? 0) + 1 }),
  {},
);

console.log("Component migration map:\n");
for (const entry of componentMigrationMap) {
  console.log(`- [${entry.status.padEnd(11)}] ${entry.source} -> ${entry.targets.join(", ")}`);
}
console.log(`\nTotals: ${Object.entries(totals).map(([status, count]) => `${status}: ${count}`).join(", ")}`);
