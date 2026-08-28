export const colors = {
  brand: {
    50: "#F0F6FE",
    100: "#DCEAFD",
    200: "#BBD6FA",
    300: "#8FBBF5",
    400: "#5C9CEE",
    500: "#3886E5",
    600: "#1F6BC9",
    700: "#1856A3",
    800: "#164780",
    900: "#153C69",
  },
  neutral: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#8E949E",
    500: "#6B7280",
    600: "#4A505C",
    800: "#1F2937",
    900: "#0B1524",
  },
  success: { 50: "#ECFDF3", 500: "#1A9E4B", 600: "#15803D" },
  warning: { 50: "#FFF7ED", 500: "#D97706", 600: "#B45309" },
  danger: { 50: "#FEF2F2", 500: "#DC2626", 600: "#C11F1F" },
} as const;

export type ColorPalette = typeof colors;
