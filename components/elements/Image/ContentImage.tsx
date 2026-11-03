"use client";

import type { ContentImageProps } from "@/types/components/elements/image";
import { useState } from "react";

import Image from "next/image";

const DEFAULT_FALLBACK = "/assets/images/uploader/uploader_placeholder.png";

const shouldSkipOptimizer = (src: ContentImageProps["src"]): boolean => {
  if (typeof src !== "string") return false;
  const cleanSource = src.split("?")[0]?.toLowerCase();
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    cleanSource.endsWith(".gif") ||
    cleanSource.endsWith(".svg")
  );
};

const ContentImage = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  onError,
  unoptimized,
  ...props
}: ContentImageProps) => {
  const [failedSource, setFailedSource] =
    useState<ContentImageProps["src"]>(null);
  const requestedSource = src || fallbackSrc;
  const source =
    failedSource === requestedSource ? fallbackSrc : requestedSource;

  return (
    <Image
      {...props}
      alt={alt}
      src={source}
      unoptimized={unoptimized || shouldSkipOptimizer(source)}
      onError={(event) => {
        onError?.(event);
        if (source !== fallbackSrc) setFailedSource(requestedSource);
      }}
    />
  );
};

export default ContentImage;
