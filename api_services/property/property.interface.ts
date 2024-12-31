import { ImageDto } from "../auth/auth.interface";

export interface PropertyTypesDTP {
  id: number;
  title: string;
}

export interface CreatePropertyStepOneDto {
  property_type: number | string | null;
  title: number | string | null;
  land_area: number | string | null;
  building_area: number | string | null;
  floors: number | string | null;
  floor: number | string | null;
  unit_per_floor: number | string | null;
  construction_year: number | string | null;
  building_direction: number | string | null;
  ownership: number | string | null;
  province_id: number | string | null;
  city_id: number | string | null;
  // region_id: number | string | null;
  address: number | string | null;
  is_chat_enabled: boolean | null;
  is_location_visible: boolean | null;
}

export interface PropInitDto {
  id: number | null;
  code: string;
  owner_id: number;
  title: string | number;
  land_area: string | number;
  building_area: string | number;
  floors: string | number;
  building_direction: string | number;
  unit_per_floor: string | number;
  floor: string | number;
  construction_year: string | number;
  region_id: string | number;
  province_id: string | number;
  city_id: string | number;
  address: string | number;
  lat: string | number;
  lng: string | number;
  feature_image_id: string | number;
  ownership: string | number;
  property_type: string | number;
  video_id: string | number;
  is_chat_enabled: boolean;
  is_location_visible: boolean;
  status: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: string | number;
  property_options: PropertyOptionsDto[];
  attachments: ImageDto[];
  feature_image: ImageDto;
  description: DecriptionsDto;
  bedrooms: ReturnBedroomsDto;
}

export interface PropertyOptionsDto {
  property_id: number;
  option_id: number;
  assigned_at: Date;
  option: Option;
}

export interface Option {
  id: number;
  title: string;
  description: null | string;
  group: string;
  sort: null;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}

export interface DecriptionsDto {
  id: number;
  property_id: number;
  property_dscr: null;
  pattern_dscr: string;
  distance_dscr: string;
  facility_dscr: null;
  guest_dscr: null;
  pet_dscr: null;
  party_dscr: null;
  doc_dscr: null;
  other_dscr: null;
  ad_dscr: null;
  created_at: Date;
  updated_at: Date;
}

export interface RoomInfosDto {
  bedrooms: number[];
  additional_bed: number;
  master_room: number;
  sofa_bed: number;
  wc: number;
  wc_ir: number;
  bathroom_master: number;
  bathroom_general: number;
  bathroom_in_wc: number;
  bathroom_tub: number;
}

export interface ReturnBedroomsDto {
  id: number;
  property_id: number;
  bedrooms: number[];
  additional_bed: number;
  master_room: number;
  sofa_bed: number;
  wc: number;
  wc_ir: number;
  bathroom_master: number;
  bathroom_general: number;
  bathroom_in_wc: number;
  bathroom_tub: number;
  total_bedrooms: number;
  created_at: Date;
  updated_at: Date;
}

export interface FacilitiesValuesDto {
  cool_heat: (string | number | null)[];
  welfare: (string | number | null)[];
  entertainment: (string | number | null)[];
  kitchen: (string | number | null)[];
  has_pool: boolean;
  pool_type: (string | number | null)[];
  facility_dscr: string | number | null;
}

export enum PropertyOptionGroup {
  PROPERTY_TYPE = "PROPERTY_TYPE", //نوع ملک
  OWNERSHIP = "OWNERSHIP", //نوع مالکیت
  PATTERN = "PATTERN", //بافت محیط
  ACCESS = "ACCESS", // مسیر دسترسی
  NEIGHBORHOOD = "NEIGHBORHOOD", //همسایگی
  ENTERTAINMENT = "ENTERTAINMENT", //امکانات تفریحی
  POOL_TYPE = "POOL_TYPE", //نوع استخر
  KITCHEN = "KITCHEN", //امکانات آشپزخانه
  COOL_HEAT = "COOL_HEAT", //امکانات سرمایشی و گرمایشی
  WELFARE = "WELFARE", //رفاهی
  GUEST_TYPE = "GUEST_TYPE", //نوع مهمان
  PET = "PET", // شرایط ورود حیوان خانگی
  PARTY = "PARTY", // شرایط برگزاری مراسم
  BUILDING_DIRECTION = "BUILDING_DIRECTION", //جهت ساختمان
}
