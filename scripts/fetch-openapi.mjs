import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const sourceUrl = process.env.OPENAPI_SCHEMA_URL || "http://127.0.0.1:3001/api-json";
const outputPath = resolve(process.cwd(), process.env.OPENAPI_SCHEMA_PATH || "openapi/jayab.openapi.json");

const response = await fetch(sourceUrl, { headers: { accept: "application/json" } });
if (!response.ok) throw new Error(`OpenAPI download failed (${response.status}) from ${sourceUrl}`);

const document = await response.json();
if (!document.openapi && !document.swagger) throw new Error("The downloaded document is not OpenAPI/Swagger");
if (!document.paths || typeof document.paths !== "object") throw new Error("The OpenAPI document has no paths");

const operationIds = new Set();
for (const operations of Object.values(document.paths)) {
  for (const operation of Object.values(operations || {})) {
    if (!operation || typeof operation !== "object" || !operation.operationId) continue;
    if (operationIds.has(operation.operationId)) throw new Error(`Duplicate operationId: ${operation.operationId}`);
    operationIds.add(operation.operationId);
  }
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
console.log(`OpenAPI schema written to ${outputPath} (${operationIds.size} operations)`);
