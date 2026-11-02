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

export const uploadScale = (
  width: number,
  height: number,
  maxDimension: number,
): number => Math.min(1, maxDimension / Math.min(width, height));

const SHRINKABLE = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const SHRINK_MIN_BYTES = 1.5 * 1024 * 1024;
const SHRINK_QUALITY = 0.92;

export const shrinkImageForUpload = async (
  file: File,
  maxDimension: number,
): Promise<File> => {
  if (
    !SHRINKABLE.has(file.type) ||
    file.size < SHRINK_MIN_BYTES ||
    typeof createImageBitmap !== "function"
  )
    return file;
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const scale = uploadScale(bitmap.width, bitmap.height, maxDimension);
    if (scale >= 1) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    // PNG keeps its transparency; photos go out as high-quality JPEG.
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, SHRINK_QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${name}.${type === "image/png" ? "png" : "jpg"}`, {
      type,
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
};
