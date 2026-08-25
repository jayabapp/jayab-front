"use client";

import { useState } from "react";

import Image from "next/image";

import type { ImageFallbackProps } from "@/types/components/elements/image";

const ImageFallback = ({ alt, fallbackSrc, onError, src, ...props }: ImageFallbackProps) => {
  const [failedSrc, setFailedSrc] = useState<ImageFallbackProps["src"] | null>(null);
  const activeSrc = failedSrc === src ? fallbackSrc : src;

  return (
    <Image
      {...props}
      alt={alt}
      src={activeSrc}
      onError={(event) => {
        if (activeSrc !== fallbackSrc) setFailedSrc(src);
        onError?.(event);
      }}
    />
  );
};

export default ImageFallback;
