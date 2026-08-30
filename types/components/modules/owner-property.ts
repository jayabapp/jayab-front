import type {
  AssistantSendDto,
  FacilitiesValuesDto,
  GetPropBadgeDto,
  OwnerCallendarItemDto,
  PricingPropertySendDto,
  PropertyDraftStep,
  PropertyEnvironmentValues,
  PropertyInitialsValues,
  PropertySubsDto,
  PropertyTermsSendDto,
  RoomInfosDto,
  SingleOwnerPropertyDto,
} from "@/types/features/owner-property";
import type { ReactNode } from "react";

export type {
  AssistantSendDto,
  FacilitiesValuesDto,
  OwnerCallendarItemDto,
  PricingPropertySendDto,
  PropertyDraftStep,
  PropertyEnvironmentValues,
  PropertyInitialsValues,
  PropertySubsDto,
  PropertyTermsSendDto,
  RoomInfosDto,
  SingleOwnerPropertyDto,
};

export type OwnerPropertyRouteProps = {
  propertyId: string;
};

export type OwnerPropertyViewProps = {
  property: SingleOwnerPropertyDto;
};

export type OwnerActionRowProps = {
  href?: string;
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  onClick?: () => void;
  tone?: "brand" | "danger" | "default";
};

export type OwnerDaySelectionProps = {
  selectedDates: string[];
  property: SingleOwnerPropertyDto;
  selectedDaysData: OwnerCallendarItemDto[];
};

export type OwnerDayPriceModalProps = OwnerDaySelectionProps & {
  show: boolean;
  onHide: () => void;
};

export type OwnerSingleDayActionProps = {
  isDisabled?: boolean;
  day?: OwnerCallendarItemDto;
  property: SingleOwnerPropertyDto;
};

export type OwnerSingleDayModalProps = {
  show: boolean;
  onHide: () => void;
  day?: OwnerCallendarItemDto;
  property: SingleOwnerPropertyDto;
};

export type OwnerPriceRangeFieldProps = {
  max: number;
  min: number;
  step: number;
  title: string;
  value: number;
  setValue: (value: number) => void;
};

export type OwnerBadgeRequestModalProps = {
  show: boolean;
  onHide: () => void;
  badge?: GetPropBadgeDto | null;
  property: SingleOwnerPropertyDto;
};

export type OwnerCommissionModalProps = {
  show: boolean;
  onHide: () => void;
  property: SingleOwnerPropertyDto;
};

export type OwnerConfirmPromptProps = {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
};

export type OwnerPropertyStepFrameProps = {
  isPending: boolean;
  propertyId: string;
  children: ReactNode;
  isLoading?: boolean;
  submitTitle: string;
  headerClass?: string;
  onSubmit: () => void;
  containerClass?: string;
  step: PropertyDraftStep;
  skeleton?: "form" | "map" | "media";
};

export type PropertyInitialsFieldsProps = {
  status?: number;
  values: PropertyInitialsValues;
  onChange: (value: boolean | number | string | null, key: string) => void;
};

export type PropertyEnvironmentFieldsProps = {
  values: PropertyEnvironmentValues;
  onChange: (value: boolean | number | string | null, key: string) => void;
};

export type PropertyTermOptionProps = {
  desc: string;
  title: string;
  isChecked: boolean;
  onSelect: () => void;
};

export type TitledCounterProps = {
  title: string;
  disableInput?: boolean;
  value: number | string | null;
  onChange: (value: number) => void;
};

export type FieldCharacterCounterProps = {
  max: number;
  value: number | string;
  containerClass?: string;
};

export type PropertySuccessModalProps = {
  show: boolean;
  onConfirm: () => void;
};
