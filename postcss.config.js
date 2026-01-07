// postcss.config.js - Only if you really need cssnano
const plugins = ["tailwindcss"];

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
