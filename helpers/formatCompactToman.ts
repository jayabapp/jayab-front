import _STRINGS from "@/utils/LocalStrings";

const MILLION = 1000000;
const THOUSAND = 1000;

const DECIMAL_SEPARATOR = "٫";

const withOneDecimal = (value: number, unit: number) => {
  const rounded = Math.round((value / unit) * 10) / 10;
  const [whole, fraction] = `${rounded}`.split(".");
  return fraction ? `${whole}${DECIMAL_SEPARATOR}${fraction}` : whole;
};

const formatCompactToman = (value?: number | null) => {
  if (!value || value <= 0) return "";
  if (value >= MILLION)
    return `${withOneDecimal(value, MILLION)}${_STRINGS.TOMAN_MILLION_SHORT}`;
  if (value >= THOUSAND)
    return `${withOneDecimal(value, THOUSAND)}${_STRINGS.TOMAN_THOUSAND_SHORT}`;
  return `${value}`;
};

export default formatCompactToman;
