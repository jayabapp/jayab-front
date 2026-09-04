// postcss.config.js - Only if you really need cssnano
const path = require("path");

const plugins = [
  "tailwindcss",
  // Runs after Tailwind so it also sees the declarations `@apply` expands to.
  // See the plugin itself for what it does and why.
  //
  // Absolute, not "./scripts/...": Turbopack `require`s these strings from its
  // own postcss transform module, where a project-relative specifier does not
  // resolve, and it silently drops a plugin passed as an already-required
  // function. Both failure modes are quiet -- the build succeeds and the
  // transform simply never runs -- so check the emitted CSS after touching this.
  path.join(__dirname, "scripts", "postcss-viewport-unit-fallback.cjs"),
];

if (process.env.NODE_ENV === "production") {
  plugins.push([
    "cssnano",
    {
      preset: [
        "default",
        {
          discardComments: { removeAll: true },
        },
      ],
    },
  ]);
}

module.exports = { plugins };
