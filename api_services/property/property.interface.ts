import { ImageDto } from "../auth/auth.interface";

export interface ProvienceTypesDto {
  id: number;
  title: string;
  image: ImageDto;
  child: { id: number; title: string }[];
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
  canceling_type: "EASY" | "NORMAL" | "STRICT";
  contact_type: string | number;
  building_area: string | number;
  check_out_hour: string | number;

  check_in_hour: string | number;
  floors: string | number;
  building_direction: string | number;
  unit_per_floor: string | number;
  advisor_commission: string | number;
  floor: string | number;
  construction_year: string | number;
  region_id: string | number;
  province_id: string | number;
  std_capacity: string | number;
  max_capacity: string | number;
  city_id: string | number;
  address: string | number;
  lat: string | number;
  lng: string | number;
  feature_image_id: string | number;
  ownership: string | number;
  property_type: string | number;
  video_id: string | number;
  is_chat_enabled: boolean;
  has_pool: boolean;
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
  daily_price: DayliPriceDto;
  assistants: AssistantsDto[];
}

export interface AssistantsDto {
  assistant_full_name: string;
  assistant_mobile_number: string;
  owner_mobile_number: null;
}

export interface DayliPriceDto {
  id: number;
  property_id: number;
  normal: number;
  wednesday: number;
  thursday: number;
  friday: number;
  peak: number;
  cleaning: number;
  additional_person: number;
  today_offer: null;
  created_at: Date;
  updated_at: Date;
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

export interface PricingPropertySendDto {
  std_capacity: number | string | null;
  max_capacity: number | string | null;
  advisor_commission: number | string | null;
  normal: number | string | null;
  wednesday: number | string | null;
  thursday: number | string | null;
  friday: number | string | null;
  peak: number | string | null;
  cleaning: number | string | null;
  additional_person: number | string | null;
}

export interface AssistantSendDto {
  assistant_full_name?: string | number | null;
  assistant_mobile?: string | number | null;
  show_mobile_type?: string | number | null;
}

export interface PropertyTermsSendDto {
  guest_type: (string | number | null)[];
  pet: string | number | null;
  party: string | number | null;
  canceling_type: "EASY" | "NORMAL" | "STRICT";
  check_in_hour: string | number | null;
  check_out_hour: string | number | null;
  guest_dscr: string | number | null;
  pet_dscr: string | number | null;
  party_dscr: string | number | null;
  doc_dscr: string | number | null;
  other_dscr: string | number | null;
  ad_dscr: string | number | null;
  property_dscr: string | number | null;
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

export interface PropertySubsDto {
  id: number;
  title: string;
  price: number;
  price_with_discount: number;
  is_promote: boolean;
  is_special: boolean;
  description: string;
}

export interface PayPropertySubSendDto {
  subscription_id?: number;
  promote_id?: number;
  redirect_url: string;
  gateway: string;
}

export interface SinglePropDto {
  id: number;
  code: string;
  rent_type: "DAILY";
  title: string;
  property_descriptions: PropertyDescriptionsDto;
  slug: string;
  feature_image: ImageDto;
  attachments_count: number;
  images: ImageDto[];
  std_capacity: number;
  max_capacity: number;
  favorite_count: number;
  check_in_hour: number;
  check_out_hour: number;
  total_bedrooms: number;
  bedrooms: Bedrooms;
  has_pool: boolean;
  is_authorized: boolean;
  is_chat_enabled: boolean;
  province: string;
  city: string;
  advisor_commission: number;
  today_price: TodayPrice;
  status: Status;
  daily_price: DailyPrice;
  latitude: number;
  longitude: number;
  land_area: number;
  building_area: number;
  floors: number;
  unit_per_floor: number;
  floor: number;
  construction_year: number;
  address: string;
  options: Options;
  canceling_type: CancelationType;
}

export interface CancelationType {
  id: string;
  title: string;
  hex: string;
}

export interface Bedrooms {
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

export interface DailyPrice {
  id: number;
  property_id: number;
  normal: number;
  wednesday: number;
  thursday: number;
  friday: number;
  peak: number;
  cleaning: number;
  additional_person: number;
  today_offer: null;
  created_at: Date;
  updated_at: Date;
}

export interface Options {
  building_direction: string;
  ownership: string;
  property_type: string;
  neighborhood: string;
  access: string;
  pattern: string;
  welfare: string[];
  cool_heat: string[];
  kitchen: string[];
  entertainment: string[];
  pool_type: string[];
  party: string;
  pet: string;
  guest_type: string[];
}

export interface Status {
  id: number;
  title: string;
  hex: string;
}

export interface PropertyDescriptionsDto {
  id: number;
  property_id: number;
  property_dscr: string;
  pattern_dscr: string;
  distance_dscr: string;
  facility_dscr: string;
  guest_dscr: string;
  pet_dscr: string;
  party_dscr: string;
  doc_dscr: string;
  other_dscr: string;
  ad_dscr: string;
  created_at: Date;
  updated_at: Date;
}

export interface PropertyListDto {
  id: number;
  favorite_count: number;
  code: string;
  title: string;
  slug: string;
  feature_image: ImageDto;
  attachments_count: number;
  images: any[];
  std_capacity: number;
  max_capacity: number;
  total_bedrooms: number;
  bedrooms: Bedrooms;
  has_pool: boolean;
  province: string;
  city: string;
  advisor_commission: number;
  today_price: TodayPrice;
  is_today_reserved: boolean;
  is_authorized: boolean;
  has_blue_tick: boolean;
  status: Status;
  remaining_days: null;
  reserve_days: ReserveDaysDto[];
}

export interface ReserveDaysDto {
  day_number: number;
  is_reserved: boolean;
}

export interface Bedrooms {
  total_bedrooms: number;
}

export interface Status {
  id: number;
  title: string;
  hex: string;
}

export interface TodayPrice {
  price: number;
  discounted_price: number;
  discount_percentage: number;
}

export interface SingleOwnerPropertyDto {
  id: number;
  code: string;
  title: string;
  slug: string;
  feature_image: ImageDto;
  attachments_count: number;
  images: ImageDto[];
  reserve_days: ReserveDaysDto[];
  std_capacity: number;
  favorites_count: number;
  max_capacity: number;
  total_bedrooms: number;
  has_pool: boolean;
  province: string;
  city: string;
  advisor_commission: number;
  today_price: TodayPrice;
  is_today_reserved: boolean;
  is_authorized: boolean;
  has_blue_tick: boolean;
  status: Status;
  remaining_days: null;
  authorize_status: boolean;
  blue_tick_status: null;
  daily_price: DailyPrice;
  latitude: number;
  longitude: number;
  land_area: number;
  building_area: number;
  floors: number;
  unit_per_floor: number;
  floor: number;
  construction_year: number;
  address: string;
  rent_type: string;
}

export interface DailyPrice {
  id: number;
  property_id: number;
  normal: number;
  wednesday: number;
  thursday: number;
  friday: number;
  peak: number;
  cleaning: number;
  additional_person: number;
  today_offer: null;
  created_at: Date;
  updated_at: Date;
}

export interface Status {
  id: number;
  title: string;
  hex: string;
}

export interface OwnerCallendarItemDto {
  date: Date;
  day: number;
  advisor_commission: number;
  month: number;
  year: number;
  price: number;
  discounted_price: number;
  note: string;
  is_reserved: boolean;
  is_peak: boolean;
}

export interface GetPropBadgeDto {
  id: number;
  property_id: number;
  status: Status;
  changelog: any[];
  created_at: Date;
  updated_at: Date;
}

export interface Status {
  id: number;
  title: string;
  hex: string;
}

export interface OwnerSinglePropertyAuthdata {
  id: number;
  property_id: number;
  nc_image_id: number;
  status: Status;
  created_at: Date;
  updated_at: Date;
  property: Property;
  nc_image: ImageDto;
  docs: ImageDto[];
}

export interface Property {
  owner_id: number;
}

export interface PropertyStatsDto {
  statistics: Statistic[];
}

export interface Statistic {
  id: number;
  date: Date;
  view_count: number;
}

export interface GetPropertiesPlusFilters {
  cities?: string | null | number;
  sort_type?: string | null | number;
  code?: string | null | number;
  q?: string | null | number;
  entertainment?: string | null | number;
  party?: string | null | number;
  has_discount?: string | null | number;
  has_pool?: string | null | number;
  is_premium?: string | null | number;
  max_price?: string | null | number;
  checkin?: string | null | number;
  checkout?: string | null | number;
  max_commission?: string | null | number;
  min_commission?: string | null | number;
  min_price?: string | null | number;
  num_days?: string | null | number;
  pool_type?: string | null | number;
  property_type?: string | null | number;
  province_id?: string | null | number;
  regions?: (string | null | number)[];
  start_day?: string | null | number;
  title?: string | null | number;
  total_bedrooms?: string | null | number;
  total_guests?: string | null | number;
  cursor: string | null | number;
  per_page: string | null | number;

  max_building_area?: string | null | number;
  min_building_area?: string | null | number;
}

export interface SingleLandingDto {
  query: Query;
  content: Content;
  related_landings: RelatedLandings[];
  cities: City[];
}

export interface City {
  id: number;
  title: string;
  slug: string;
}

export interface Content {
  id: number;
  title: string;
  slug: string;
  key: null;
  small_text: null;
  full_text: null;
  feature_image_id: null;
  is_active: boolean;
  category_id: number;
  order: null;
  html: string;
  view_count: number;
  link: null;
  video_id: null;
  show_in_sitemap: boolean;
  fields: Fields;
  seo: SEO;
  form_id: null;
  created_at: Date;
  updated_at: Date;
  questions: Question[];
}

export interface Fields {}

export interface Question {
  question: string;
  answer: string;
  updated_at: Date;
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
}

export interface Query {
  with_pool: number;
  has_discount: number;
  is_premium: number;
  cities: number[];
  property_type: number[];
  [key: string]: any;
}

export interface RelatedLandings {
  title: string;
  url: string;
}

export interface PropertyContactIInfDto {
  assistant_full_name: string;
  assistant_mobile_number: string;
  is_owner: boolean;
}

export interface OwnerPropsRangeDto {
  max_price: number;
  min_price: number;
  step: number;
}
