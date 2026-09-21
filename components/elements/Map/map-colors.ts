import { colors } from "@/theme/colors";

export const MAP_COLORS = {
  areaFill: colors.brand[500],
  areaLine: colors.brand[600],
} as const;

export const APPROX_AREA_STYLE = {
  fillOpacity: 0.14,
  lineOpacity: 0.5,
  lineWidth: 2,
} as const;
