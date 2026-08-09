import { WeekDays } from "@/utils/constantss";

export const weekFromToday = () => {
  const today = new Date().getDay();
  return Array.from({ length: 7 }, (_, i) =>
    WeekDays.find((e) => e.id === (today + i) % 7),
  );
};

export default weekFromToday;
