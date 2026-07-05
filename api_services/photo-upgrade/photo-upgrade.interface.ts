import { ImageDto } from "../auth/auth.interface";

export interface PhotoUpgradeStatusDto {
  id: number;
  title: string;
  hex: string;
}

export interface PhotoUpgradePropertyDto {
  id: number;
  title: string;
  code: string;
  feature_image?: ImageDto | null;
}

export interface PhotoUpgradeRequestItemDto {
  id: number;
  request_id?: number;
  property_photo_upgrade_request_id?: number;
  attachment_id?: number | null;
  original_attachment_id?: number | null;
  status?: PhotoUpgradeStatusDto | null;
  attachment?: ImageDto | null;
  image?: ImageDto | null;
  new_attachment?: ImageDto | null;
  optimized_attachment?: ImageDto | null;
  original_attachment?: ImageDto | null;
  old_attachment?: ImageDto | null;
  previous_attachment?: ImageDto | null;
  created_at?: string;
  updated_at?: string;
}

export interface PhotoUpgradeRequestDto {
  id: number;
  property_id: number;
  owner_id: number;
  subscription_id: number;
  payment_id: number;
  status: PhotoUpgradeStatusDto;
  image_count: number;
  price_per_image: number;
  total_amount: number;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  property?: PhotoUpgradePropertyDto | null;
  items?: PhotoUpgradeRequestItemDto[];
  _count?: {
    items?: number;
  };
}
