// Lets `node --test` load the pure TypeScript helpers (Node strips the types):
// extensionless relative imports resolve to .ts. No dependency, tests only.
import { register } from "node:module";

const root = new URL("../../", import.meta.url).href;
register(
  "data:text/javascript," +
    encodeURIComponent(`
      export async function resolve(specifier, context, next) {
        if (specifier.startsWith("@/")) return next(new URL(specifier.slice(2) + ".ts", ${JSON.stringify(root)}).href, context);
        if (specifier.startsWith("@lib/")) return next(new URL("lib/" + specifier.slice(5) + ".ts", ${JSON.stringify(root)}).href, context);
        try { return await next(specifier, context); }
        catch (error) {
          if (specifier.startsWith(".") && !/\.\w+$/.test(specifier)) return next(specifier + ".ts", context);
          throw error;
        }
      }`),
);
