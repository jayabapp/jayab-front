import { ReserveUserAction } from "@/enum/reserve.enum";
import { PropertyListDto, Status } from "../property/property.interface";

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
  is_chat_enabled: boolean;
  user_id: number;
  is_subscription_expired: boolean;
  check_in: Date;
  check_out: Date;
  guests_count: string;
  guest_mobile: string;
  user_action: ReserveUserAction;
  owner_seen_at: null;
  canceled_at: null;
  expired_at: null;
  description: null;
  owner_clicked_guest_mobile: number;
  created_at: Date;
  updated_at: Date;
  property: PropertyListDto;
  ttl_seconds: number;
}
