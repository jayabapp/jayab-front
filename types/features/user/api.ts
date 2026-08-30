export type { OwnerProfileDto } from "@/api_services/auth/auth.interface";
export type { PropertyListDto } from "@/api_services/property/property.interface";
export type { SubPaymentsDto } from "@/api_services/user/user.interface";
export type { GetProfileDto } from "@/api_services/auth/auth.interface";

export type UserSubscriptionFilters = {
  perPage?: number;
  to?: Date | string;
  from?: Date | string;
};

export type ProfileMenuEntry = {
  route: string;
  title: string;
  imgSrc: string;
  id: number | string;
  badgeCounter?: number;
};
