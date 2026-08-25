import { defineConfig } from "orval";

export default defineConfig({
  jayab: {
    input: {
      target: process.env.OPENAPI_SCHEMA_PATH || "./openapi/jayab.openapi.json",
    },
    output: {
      target: "./generated/api/jayab.ts",
      schemas: "./generated/api/models",
      mode: "tags-split",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: "./lib/api/generated-client.ts",
          name: "generatedApiClient",
        },
        query: {
          signal: true,
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
