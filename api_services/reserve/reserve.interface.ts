import { ImageDto } from "../auth/auth.interface";
import { Status } from "../property/property.interface";

export interface CreateReserveDto {
  property_id: number;
  guests_count: string;
  check_in: string;
  check_out: string;
  user_action: number;
}

export interface ReserveListDto {
  id: number;
  property_id: number;
  status: Status;
  user_id: number;
  is_subscription_expired: boolean;
  check_in: Date;
  check_out: Date;
  guests_count: string;
  guest_mobile: string;
  user_action: number;
  owner_seen_at: null;
  canceled_at: null;
  expired_at: null;
  description: null;
  owner_clicked_guest_mobile: number;
  created_at: Date;
  updated_at: Date;
  property: Property;
  ttl_seconds: number;
}

export interface Property {
  title: string;
  slug: string;
  code: string;
  feature_image: ImageDto;
}
