export type { PropertyContactIInfDto } from "@/api_services/property/property.interface";
export type { ReserveListDto } from "@/api_services/reserve/reserve.interface";

import type { ImageDto } from "@/api_services/auth/auth.interface";
import type { PropertyContactIInfDto } from "@/api_services/property/property.interface";
import type { PropertyDetailsView } from "@/types/features/properties";
import type { Dispatch, SetStateAction } from "react";

export type PropertyContactAction = "" | "call" | "sms";

export type PropertyContactModalProps = {
  onHide: () => void | null;
  propertySlug?: string;
  show: boolean;
  type: PropertyContactAction;
};

export type PropertyContactRowProps = {
  data: PropertyContactIInfDto;
  image?: ImageDto;
  isPropertyExpired?: boolean;
  onHide: () => void | null;
  propertySlug?: string;
  type: PropertyContactAction;
};

export type PropertyReserveModalProps = {
  property: PropertyDetailsView;
  setShow: Dispatch<SetStateAction<boolean>>;
  show: boolean;
};

export type ReserveRequestModalProps = {
  count: number | string;
  endDate: string;
  onHide: () => void | null;
  property: PropertyDetailsView;
  setShowEdit: (show: boolean) => void | null;
  show: boolean;
  startDate: string;
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
