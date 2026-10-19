export const IMAGE_UPLOAD_MAX_BYTES = 30 * 1024 * 1024;
export const IMAGE_UPLOAD_TIMEOUT_MS = 180_000;
export const IMAGE_UPLOAD_MIN_DIMENSION = 32;
export const IMAGE_UPLOAD_MAX_PIXELS = 268_000_000;

export const IMAGE_UPLOAD_ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,.jpg,.jpeg,.jfif";

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
};
const SUPPORTED_MIMES = new Set(Object.values(MIME_BY_EXTENSION));

export class ImageUploadValidationError extends Error {
  readonly code: "size" | "format" | "empty";
  constructor(code: "size" | "format" | "empty") {
    super(code);
    this.code = code;
    this.name = "ImageUploadValidationError";
  }
}

/** Validate the source without resizing or recompressing its pixels. */
export const prepareImageUpload = (file: File): File => {
  if (!file.size) throw new ImageUploadValidationError("empty");
  if (file.size > IMAGE_UPLOAD_MAX_BYTES)
    throw new ImageUploadValidationError("size");
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mime =
    file.type === "image/jpg" ||
    file.type === "image/pjpeg" ||
    file.type === "image/jfif"
      ? "image/jpeg"
      : file.type || MIME_BY_EXTENSION[extension];
  if (!mime || !SUPPORTED_MIMES.has(mime))
    throw new ImageUploadValidationError("format");
  return mime === file.type
    ? file
    : new File([file], file.name, {
        type: mime,
        lastModified: file.lastModified,
      });
};

export const imageUploadMaxDimension = (link: string): number => {
  const type = new URLSearchParams(link.split("?")[1] ?? "").get("type");
  switch (type) {
    case "PROFILE":
    case "OWNER_SELFIE_IMAGE":
    case "CHAT":
      return 1024;
    case "OWNER_PROPERTY_IMAGE":
      return 1600;
    default:
      return 2560;
  }
};
