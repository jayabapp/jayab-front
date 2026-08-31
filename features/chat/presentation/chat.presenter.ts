import { NEW_IMAGE_URL } from "@/utils/urls";

export const resolveChatImage = (
  image?: {
    bucket: string;
    end_point: string;
    path: string;
    name: string;
    thumbnail?: string | null;
    medium?: string | null;
  } | null,
  size?: "name" | "thumbnail" | "medium",
) => NEW_IMAGE_URL(image, size);
