import type { ReserveListDto } from "@/types/features/reservations";

export type { ReserveListDto };

export type ReservationContactChannel = "" | "call" | "sms";

export type ReservationCardProps = {
  isOwner?: boolean;
  reservation: ReserveListDto;
  onCancel?: (reservation: ReserveListDto) => void;
  onContactRequest?: (channel: ReservationContactChannel) => void;
};

export type ReservationViewProps = {
  isOwner?: boolean;
  reservation: ReserveListDto;
};

export type ReservationCountdownProps = {
  minutes: string;
  seconds: string;
};

export type ReservationStatusBarProps = {
  isOwner?: boolean;
  onCancel?: () => void;
  onCallGuest?: () => void;
  reservation: ReserveListDto;
  isRequestingContact?: boolean;
};

export type ReservationGuestContactProps = {
  isExpired?: boolean;
  isChatPending?: boolean;
  onStartChat?: () => void;
  onContactRequest?: (channel: ReservationContactChannel) => void;
};

export type OwnerReservationListProps = {
  autoRefresh?: boolean;
};
