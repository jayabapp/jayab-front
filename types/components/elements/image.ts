import type { ImageProps } from "next/image";

export type ContentImageProps = Omit<ImageProps, "src"> & {
  src?: ImageProps["src"] | null;
  alt: string;
};

export type ImageFallbackProps = Omit<ImageProps, "src"> & {
  alt: string;
  fallbackSrc: ImageProps["src"];
  src?: ImageProps["src"] | null;
};

export type UploadPreviewImageProps = Omit<ImageProps, "src" | "unoptimized"> & {
  alt: string;
  src: string;
};
