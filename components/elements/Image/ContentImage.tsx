import Image from "next/image";

import type { ContentImageProps } from "@/types/components/elements/image";

const ContentImage = ({ alt, ...props }: ContentImageProps) => {
  return <Image {...props} alt={alt} />;
};

export default ContentImage;
