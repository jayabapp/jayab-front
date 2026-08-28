import type { ContentImageProps } from "@/types/components/elements/image";

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
  unoptimized,
  ...props
}: ContentImageProps) => {
  const source = src || DEFAULT_FALLBACK;
  return (
    <Image
      {...props}
      alt={alt}
      src={source}
      unoptimized={unoptimized || shouldSkipOptimizer(source)}
    />
  );
};

export default ContentImage;
