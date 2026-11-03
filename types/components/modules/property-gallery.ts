import type { ReactNode } from "react";
export type { ImageDto } from "@/api_services/auth/auth.interface";
import type { ImageDto } from "@/api_services/auth/auth.interface";

export type PropertyGalleryProps = {
  title?: string;
  hostName?: string;
  images: ImageDto[];
  viewerActions?: ReactNode;
  advisorCommission?: number;
  productImageId?: number | null;
};

export type GalleryThumbnailProps = {
  sizes?: string;
  moreClass?: string;
  id?: string | null;
  alt?: string | null;
  onClick?: () => void;
  item?: ImageDto | null;
  imageSize?: "medium" | "name" | "thumbnail";
};

export type GalleryLightboxProps = {
  alt?: string;
  show: boolean;
  title?: string;
  images: ImageDto[];
  onHide: () => void;
  startIndex?: number | null;
};

export type PropertyPhotoViewerProps = {
  alt?: string;
  show: boolean;
  title?: string;
  hostName?: string;
  images: ImageDto[];
  onHide: () => void;
  actions?: ReactNode;
  startIndex?: number | null;
  onIndexChange?: (index: number) => void;
};

export type PropertyImageDownloadButtonProps = {
  attachmentId?: number | null;
};

export type ShareImageItemProps = {
  image: ImageDto;
  isSelected: boolean;
  cb: () => void | null;
};
