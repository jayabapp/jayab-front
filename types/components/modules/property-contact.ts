export type { PropertyContactIInfDto } from "@/api_services/property/property.interface";
export type { ReserveListDto } from "@/api_services/reserve/reserve.interface";

import type { BookingActionsContext } from "@/types/components/modules/property-booking";
import type { PropertyContactIInfDto } from "@/api_services/property/property.interface";
import type { ContactTrip } from "@features/reservations/lib/contact-prefill";
import type { PropertyDetailsView } from "@/types/features/properties";
import type { IconName } from "@/types/components/elements/icon";
import type { ImageDto } from "@/api_services/auth/auth.interface";
import type { ReactNode } from "react";

export type PropertyContactAction = "" | "call" | "sms";
export type ContactFlowAction = "call" | "chat" | "reserve" | "sms";

/** The stay a contact action is about: dates, guests and the quoted price. */
export type ContactStay = Pick<
  BookingActionsContext,
  "endDate" | "guests" | "startDate"
> & {
  nights?: number;
  onEdit?: () => void;
  total?: number;
};

export type ContactFlowValue = {
  isChatPending: boolean;
  start: (action: ContactFlowAction, stay: ContactStay) => void;
};

export type ContactFlowProps = {
  children: ReactNode;
  property: PropertyDetailsView;
};

export type ContactActionsProps = {
  context: BookingActionsContext;
  property: PropertyDetailsView;
};

export type PropertyContactModalProps = {
  onHide: () => void | null;
  propertySlug?: string;
  show: boolean;
  trip?: ContactTrip;
  type: PropertyContactAction;
};

export type PropertyContactRowProps = {
  data: PropertyContactIInfDto;
  image?: ImageDto;
  isPropertyExpired?: boolean;
  onHide: () => void | null;
  propertySlug?: string;
  smsBody?: string;
  type: PropertyContactAction;
};

export type ReserveConfirmSheetProps = {
  onCall: () => void;
  onChat?: () => void;
  onHide: () => void;
  property: PropertyDetailsView;
  stay: ContactStay;
};

export type ReserveSuccessProps = {
  created: boolean;
  isChatPending?: boolean;
  isExpired: boolean;
  onCall: () => void;
  onChat?: () => void;
  onClose: () => void;
};

export type PropertyShareModalProps = {
  onHide: () => void | null;
  property: Pick<PropertyDetailsView, "id" | "title">;
  show: boolean;
};

export type ShareChannelRowProps = {
  cb: () => void | null;
  data: { icon?: string; id: string; title?: string };
  isChecked: boolean;
};

export type ContactActionItem = {
  action: ContactFlowAction;
  barLabel: string;
  icon: IconName;
  isPrimary?: boolean;
  label: string;
};

export type ContactSession = {
  action: "call" | "reserve" | "sms";
  nonce: number;
  stay: ContactStay;
};

export type ReserveFailure = { code?: string; message: string };
