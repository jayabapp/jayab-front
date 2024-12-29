import type { Config } from "tailwindcss";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // single component styles
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "#DCDCDC",
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
          100: "#fff",
          200: "#fff",
          300: "#fff",
          400: "#fff",
          500: "#fff",
          600: "#fff",
          700: "#3886E5",
          800: "#fff",
          900: "#fff",
        },
        btnColor: {
          primary: "#3886E5",
          danger: "red",
          light: "#dcdcdcbd",
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
    },
    darkMode: "class",
  },
  plugins: [],
} satisfies Config;
