import { NEW_IMAGE_URL } from "@/utils/urls";

import type { ImageDto } from "@/api_services/auth/auth.interface";

export const USER_AVATAR_FALLBACK = "/assets/icons/header/new-face/user.svg";

export const getUserAvatarUrl = (image?: ImageDto | null) =>
  image ? NEW_IMAGE_URL(image) : USER_AVATAR_FALLBACK;
