import { formatCalendarCellPriceFor } from "./intl/number";

import { type DisplayLocale } from "./intl/digits";

const formatCalendarCellPrice = (
  value?: number | null,
  locale: DisplayLocale = "fa",
) => formatCalendarCellPriceFor(value, locale);

export default formatCalendarCellPrice;
