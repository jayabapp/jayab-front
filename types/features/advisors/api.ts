export type {
  AdvisorPageListDto,
  AdvisorProfileDto,
  CreateAdvisorDto,
  SingleAdvisorDto,
} from "@/api_services/advisor/advisor.interface";
export type { PropertySubsDto } from "@/api_services/property/property.interface";

import type { AdvisorProfileDto, CreateAdvisorDto } from "@/api_services/advisor/advisor.interface";

/**
 * The advisor registration form. It is the request DTO plus the fields the form
 * needs but the API does not take: the province that narrows the city list, and
 * the three uploaded images, which are held as whole objects until submit turns
 * them into ids.
 */
export type AdvisorFormValues = CreateAdvisorDto & {
  document_image: AdvisorProfileDto["document_image"] | null;
  national_card_image: AdvisorProfileDto["national_card_image"] | null;
  profile_image: AdvisorProfileDto["user"]["profile_image"] | null;
  province?: string | number | null;
};

/** Which registration variant a `[subscription_key]` segment selects. */
export type AdvisorSubscriptionKind = "is-especial" | "normal";
