import type { JalaliCalendarDayData } from "@/types/components/elements/jalali-calendar";
import type { Dispatch } from "react";

export type SearchDatePoint = {
  day: string | number | undefined;
  year: string | number | undefined;
  month: string | number | undefined;
};

export type SearchSelectedDateRange = {
  endDate: SearchDatePoint | null;
  startDate: SearchDatePoint | null;
};

export type SearchDateRangeDayProps = {
  year?: string;
  month?: string;
  freeDaysOfMonth?: boolean;
  showTimeOfTheDay?: boolean;
  data?: JalaliCalendarDayData;
  selectedDayIds?: SearchSelectedDateRange;
  onSelect?: (value: any | null) => void | null;
  today?: { day: number; month: string; year: string };
};

export type SearchDateRangeDayPickerProps = {
  year: string;
  month: string;
  Loading: boolean;
  date: number | string;
  active_days?: number[];
  freeDaysOfMonth?: boolean;
  callenderData?: JalaliCalendarDayData[];
  setSelectedDay?: (value: any | null) => void | null;
  selectedDates?: { startDate: string | null; endDate: string | null };
  options?: { valueType: "persian" | "global"; showTimeOfTheDay?: boolean };
};

export type SearchDateRangePickerProps = {
  prefix?: string;
  freeDaysOfMonth?: boolean;
  setSelectedDay?: (value: any | null) => void | null;
  selectedDates?: { startDate: string | null; endDate: string | null };
  options?: { valueType: "persian" | "global"; showTimeOfTheDay?: boolean };
};

export type UpdateSearchDateRangeInput = {
  date: string;
  cb?: () => void | null;
  setState: Dispatch<any>;
  state?: { checkin?: string | null; checkout?: string | null };
};
