"use client";

import Image from "next/image";

import type { UploadPreviewImageProps } from "@/types/components/elements/image";

const UploadPreviewImage = ({ alt, src, ...props }: UploadPreviewImageProps) => {
  return <Image {...props} unoptimized alt={alt} src={src} />;
};

export default UploadPreviewImage;
