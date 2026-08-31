import type {
  AdvisorFormValues,
  AdvisorPageListDto,
  AdvisorProfileDto,
  AdvisorSubscriptionKind,
  PropertySubsDto,
  SingleAdvisorDto,
} from "@/types/features/advisors";
import type { DeviceInfo } from "@/helpers/device.detector";
import type { Dispatch, SetStateAction } from "react";

export type {
  AdvisorFormValues,
  AdvisorPageListDto,
  AdvisorProfileDto,
  AdvisorSubscriptionKind,
  PropertySubsDto,
  SingleAdvisorDto,
};

export type AdvisorListProps = {
  devices: DeviceInfo;
};

export type AdvisorCardProps = {
  isSingle?: boolean;
  onSelect?: () => void;
  advisor: AdvisorPageListDto;
};

export type AdvisorGaugeProps = {
  value: number;
  title?: string;
  label?: string;
  textSize: string;
  pathColor: string;
  textColor: string;
  labelClass?: string;
  titleClass?: string;
  containerClass?: string;
};

export type AdvisorSearchBarProps = {
  cityTitle: string;
  onCityTitleChange: (title: string) => void;
  onFilter: (value: number | string, key: string) => void;
};

export type AdvisorRegisterCtaProps = {
  onRegister: () => void;
  isSpecialAdvisor?: boolean;
  advisorId?: number | string | null;
};

export type AdvisorDetailsModalProps = {
  show: boolean;
  onHide: () => void;
  advisor: AdvisorPageListDto | null;
};

export type AdvisorRatingSheetProps = {
  show: boolean;
  onHide: () => void;
  advisor?: SingleAdvisorDto | null;
};

export type AdvisorPlanCardProps = {
  plan: PropertySubsDto;
  onRequireRegistration: () => void;
  subscriptionKind: AdvisorSubscriptionKind | null;
};

export type AdvisorSubscriptionStatusProps = {
  onCancel: () => void;
  plans?: PropertySubsDto[];
  profile: AdvisorProfileDto;
};

export type AdvisorProfileFormProps = {
  subscriptionKey: string;
};

export type AdvisorFieldsProps = {
  values: AdvisorFormValues;
  setValues: Dispatch<SetStateAction<AdvisorFormValues>>;
};
