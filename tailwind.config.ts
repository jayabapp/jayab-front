import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import { colors } from "./theme/colors";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // single component styles
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
        20: "1.25rem",
        10: "0.75rem",
      },
      boxShadow: {
        card: "0px 0px 7px 1px rgb(0 ,0 ,0,0.1)",
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
  plugins: [],
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
