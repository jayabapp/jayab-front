import { NEW_IMAGE_URL } from "@/utils/urls";

import type { ImageDto } from "@/api_services/auth/auth.interface";

export const getHomeImageUrl = (
  image?: ImageDto | null,
  size?: "name" | "thumbnail" | "medium",
) => (image ? NEW_IMAGE_URL(image, size) : "");
