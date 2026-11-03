"use client";

import type { UploadPreviewImageProps } from "@/types/components/elements/image";

import Image from "next/image";

const UploadPreviewImage = ({ alt, ...props }: UploadPreviewImageProps) => (
  <Image {...props} alt={alt} unoptimized />
);

export default UploadPreviewImage;
