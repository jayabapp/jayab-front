import { p2e } from "./NumberConverter";

const formatHour = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "";
  const raw = p2e(`${value}`).trim();
  const [hourPart, minutePart] = raw.split(":");
  const hour = Number(hourPart);
  if (!Number.isFinite(hour)) return raw;
  const minutes = minutePart ? minutePart.padStart(2, "0").slice(0, 2) : "00";
  return `${`${hour}`.padStart(2, "0")}:${minutes}`;
};

export default formatHour;
