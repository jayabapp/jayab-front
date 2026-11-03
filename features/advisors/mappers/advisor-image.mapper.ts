import { NEW_IMAGE_URL } from "@/utils/urls";

import type { ImageDto } from "@/api_services/auth/auth.interface";

const ADVISOR_AVATAR_FALLBACK = "/assets/icons/shared/image_placeholder.svg";

export const getAdvisorAvatarUrl = (image?: ImageDto | null) =>
  image ? NEW_IMAGE_URL(image) : ADVISOR_AVATAR_FALLBACK;
