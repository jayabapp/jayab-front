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
  originalSrc,
  fallbackSrc = DEFAULT_FALLBACK,
  onError,
  unoptimized,
  ...props
}: ContentImageProps) => {
  const [failure, setFailure] = useState<{
    requestedSource: ContentImageProps["src"];
    originalSrc: ContentImageProps["originalSrc"];
    fallbackSrc: ContentImageProps["fallbackSrc"];
    index: number;
  } | null>(null);
  const requestedSource = src || originalSrc || fallbackSrc;
  const sources = [
    ...new Set([requestedSource, originalSrc, fallbackSrc].filter(Boolean)),
  ];
  const isCurrentFailure =
    failure?.requestedSource === requestedSource &&
    failure.originalSrc === originalSrc &&
    failure.fallbackSrc === fallbackSrc;
  // Forget failures when the attachment or fallback changes, including A -> B -> A.
  if (failure && !isCurrentFailure) setFailure(null);
  const index = isCurrentFailure ? failure.index : 0;
  const source = sources[index] || fallbackSrc;

  return (
    <Image
      {...props}
      alt={alt}
      src={source}
      unoptimized={unoptimized || shouldSkipOptimizer(source)}
      onError={(event) => {
        onError?.(event);
        if (index < sources.length - 1)
          setFailure({
            requestedSource,
            originalSrc,
            fallbackSrc,
            index: index + 1,
          });
      }}
    />
  );
};

export default ContentImage;
