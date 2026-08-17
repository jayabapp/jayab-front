import { ImageDto } from "../auth/auth.interface";
import { Status } from "../property/property.interface";

export interface CreateReserveDto {
  check_in: string;
  check_out: string;
  property_id: number;
  guests_count: string;
  user_action: number;
}

export interface ReserveListDto {
  id: number;
  check_in: Date;
  status: Status;
  user_id: number;
  check_out: Date;
  expired_at: null;
  created_at: Date;
  updated_at: Date;
  canceled_at: null;
  description: null;
  property: Property;
  property_id: number;
  owner_seen_at: null;
  ttl_seconds: number;
  guests_count: string;
  guest_mobile: number;
  show_counter: boolean;
  is_chat_enabled: boolean;
  is_subscription_expired: boolean;
  owner_clicked_guest_mobile: number;
  is_answer_deadline_passed: boolean;
}

export interface Property {
  id: number;
  code: string;
  owner_id: number;
  title: string;
  slug: string;
  slug_hash: null;
  land_area: number;
  building_area: number;
  floors: number;
  unit_per_floor: number;
  floor: number;
  construction_year: number;
  region_id: null;
  province_id: number;
  city_id: number;
  address: string;
  lat: number;
  lng: number;
  feature_image_id: number;
  video_id: null;
  is_chat_enabled: boolean;
  is_location_visible: boolean;
  has_pool: boolean;
  std_capacity: number;
  max_capacity: number;
  canceling_type: string;
  advisor_commission: number;
  check_in_hour: string;
  check_out_hour: string;
  subscription_expired_at: Date;
  promoted_at: Date;
  sort_order: string;
  contact_type: number;
  status: number;
  admin_descriptions: AdminDescription[];
  is_authorized: boolean;
  has_blue_tick: boolean;
  options_array: number[];
  favorite_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  feature_image: ImageDto;
  province: City;
  city: City;
  region: { title: string };
}

export interface AdminDescription {
  status: string;
  admin_id: number;
  created_at: Date;
  admin_name: string;
  admin_role: string;
  description: string;
}

export interface City {
  title: string;
}

export interface ActiveReserveDto {
  id: number;
  property_id: number;
  status: Status;
  user_id: number;
  check_in: Date;
  check_out: Date;
  guests_count: string;
  owner_seen_at: null;
  canceled_at: null;
  expired_at: null;
  description: null;
  owner_clicked_guest_mobile: number;
  created_at: Date;
  updated_at: Date;
  property: Property;
  ttl_seconds: number;
  is_chat_enabled: boolean;
}

export interface AdminDescription {
  status: string;
  admin_id: number;
  created_at: Date;
  admin_name: string;
  admin_role: string;
  description: string;
}

export interface City {
  title: string;
}
