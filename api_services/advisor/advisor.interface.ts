import { Status } from "../property/property.interface";

export interface CreateAdvisorDto {
  full_name: number | string | null;
  address: number | string | null;
  national_code: number | string | null;
  tel: number | string | null;
  // area_code: number | string | null;
  cityIds: (number | string | null | any)[];
  is_special: boolean;
  profile_image_id?: number | null | string;
  national_card_image_id?: number | null | string;
  document_image_id?: number | null | string;
}

export interface AdvisorProfileDto {
  id: number;
  user: User;
  status: Status;
  admin_descriptions: any[];
  is_special: boolean;
  subscription_expired_at: null;
  national_code: null;
  created_at: Date;
}

export interface User {
  full_name: string;
}

export interface PayAdvisorPlanDto {
  plan_id: string | number;
  redirect_url: string;
  gateway: string;
}

export interface AdvisorListDto {
  id: number;
  national_code: string;
  tel: string;
  area_code: null;
  address: string;
  is_special: boolean;
  status: number;
  admin_descriptions: any[];
  sort_order: null;
  subscription_expired_at: null;
  national_card_image_id: number;
  document_image_id: number;
  created_at: Date;
  updated_at: Date;
}
