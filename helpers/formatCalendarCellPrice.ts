// Calendar-cell-only price format (FEATURE.md §11.3): plain toman/1000, no
// unit suffix — 3,100,000 -> "3100". Every other price display (summaries,
// cards, breakdowns) keeps the full amount with "تومان" via `formatToman`.
const formatCalendarCellPrice = (value?: number | null) => {
  if (!value || value <= 0) return "";
  return `${Math.round(value / 1000)}`;
};

export default formatCalendarCellPrice;
