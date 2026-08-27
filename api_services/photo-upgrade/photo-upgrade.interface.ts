import { ImageDto } from "../auth/auth.interface";

export interface PhotoUpgradeStatusDto {
  id: number;
  hex: string;
  title: string;
}

export interface PhotoUpgradePropertyDto {
  id: number;
  code: string;
  title: string;
  feature_image?: ImageDto | null;
}

export interface PhotoUpgradeRequestItemDto {
  id: number;
  status: number;
  created_at: string;
  request_id: number;
  updated_at: string;
  is_edited?: boolean;
  attachment: ImageDto;
  attachment_id: number;
  status_title?: string;
  edited_at?: string | null;
  edited_by_admin_id?: number | null;
  current_attachment?: ImageDto | null;
  original_attachment?: ImageDto | null;
  previous_attachment?: ImageDto | null;
  original_attachment_id?: number | null;
}

export interface PhotoUpgradeRequestDto {
  id: number;
  owner_id: number;
  created_at: string;
  updated_at: string;
  property_id: number;
  image_count: number;
  total_amount: number;
  price_per_image: number;
  payment_id: number | null;
  completed_at?: string | null;
  status: PhotoUpgradeStatusDto;
  subscription_id: number | null;
  items?: PhotoUpgradeRequestItemDto[];
  property?: PhotoUpgradePropertyDto | null;
  subscription?: { id: number; title: string; status: number } | null;
  _count?: {
    items?: number;
  };
}
