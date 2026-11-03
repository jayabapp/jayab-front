import { normalizeApiError, isRequestCancelled } from "@/lib/api/api-error";
import { ImageUploadValidationError } from "./image-upload";

export const uploadErrorKey = (error: unknown) => {
  if (isRequestCancelled(error)) return null;
  if (error instanceof ImageUploadValidationError) {
    if (error.code === "size") return "imageTooLarge";
    if (error.code === "format") return "imageUploadUnsupported";
    return "imageUploadInvalid";
  }
  const normalized = normalizeApiError(error);
  if (normalized.status === 413) return "imageTooLarge";
  if (normalized.status === 415) return "imageUploadUnsupported";
  if (normalized.code === "ATTACH_IMAGE_PIXEL_LIMIT")
    return "imageUploadPixelLimit";
  if (normalized.code === "ATTACH2") return "imageUploadTooSmall";
  if (normalized.code === "ATTACH_IMAGE_INVALID") return "imageUploadInvalid";
  if (normalized.code === "ECONNABORTED" || normalized.code === "ETIMEDOUT")
    return "imageUploadTimeout";
  return "imageUploadFailed";
};
