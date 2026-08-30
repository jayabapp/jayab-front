import { NEW_IMAGE_URL } from "@/utils/urls";

import type { ImageDto } from "@/api_services/auth/auth.interface";

const PROPERTY_IMAGE_FALLBACK = "/assets/icons/shared/image_placeholder.svg";
const PROPERTY_TYPE_IMAGE_FALLBACK =
  "/assets/icons/logo/mobile_header_logo.svg";

export const getPropertyImageUrl = (image?: ImageDto | null) =>
  image ? NEW_IMAGE_URL(image) : PROPERTY_IMAGE_FALLBACK;

export const getPropertyTypeImageUrl = (image?: ImageDto | null) =>
  image ? NEW_IMAGE_URL(image) : PROPERTY_TYPE_IMAGE_FALLBACK;
