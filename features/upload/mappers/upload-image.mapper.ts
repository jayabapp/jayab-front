import { NEW_IMAGE_URL } from "@/utils/urls";

import type { ImageDto } from "@/api_services/auth/auth.interface";

type UploadImage = ImageDto & { file_location?: string };

export const getUploadedImageUrl = (
  item?: UploadImage | string | null,
  size?: "name" | "thumbnail" | "medium",
) => {
  if (typeof item === "string") return item;
  if (item?.file_location) return item.file_location;
  return NEW_IMAGE_URL(item, size);
};
