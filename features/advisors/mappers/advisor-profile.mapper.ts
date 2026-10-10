import type {
  AdvisorFormValues,
  AdvisorProfileDto,
  CreateAdvisorDto,
} from "@/types/features/advisors";

export const mapAdvisorProfileToForm = (
  profile: AdvisorProfileDto | null | undefined,
  isSpecial: boolean,
): AdvisorFormValues => ({
  address: profile?.address ?? "",
  cityIds: profile?.cities ?? [],
  document_image: profile?.document_image ?? null,
  full_name: profile?.user?.full_name ?? "",
  is_special: isSpecial,
  national_card_image: profile?.national_card_image ?? null,
  national_code: profile?.national_code ?? "",
  profile_image: profile?.user?.profile_image ?? null,
  referrer_code: profile?.user?.referrer_code ?? "",
  tel: profile?.tel ?? "",
  province: profile?.cities?.[0]?.parent_id ?? "",
});

const isBlank = (value: string | number | null | undefined) =>
  !`${value ?? ""}`.trim();

export type MissingAdvisorField =
  | "advisor.fullName"
  | "advisor.nationalCode"
  | "advisor.telephoneNumber"
  | "common.province"
  | "advisor.stationeryPlace"
  | "advisor.uploadRentalDoc"
  | "advisor.nationalCardImage";

// Returns the message key of the first missing field; the caller translates it.
export const findMissingAdvisorField = (
  values: AdvisorFormValues,
): MissingAdvisorField | null => {
  if (isBlank(values.full_name)) return "advisor.fullName";
  if (!values.is_special) return null;

  if (isBlank(values.national_code)) return "advisor.nationalCode";
  if (isBlank(values.tel)) return "advisor.telephoneNumber";
  if (isBlank(values.province)) return "common.province";
  if (isBlank(values.address)) return "advisor.stationeryPlace";
  if (!values.document_image) return "advisor.uploadRentalDoc";
  if (!values.national_card_image) return "advisor.nationalCardImage";
  return null;
};

export const mapAdvisorFormToRequest = (
  values: AdvisorFormValues,
): CreateAdvisorDto => ({
  address: values.address || "",
  cityIds: values.cityIds?.map((city: any) => city?.id ?? city).filter(Boolean),
  full_name: values.full_name,
  is_special: values.is_special,
  national_code: values.national_code || undefined,
  tel: values.tel || undefined,
  document_image_id: values.document_image?.id,
  national_card_image_id: values.national_card_image?.id,
  profile_image_id: values.profile_image?.id,
  referrer_code: values.referrer_code || undefined,
});
