export const PRICE_RANGE = {
  max: 40_000_000,
  step: 500_000,
  fineStep: 100_000,
  lowerKey: "min_price",
  higherKey: "max_price",
} as const;

export const AREA_RANGE = {
  max: 1000,
  step: 50,
  lowerKey: "min_building_area",
  higherKey: "max_building_area",
} as const;

export const COMMISSION_RANGE = {
  max: 50,
  step: 5,
  lowerKey: "min_commission",
  higherKey: "max_commission",
} as const;
