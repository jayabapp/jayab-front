import next from "eslint-config-next";

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
];

export default eslintConfig;
