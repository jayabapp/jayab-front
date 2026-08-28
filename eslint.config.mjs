import next from "eslint-config-next";

import { legacyClientRoutes } from "./architecture/adr/legacy-client-routes.mjs";

// eslint-config-next ships a flat config array from v15 on. Routing it through
// FlatCompat's eslintrc shim made ESLint 10 fail config-schema validation and
// then crash formatting the error ("Converting circular structure to JSON").
const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...next,
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    // eslint-plugin-react's "detect" mode calls context.getFilename(), which
    // ESLint 10 removed, so auto-detection throws. Pinning the version skips it.
    settings: { react: { version: "19.2" } },
  },
  // Plugins are scoped per config object in flat config, so these overrides
  // have to repeat the `files` patterns the plugins were registered against.
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "no-unused-vars": "off",
      // Bare `lodash` is CommonJS, so bundlers cannot tree-shake it: a single
      // named import drags the whole library into the chunk. Path imports
      // (`lodash/debounce`) do not have that problem.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message:
                'Import the function directly instead, e.g. import debounce from "lodash/debounce".',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "components/elements/**/*.{ts,tsx}",
      "components/support/**/*.{ts,tsx}",
      "features/**/*.{ts,tsx}",
      "hooks/useDebouncedValue.ts",
      "lib/**/*.{ts,tsx}",
      "types/**/*.ts",
    ],
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message: 'Import the function directly instead, e.g. import debounce from "lodash/debounce".',
            },
          ],
          patterns: [
            {
              group: ["../../*", "../../../*", "../../../../*"],
              message: "Use a configured @ alias outside the current feature/module.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/dark:|(?:primary|btnColor)-|(?:gray|zinc|slate|stone)-(?:[0-9]+)/]",
          message:
            "Use the semantic brand, neutral, success, warning, or danger color tokens.",
        },
        {
          selector:
            "TemplateElement[value.raw=/dark:|(?:primary|btnColor)-|(?:gray|zinc|slate|stone)-(?:[0-9]+)/]",
          message:
            "Use the semantic brand, neutral, success, warning, or danger color tokens.",
        },
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}/]",
          message: "Import runtime colors from @/theme/colors instead of hardcoding hex values.",
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}/]",
          message: "Import runtime colors from @/theme/colors instead of hardcoding hex values.",
        },
      ],
    },
  },
  {
    files: ["components/elements/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message: 'Import the function directly instead, e.g. import debounce from "lodash/debounce".',
            },
          ],
          patterns: [
            {
              group: [
                "@/app/*",
                "@app/*",
                "@/api_services/*",
                "@/features/*",
                "@features/*",
                "@/generated/*",
                "@generated/*",
                "@/store/*",
                "@modules/*",
                "@templates/*",
                "@layouts/*",
              ],
              message: "Elements must stay domain-agnostic and cannot access API, feature, store, or upper UI layers.",
            },
            {
              group: ["../../*", "../../../*", "../../../../*"],
              message: "Use a configured @ alias outside the current element.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["components/templates/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "window", message: "Templates are Server Components; move browser behavior to a client island." },
        { name: "document", message: "Templates are Server Components; move browser behavior to a client island." },
        { name: "localStorage", message: "Templates are Server Components; move browser behavior to a client island." },
        { name: "navigator", message: "Templates are Server Components; move browser behavior to a client island." },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExpressionStatement[directive='use client']",
          message: "Templates must remain Server Components. Move interaction into a module client island.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message: 'Import the function directly instead, e.g. import debounce from "lodash/debounce".',
            },
          ],
          patterns: [
            {
              group: [
                "@/app/*",
                "@app/*",
                "@/api_services/*",
                "@/features/*",
                "@features/*",
                "@/generated/*",
                "@generated/*",
                "@/store/*",
                "@tanstack/react-query",
                "zustand",
                "@modules/*/parts",
                "@modules/*/parts/*",
                "@/components/*",
              ],
              message: "Templates only compose public module, layout, and element entry points.",
            },
            {
              group: ["../../*", "../../../*", "../../../../*"],
              message: "Use a configured @ alias outside the current template.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["components/layouts/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message: 'Import the function directly instead, e.g. import debounce from "lodash/debounce".',
            },
          ],
          patterns: [
            {
              group: [
                "@/app/*",
                "@app/*",
                "@/api_services/*",
                "@/features/*",
                "@features/*",
                "@/generated/*",
                "@generated/*",
                "@/store/*",
                "@modules/*",
                "@templates/*",
              ],
              message: "Layouts cannot own page or module domain logic.",
            },
            {
              group: ["../../*", "../../../*", "../../../../*"],
              message: "Use a configured @ alias outside the current layout.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["components/modules/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message: 'Import the function directly instead, e.g. import debounce from "lodash/debounce".',
            },
          ],
          patterns: [
            {
              group: ["@/app/*", "@app/*", "@modules/*/parts", "@modules/*/parts/*"],
              message: "Module parts are private. Import another module through its public index.ts.",
            },
            {
              group: [
                "@/api_services/*",
                "@/generated/*",
                "@generated/*",
                "@tanstack/react-query",
                "@features/*/api/*",
                "@/features/*/api/*",
                "@/utils/urls",
              ],
              message: "Modules consume high-level feature hooks, never data clients, query options, keys, or endpoints.",
            },
            {
              group: ["../../*", "../../../*", "../../../../*"],
              message: "Use a configured @ alias outside the current module.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message: 'Import the function directly instead, e.g. import debounce from "lodash/debounce".',
            },
          ],
          patterns: [
            {
              group: [
                "@modules/*",
                "@templates/*",
                "@layouts/*",
                "@/components/modules/*",
                "@/components/templates/*",
                "@/components/layouts/*",
              ],
              message: "Features own domain/data behavior and cannot depend on UI composition layers.",
            },
            {
              group: ["../../*", "../../../*", "../../../../*"],
              message: "Use a configured @ alias outside the current feature.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["features/support/hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message: 'Import the function directly instead, e.g. import debounce from "lodash/debounce".',
            },
          ],
          patterns: [
            {
              group: ["@/api_services/*", "@/generated/*", "@generated/*"],
              message: "Support hooks must consume their feature api boundary instead of transport clients.",
            },
            {
              group: [
                "@modules/*",
                "@templates/*",
                "@layouts/*",
                "@/components/modules/*",
                "@/components/templates/*",
                "@/components/layouts/*",
              ],
              message: "Features own domain/data behavior and cannot depend on UI composition layers.",
            },
            {
              group: ["../../*", "../../../*", "../../../../*"],
              message: "Use a configured @ alias outside the current feature.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["components/layouts/**/*.{ts,tsx}", "components/modules/**/*.{ts,tsx}"],
    ignores: ["**/*.client.tsx"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "window", message: "Move browser behavior into a colocated .client.tsx island." },
        { name: "document", message: "Move browser behavior into a colocated .client.tsx island." },
        { name: "localStorage", message: "Move browser behavior into a colocated .client.tsx island." },
        { name: "navigator", message: "Move browser behavior into a colocated .client.tsx island." },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExpressionStatement[directive='use client']",
          message: 'Client islands inside layouts/modules must be named with the ".client.tsx" suffix.',
        },
      ],
    },
  },
  {
    files: ["app/**/page.tsx", "app/**/layout.tsx"],
    ignores: legacyClientRoutes,
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExpressionStatement[directive='use client']",
          message: "Route pages/layouts are Server Components by default; an exception requires an ADR.",
        },
      ],
    },
  },
  {
    files: ["app/**/*.tsx"],
    ignores: ["app/**/page.tsx", "app/**/layout.tsx", "app/**/*.client.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExpressionStatement[directive='use client']",
          message: 'Non-route Client Components in app must use the ".client.tsx" suffix.',
        },
      ],
    },
  },
  {
    // Orval bundles this mutator config with esbuild before TypeScript path
    // aliases are available, so this one boundary intentionally stays relative.
    files: ["lib/api/generated-client.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];

export default eslintConfig;
