// Lets `node --test` load the pure TypeScript helpers (Node strips the types):
// extensionless relative imports resolve to .ts. No dependency, tests only.
import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`
      export async function resolve(specifier, context, next) {
        try { return await next(specifier, context); }
        catch (error) {
          if (specifier.startsWith(".") && !/\.\w+$/.test(specifier)) return next(specifier + ".ts", context);
          throw error;
        }
      }`),
);
