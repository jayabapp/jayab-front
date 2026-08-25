import type { ImageProps } from "next/image";

export type ContentImageProps = ImageProps & {
  alt: string;
};

export type ImageFallbackProps = Omit<ImageProps, "src"> & {
  alt: string;
  fallbackSrc: ImageProps["src"];
  src: ImageProps["src"];
};

export type UploadPreviewImageProps = Omit<ImageProps, "src" | "unoptimized"> & {
  alt: string;
  src: string;
};
