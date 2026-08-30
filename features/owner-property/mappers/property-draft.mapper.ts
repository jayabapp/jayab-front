import type {
  AssistantSendDto,
  FacilitiesValuesDto,
  PricingPropertySendDto,
  PropertyEnvironmentValues,
  PropertyInitialsValues,
  PropertyMediaValues,
  PropertyTermsSendDto,
  PropInitDto,
  RoomInfosDto,
} from "@/types/features/owner-property";

const optionOf = (draft: PropInitDto, group: string) =>
  draft?.property_options?.find((option) => option?.option?.group == group)
    ?.option_id ?? null;

const optionsOf = (draft: PropInitDto, group: string) =>
  draft?.property_options
    ?.filter((option) => option?.option?.group == group)
    ?.map((option) => option?.option_id) || [];

export const emptyInitialsValues = (): PropertyInitialsValues => ({
  address: "",
  building_area: "",
  can_chat: false,
  city: "",
  construction_year: "",
  direction: "",
  floor: "",
  floor_count: "",
  land_area: "",
  location_access: false,
  owenershp_type: "",
  property_type: "",
  province: "",
  region: "",
  title: "",
  units_in_floor: "",
});

export const toInitialsValues = (
  draft: PropInitDto,
): PropertyInitialsValues => ({
  address: draft?.address,
  building_area: draft?.building_area || null,
  can_chat: draft?.is_chat_enabled,
  city: draft?.city_id,
  construction_year: draft?.construction_year,
  direction: optionOf(draft, "BUILDING_DIRECTION"),
  floor: draft?.floor,
  floor_count: draft?.floors,
  land_area: draft?.land_area,
  location_access: draft?.is_location_visible,
  owenershp_type: optionOf(draft, "OWNERSHIP"),
  property_type: optionOf(draft, "PROPERTY_TYPE"),
  province: draft?.province_id,
  region: draft?.region_id,
  title: draft?.title,
  units_in_floor: draft?.unit_per_floor,
});

export const emptyEnvironmentValues = (): PropertyEnvironmentValues => ({
  access: "",
  distance_dscr: "",
  neighborhood: "",
  pattern: "",
  pattern_dscr: "",
});

export const toEnvironmentValues = (
  draft: PropInitDto,
): PropertyEnvironmentValues => ({
  access: optionOf(draft, "ACCESS"),
  distance_dscr: draft?.description?.distance_dscr,
  neighborhood: optionOf(draft, "NEIGHBORHOOD"),
  pattern: optionOf(draft, "PATTERN"),
  pattern_dscr: draft?.description?.pattern_dscr,
});

export const emptyBedroomValues = (): RoomInfosDto => ({
  additional_bed: 0,
  bathroom_general: 0,
  bathroom_in_wc: 0,
  bathroom_master: 0,
  bathroom_tub: 0,
  bedrooms: [],
  master_room: 0,
  sofa_bed: 0,
  wc: 0,
  wc_ir: 0,
});

export const toBedroomValues = (draft: PropInitDto): RoomInfosDto => {
  const bedrooms = draft?.bedrooms;
  return {
    additional_bed: bedrooms?.additional_bed || 0,
    bathroom_general: bedrooms?.bathroom_general || 0,
    bathroom_in_wc: bedrooms?.bathroom_in_wc || 0,
    bathroom_master: bedrooms?.bathroom_master || 0,
    bathroom_tub: bedrooms?.bathroom_tub || 0,
    bedrooms: bedrooms?.bedrooms || [],
    master_room: bedrooms?.master_room || 0,
    sofa_bed: bedrooms?.sofa_bed || 0,
    wc: bedrooms?.wc || 0,
    wc_ir: bedrooms?.wc_ir || 0,
  };
};

export const emptyFacilityValues = (): FacilitiesValuesDto => ({
  cool_heat: [],
  entertainment: [],
  facility_dscr: "",
  has_pool: false,
  kitchen: [],
  pool_type: [],
  welfare: [],
});

export const toFacilityValues = (draft: PropInitDto): FacilitiesValuesDto => ({
  cool_heat: optionsOf(draft, "COOL_HEAT"),
  entertainment: optionsOf(draft, "ENTERTAINMENT"),
  facility_dscr: draft?.description?.facility_dscr,
  has_pool: draft?.has_pool,
  kitchen: optionsOf(draft, "KITCHEN"),
  pool_type: optionsOf(draft, "POOL_TYPE"),
  welfare: optionsOf(draft, "WELFARE"),
});

export const emptyPriceValues = (): PricingPropertySendDto => ({
  additional_person: "",
  advisor_commission: 0,
  cleaning: "",
  friday: "",
  max_capacity: 0,
  normal: "",
  peak: "",
  std_capacity: 0,
  thursday: "",
  wednesday: "",
});

export const toPriceValues = (draft: PropInitDto): PricingPropertySendDto => ({
  additional_person: draft?.daily_price?.additional_person || 0,
  advisor_commission: draft?.advisor_commission || 0,
  cleaning: draft?.daily_price?.cleaning || 0,
  friday: draft?.daily_price?.friday || 0,
  max_capacity: draft?.max_capacity || 0,
  normal: draft?.daily_price?.normal || 0,
  peak: draft?.daily_price?.peak || 0,
  std_capacity: draft?.std_capacity || 0,
  thursday: draft?.daily_price?.thursday || 0,
  wednesday: draft?.daily_price?.wednesday,
});

export const emptyAssistantValues = (): AssistantSendDto => ({
  assistant_full_name: "",
  assistant_mobile: "",
  show_mobile_type: 1,
});

export const toAssistantValues = (draft: PropInitDto): AssistantSendDto => {
  const assistant = draft?.assistants?.find(
    (contact) => contact.is_owner === false,
  );
  return {
    assistant_full_name: assistant?.assistant_full_name ?? "",
    assistant_mobile: assistant?.assistant_mobile_number ?? "",
    show_mobile_type: Number(draft?.contact_type),
  };
};

export const emptyTermsValues = (): PropertyTermsSendDto => ({
  ad_dscr: "",
  canceling_type: "NORMAL",
  check_in_hour: "",
  check_out_hour: "",
  doc_dscr: "",
  guest_dscr: "",
  guest_type: [],
  other_dscr: "",
  party: "",
  party_dscr: "",
  pet: "",
  pet_dscr: "",
  property_dscr: "",
});

export const toTermsValues = (draft: PropInitDto): PropertyTermsSendDto => ({
  ad_dscr: draft?.description?.ad_dscr,
  canceling_type: draft?.canceling_type || "NORMAL",
  check_in_hour: draft?.check_in_hour,
  check_out_hour: draft?.check_out_hour,
  doc_dscr: draft?.description?.doc_dscr,
  guest_dscr: draft?.description?.guest_dscr,
  guest_type: optionsOf(draft, "GUEST_TYPE"),
  other_dscr: draft?.description?.other_dscr,
  party: optionOf(draft, "PARTY") || "",
  party_dscr: draft?.description?.party_dscr,
  pet: optionOf(draft, "PET") || "",
  pet_dscr: draft?.description?.pet_dscr,
  property_dscr: draft?.description?.property_dscr,
});

export const emptyMediaValues = (): PropertyMediaValues => ({
  featureImageId: 0,
  images: [],
});

export const toMediaValues = (draft: PropInitDto): PropertyMediaValues => ({
  featureImageId: draft?.feature_image_id || 0,
  images: draft?.attachments?.map((attachment) => ({ data: attachment })) || [],
});
