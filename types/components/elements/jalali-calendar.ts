import type { Dispatch, SetStateAction } from "react";

export type JalaliCalendarDayData = {
  date?: Date;
  day?: number;
  note?: string;
  price?: number;
  is_peak?: boolean;
  isActive?: boolean;
  id?: number | string;
  year?: number | string;
  month?: number | string;
  discounted_price?: number;
  has_memo?: number | string;
  advisor_commission?: number;
  is_reserved?: number | string | boolean;
};

export type JalaliCalendarValueOptions = {
  showTimeOfTheDay?: boolean;
  disableDaySelect?: boolean;
  valueType?: "persian" | "global";
};

export type JalaliDatePickerProps = {
  color?: string;
  prefix?: string;
  freeDaysOfMonth?: boolean;
  smallerDateFonts?: boolean;
  selectedDate?: string | number;
  options?: JalaliCalendarValueOptions;
  setSelectedDay?: (value: any | null) => void | null;
};

export type AvailabilityCalendarProps = {
  prefix?: string;
  multiSelect?: boolean;
  active_days?: number[];
  selectedDays?: string[];
  disablePrevMonths?: boolean;
  selectedDate?: string | number;
  onToggleDay?: (date: string) => void;
  options?: JalaliCalendarValueOptions;
  callenderData?: JalaliCalendarDayData[];
  setSelectedDay?: (value: any | null) => void | null;
  setChosenDateState?: (value: any | null) => void | null;
};

export type JalaliDayPickerProps = {
  year: string;
  month: string;
  Loading: boolean;
  date: number | string;
  multiSelect?: boolean;
  active_days?: number[];
  selectedDays?: string[];
  freeDaysOfMonth?: boolean;
  smallerDateFonts?: boolean;
  selectedDate?: string | number;
  onToggleDay?: (date: string) => void;
  options?: JalaliCalendarValueOptions;
  callenderData?: JalaliCalendarDayData[];
  setSelectedDay?: (value: any | null) => void | null;
};

export type JalaliDayProps = {
  year?: string;
  month?: string;
  disableClick?: boolean;
  isMultiSelected?: boolean;
  freeDaysOfMonth?: boolean;
  showTimeOfTheDay?: boolean;
  smallerDateFonts?: boolean;
  data?: JalaliCalendarDayData;
  onSelect?: (value: any | null) => void | null;
  today?: { day: number; month: string; year: string };
  selectedDayId?: { day: number; month: string; year: string };
};

export type JalaliYearMonthPickerProps = {
  date: string;
  year: string;
  month: string;
  prefix?: string;
  disablePrevMonths?: boolean;
  setDate: Dispatch<SetStateAction<string | number>>;
};
