export interface CreateAdvisorDto {
  full_name: number | string | null;
  address: number | string | null;
  national_code: number | string | null;
  tel: number | string | null;
  area_code: number | string | null;
  cityIds: (number | string | null)[];
  is_special: boolean;
  profile_image_id: number | null | string;
  national_card_image_id: number | null | string;
  document_image_id: number | null | string;
}
