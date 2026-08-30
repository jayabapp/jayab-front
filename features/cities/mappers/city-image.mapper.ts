import { NEW_IMAGE_URL } from "@/utils/urls";

import type { ImageDto } from "@/api_services/auth/auth.interface";

const CITY_IMAGE_FALLBACK = "/assets/icons/logo/mobile_header_logo.svg";

export const getCityImageUrl = (image?: ImageDto | null) =>
  image ? NEW_IMAGE_URL(image) : CITY_IMAGE_FALLBACK;
