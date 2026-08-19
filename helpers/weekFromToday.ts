import { WeekDays } from "@/utils/constantss";

const TIME_ZONE = "Asia/Tehran";
const SHORT_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Availability is priced per Tehran date on the backend, so the week strip has
 * to start on the Tehran day rather than the day the visitor's device happens
 * to be on. Pinning the zone also means a Server Component and the browser
 * hydrating it produce the same markup.
 */
const todayInTehran = () => {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
  }).format(new Date());
  const index = SHORT_NAMES.indexOf(name);
  return index === -1 ? new Date().getDay() : index;
};

export const weekFromToday = () => {
  const today = todayInTehran();
  return Array.from({ length: 7 }, (_, i) =>
    WeekDays.find((e) => e.id === (today + i) % 7),
  );
};

export default weekFromToday;
