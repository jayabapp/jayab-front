/**
 * Gives every dynamic-viewport declaration (`dvh`, `dvw`, `dvmin`, `dvmax`) a
 * `vh`/`vw` twin, guarded by `@supports not (height: 1dvh)`.
 *
 * The dynamic units landed in Safari 15.4. An iPhone still on iOS 15.0-15.3
 * parses `min-height: 25dvh` as invalid and throws the declaration away, so a
 * panel sized only in `dvh` collapsed to nothing there: tapping the search
 * trigger looked like it did nothing, because the panel that opened had no
 * height. `vh` is the large-viewport height, which is what these rules resolved
 * to before `dvh` existed, so the fallback restores the previous behaviour on
 * those devices rather than inventing a new one.
 *
 * Two things dictate the shape:
 *
 * `@supports not (...)` rather than the usual repeated declaration, because
 * Turbopack minifies with Lightning CSS, which deletes a repeated declaration
 * as a redundant fallback the moment browserslist says every target understands
 * `dvh`. The browserslist floor in package.json is Safari 15 today, so a
 * repeated declaration would survive -- but it would vanish silently the day
 * someone raises that floor to 15.4 or above, taking this fallback with it.
 * Lightning CSS keeps the `@supports` block at any target, so this form does
 * not depend on the floor staying where it is. It costs about 150 bytes gzipped
 * more than the repeated-declaration form across the whole stylesheet.
 *
 * The block goes directly after the rule it shadows, inside whatever media
 * query that rule lives in, so the media condition and the cascade order are
 * both exactly what they were.
 *
 * Doing it in PostCSS rather than by hand covers arbitrary Tailwind values,
 * `@apply` inside component classes and responsive variants in one pass -- and
 * covers a `dvh` written next week without anyone remembering to.
 */

// A number immediately followed by the unit, and not preceded by anything that
// would make it part of a longer token (an identifier, a filename in url(), ...).
const DYNAMIC_VIEWPORT_UNIT = /(?<![\w.#-])(-?(?:\d+\.?\d*|\.\d+))d(v(?:h|w|min|max))\b/gi;

const SUPPORTS_PARAMS = "not (height: 1dvh)";

const plugin = () => ({
  postcssPlugin: "viewport-unit-fallback",

  // OnceExit: collect first and insert afterwards, so the generated rules are
  // never themselves walked.
  OnceExit(root, { AtRule }) {
    const pending = [];

    root.walkRules((rule) => {
      const parent = rule.parent;
      if (parent && parent.type === "atrule" && parent.params === SUPPORTS_PARAMS) return;

      const fallbacks = [];
      rule.each((node) => {
        if (node.type !== "decl") return;
        const value = node.value.replace(DYNAMIC_VIEWPORT_UNIT, "$1$2");
        if (value !== node.value) fallbacks.push(node.clone({ value }));
      });

      if (fallbacks.length > 0) pending.push({ rule, fallbacks });
    });

    for (const { rule, fallbacks } of pending) {
      const shadow = rule.clone();
      shadow.removeAll();
      for (const declaration of fallbacks) shadow.append(declaration);

      const supports = new AtRule({ name: "supports", params: SUPPORTS_PARAMS });
      supports.append(shadow);
      rule.after(supports);
    }
  },
});

plugin.postcss = true;

module.exports = plugin;
