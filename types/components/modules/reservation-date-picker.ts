import type { Dispatch, SetStateAction } from "react";

export type ReservationDayData = {
  year?: string;
  price?: number;
  month?: string;
  is_peak?: boolean;
  isActive?: boolean;
  id?: number | string;
  discounted_price?: number;
  has_memo?: number | string;
  is_reserved?: number | string | boolean;
};

export type ReservationDateSpan = { start: Date | null; end: Date | null };

export type ReservationCalendarDay = {
  id: number;
  year: string;
  month: string;
  price?: number;
  is_peak?: boolean;
  isActive?: boolean;
  has_memo?: boolean;
  is_reserved?: boolean;
  discounted_price?: number;
};

export type ReservationSelectedDay = {
  day: number;
  month: string;
  year: string;
};

export type ReservationDayProps = {
  year?: string;
  month?: string;
  maxSpanLength?: number;
  forbiden_dates?: Date[];
  freeDaysOfMonth?: boolean;
  showTimeOfTheDay?: boolean;
  smallerDateFonts?: boolean;
  dateSpan?: ReservationDateSpan;
  data?: ReservationDayData | any;
  today?: { day: number; month: string; year: string };
  setDateSpan?: Dispatch<SetStateAction<ReservationDateSpan>>;
  selectedDayId?: { day: number; month: string; year: string };
  onSelect?: (value: ReservationDayData | null | any) => void | null;
};

export type ReservationDayPickerProps = {
  year: string;
  month: string;
  Loading?: boolean;
  callenderData?: any[];
  date: number | string;
  active_days?: number[];
  forbiden_dates?: Date[];
  freeDaysOfMonth?: boolean;
  smallerDateFonts?: boolean;
  dateSpan?: ReservationDateSpan;
  selectedDate?: string | number;
  setSelectedDay?: (value: any | null) => void | null;
  setDateSpan?: Dispatch<SetStateAction<ReservationDateSpan>>;
  options?: {
    valueType?: "persian" | "global";
    showTimeOfTheDay?: boolean;
    maxSpanLength?: number;
  };
};

export type ReservationCalendarProps = {
  prefix?: string;
  forbiden_dates?: Date[];
  freeDaysOfMonth?: boolean;
  smallerDateFonts?: boolean;
  startDate?: string | number;
  disableMonthChange?: boolean;
  dateSpan?: ReservationDateSpan;
  selectedDate?: string | number;
  setSelectedDay?: (value: any | null) => void | null;
  setDateSpan?: Dispatch<SetStateAction<ReservationDateSpan>>;
  options?: {
    valueType?: "persian" | "global";
    showTimeOfTheDay?: boolean;
    maxSpanLength?: number;
  };
};

export type ReservationMonthPickerProps = {
  date: string;
  year: string;
  month: string;
  prefix?: string;
  setDate?: (value: any | null) => void | null;
};

export type TReservationDateProps = {
  show: boolean;
  startDate?: Date;
  forbiden_dates?: Date[];
  onHide: () => void | null;
  onConfirm: (e: any) => void | null;
  defaultSpanDates?: { start?: Date; end?: Date };
};

export type TReservationDatePickerProps = {
  dates:
    | {
        start?: any;
        end?: any;
      }
    | undefined;
  setDates: Dispatch<
    SetStateAction<
      | {
          start?: any;
          end?: any;
        }
      | undefined
    >
  >;
  endTitle?: string;
  startTitle?: string;
  forbiden_dates?: Date[];
};
