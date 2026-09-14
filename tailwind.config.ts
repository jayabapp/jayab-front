import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import { colors } from "./theme/colors";

// Touch devices report `:hover` on tap and only clear it on the next tap
// elsewhere, so every `hover:` utility below reads as a stuck, flickery
// "touch effect" with no real pointer behind it. Gating hover variants behind
// `(hover: hover)` — true everywhere a mouse or trackpad is present, false on
// touch-only devices — removes that without hand-editing every component.
const hoverOnlyWithPointer = plugin(({ addVariant }) => {
  addVariant("hover", "@media (hover: hover) { &:hover }");
  addVariant("group-hover", "@media (hover: hover) { :merge(.group):hover & }");
  addVariant("peer-hover", "@media (hover: hover) { :merge(.peer):hover ~ & }");
});

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // single component styles
    // Shared class-name constants (e.g. utils/constantss.ts) live here too —
    // without this, an arbitrary-value utility built there never gets seen by
    // the scanner and silently never makes it into the compiled CSS.
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: { ...defaultTheme.screens },
    extend: {
      borderColor: {
        DEFAULT: colors.neutral[200],
      },
      scale: {
        102: "1.02",
        98: "0.98",
      },
      zIndex: { 1: "1", 2: "2", 5: "5" },
      fontSize: {
        xxs: "0.625rem",
      },
      colors,
      borderRadius: {
        28: "1.75rem",
        20: "1.25rem",
        10: "0.75rem",
      },
      boxShadow: {
        card: "0px 0px 7px 1px rgb(0 ,0 ,0,0.1)",
        // Glass tokens: a wide, brand-tinted drop shadow reads as depth over the
        // blurred auth backdrop, where a neutral black shadow just looks dirty
        // against the blue mesh.
        glass: "0 24px 60px -24px rgb(21 60 105 / 0.45), 0 2px 6px -2px rgb(21 60 105 / 0.10)",
        "glass-sm": "0 12px 30px -16px rgb(21 60 105 / 0.45)",
        "glass-btn": "0 14px 30px -12px rgb(31 107 201 / 0.65)",
      },
      spacing: {
        "1/5": "20%",
        "12.5%": "12.5%",
        25: "6.25rem",
      },
      height: {
        "6.5": "1.625rem",
      },
    },
  },
  plugins: [hoverOnlyWithPointer],
  transitionProperty: {
    height: "height",
    width: "width",
    spacing: "margin, padding",
  },
  variants: {
    extend: {
      display: ["responsive", "group-hover", "focus-within", "hover", "focus"],
    },
  },
} satisfies Config;
