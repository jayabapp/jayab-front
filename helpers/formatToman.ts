import { type DisplayLocale } from "./intl/digits";
import { formatTomanAmount } from "./intl/number";

const formatToman = (
  value: number | string | null | undefined,
  unit: string,
  locale: DisplayLocale = "fa",
) => formatTomanAmount(value, unit, locale);

export default formatToman;
