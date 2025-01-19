import { ImageDto } from "../auth/auth.interface";
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

export interface AdvisorPageListDto {
  id: number | null;
  created_at: Date | string;
  cities: string[];
  user: User | null;
  work_history_in_month: number;
  owners_satisfaction: number;
  users_satisfaction: number;
}

export interface City {
  title: string;
}

export interface User {
  full_name: string;
  referral_code: string;
  profile_image: ImageDto;
}

export interface MyUserRateDto {
  id: number;
  user_id: number;
  advisor_id: number;
  advisor_behavior: number;
  advisor_responsibility: number;
  response_speed_and_followup: number;
  created_at: Date;
  updated_at: Date;
}

export interface SingleAdvisorDto {
  id: number;
  created_at: Date;
  users_satisfaction: null;
  owners_satisfaction: null;
  response_speed_and_followup: null;
  advisor_behavior: null;
  advisor_responsibility: null;
  cities: string[];
  user: User;
  work_history_in_month: number;
  can_user_add_rate: boolean;
  user_rate: MyUserRateDto;
}

export interface User {
  id: number;
  full_name: string;
  mobile_number: string;
  referral_code: string;
  profile_image: ImageDto;
}

export interface AddRateDto {
  advisor_behavior: number | string | null;
  advisor_responsibility: number | string | null;
  response_speed_and_followup: number | string | null;
}
