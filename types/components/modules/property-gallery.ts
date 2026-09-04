export type { ImageDto } from "@/api_services/auth/auth.interface";

import type { ImageDto } from "@/api_services/auth/auth.interface";

export type PropertyGalleryProps = {
  advisorCommission?: number;
  images: ImageDto[];
  productImageId?: number | null;
  title?: string;
};

export type GalleryThumbnailProps = {
  alt?: string | null;
  id?: string | null;
  imageSize?: "medium" | "name" | "thumbnail";
  item?: ImageDto | null;
  moreClass?: string;
  onClick?: () => void;
  sizes?: string;
};

export type GalleryLightboxProps = {
  alt?: string;
  images: ImageDto[];
  onHide: () => void;
  show: boolean;
  startIndex?: number | null;
  title?: string;
};

export type PropertyImageDownloadButtonProps = {
  attachmentId?: number | null;
};

export type ShareImageItemProps = {
  cb: () => void | null;
  image: ImageDto;
  isSelected: boolean;
};
