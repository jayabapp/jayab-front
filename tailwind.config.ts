import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // single component styles
  ],
  theme: {
    screens: { ...defaultTheme.screens },
    extend: {
      borderColor: {
        DEFAULT: "#E4E5E7",
      },
      scale: {
        102: "1.02",
        98: "0.98",
      },
      zIndex: { 1: "1", 2: "2", 5: "5" },
      fontSize: {
        xxs: "0.625rem",
      },
      colors: {
        primary: {
          50: "#F3F7FF",
          100: "#E8F1FC",
          150: "#FF2D55",
          200: "#E4E5E7",
          250: "#ADB1B8",
          300: "#F9FAFC",
          350: "#FF9500",
          400: "#D2E4F9",
          450: "#F1F2F3",
          500: "#F0F7FF",
          600: "#34C759",
          700: "#3886E5",
          800: "#858A95",
          900: "#F53E4F",
          1000: "#E0E5EC",
          1100: "#FD3542",
          1200: "#A5C8F3",
          black: "#010D25",
        },
        btnColor: {
          primary: "#3886E5",
          danger: "#F53E4F",
          light: "#dcdcdcbd",
          themeLight: "#E8F1FC",
        },
      },
      borderRadius: {
        20: "1.25rem",
        10: "0.75rem",
      },
      boxShadow: {
        card: "0px 0px 7px 1px rgb(0 ,0 ,0,0.1)",
        cardDark: "0px 0px 13px 1px rgb(15 ,23 ,42,0.6)",
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
    darkMode: "class",
  },
  plugins: [],
  transitionProperty: {
    height: "height",
    width: "width",
    spacing: "margin, padding",
  },
  darkMode: "class",
  variants: {
    extend: {
      display: ["responsive", "group-hover", "focus-within", "hover", "focus"],
    },
  },
} satisfies Config;
