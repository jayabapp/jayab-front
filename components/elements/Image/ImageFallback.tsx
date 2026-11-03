"use client";

import type { ImageFallbackProps } from "@/types/components/elements/image";
import { useState } from "react";

import Image from "next/image";

const ImageFallback = ({
  src,
  alt,
  onError,
  fallbackSrc,
  ...props
}: ImageFallbackProps) => {
  const [failedSource, setFailedSource] =
    useState<ImageFallbackProps["src"]>(null);
  const currentSource = failedSource === src ? fallbackSrc : src || fallbackSrc;

  return (
    <Image
      {...props}
      alt={alt}
      src={currentSource}
      onError={(event) => {
        onError?.(event);
        if (currentSource !== fallbackSrc) setFailedSource(src);
      }}
    />
  );
};

export default ImageFallback;
