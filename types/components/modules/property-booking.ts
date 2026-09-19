import type { PropertyDetailsView } from "@/types/features/properties";
import type { PropertyQuoteDto } from "@/api_services/property/property.interface";
import type { SinglePropDto } from "@/api_services/property/property.interface";
import type { DayRangeState } from "@features/reservations/lib/stay-range";
import type { StayRange } from "@features/reservations/lib/stay-range";
import type { ReactNode } from "react";

export type StayMonthRef = { month: number; year: number };
export type StayCompleteRange = { end: Date; start: Date };

export type BookingActionsVariant = "bar" | "card" | "sheet";

export type BookingActionsContext = {
  endDate: Date;
  guests: number;
  nights: number;
  startDate: Date;
  total: number;
  onEdit: () => void;
  variant: BookingActionsVariant;
};

export type BookingRenderActions = (
  context: BookingActionsContext,
) => ReactNode;

export type BookingPanelProps = {
  variant: "card" | "sheet";
  property: PropertyDetailsView;
  renderActions?: BookingRenderActions;
};

export type BookingBottomBarProps = {
  property: PropertyDetailsView;
  renderActions?: BookingRenderActions;
};

export type BookingEditSheetProps = {
  show: boolean;
  onHide: () => void;
  property: PropertyDetailsView;
  renderActions?: BookingRenderActions;
};

export type StayDayCellProps = {
  day: number;
  label: string;
  price?: string;
  isPeak?: boolean;
  tooltip?: string;
  disabled: boolean;
  isReserved: boolean;
  discounted?: boolean;
  onSelect: () => void;
  state: DayRangeState;
};

export type StayCalendarGridProps = {
  lazy?: boolean;
  columns?: 1 | 2;
  range: StayRange;
  propertyId: number;
  months: StayMonthRef[];
  reserved: ReadonlySet<string>;
  onChange: (range: StayRange) => void;
};

export type StayMonthProps = {
  today: Date;
  lazy: boolean;
  range: StayRange;
  propertyId: number;
  reserved: ReadonlySet<string>;
  onSelectDay: (date: Date) => void;
} & StayMonthRef;

export type StayDatePickerProps = {
  initial: StayRange;
  propertyId: number;
  onClose: () => void;
  reserved: ReadonlySet<string>;
  onConfirm: (range: StayCompleteRange) => void;
};

export type StayDateSheetProps = StayDatePickerProps & { show: boolean };

export type StayDateFieldsProps = {
  end?: Date | null;
  disabled?: boolean;
  expanded?: boolean;
  start?: Date | null;
  activeField?: "checkIn" | "checkOut" | null;
  onOpen: (field: "checkIn" | "checkOut") => void;
};

export type GuestStepperProps = {
  id?: string;
  max: number;
  std: number;
  value: number | null;
  extraGuestFee?: number;
  onChange: (value: number | null) => void;
};

export type GuestSheetProps = {
  max: number;
  std: number;
  show: boolean;
  summary?: string;
  onHide: () => void;
  value: number | null;
  onConfirm: () => void;
  extraGuestFee?: number;
  onChange: (value: number | null) => void;
};

export type PriceSummaryProps = {
  isRefreshing?: boolean;
  quote: PropertyQuoteDto;
};

export type PriceDetailsProps = { quote: PropertyQuoteDto };

export type RateTableProps = {
  cleaningFee?: number;
  stdCapacity?: number;
  extraGuestFee?: number;
  dailyPrice?: SinglePropDto["daily_price"];
};

export type StepCtaProps = {
  canClear: boolean;
  onClear: () => void;
  onPrimary: () => void;
  step: "PICK_DATES" | "PICK_GUESTS";
};

export type StayCalendarSectionProps = {
  propertyId: number;
};

export type FullScreenSheetProps = {
  show: boolean;
  title: string;
  footer?: ReactNode;
  onHide: () => void;
  children: ReactNode;
};
