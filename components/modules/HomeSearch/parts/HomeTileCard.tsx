import type { HomeTileCardProps } from "@/types/components/modules/home";
import { ContentImage } from "@elements/Image";
import type { CSSProperties } from "react";

import Link from "next/link";

const TILE_ICON_SIZES = "(min-width: 768px) 64px, 48px";

const HomeTileCard = ({ href, title, imageSrc, index }: HomeTileCardProps) => (
  <Link
    href={href}
    title={title}
    style={{ "--card-index": index ?? 0 } as CSSProperties}
    className="home-tile stagger-rise flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white bg-white px-2 md:gap-2.5"
  >
    <span className="home-tile-well shrink-0">
      <ContentImage
        width={64}
        height={64}
        src={imageSrc}
        alt={title || ""}
        sizes={TILE_ICON_SIZES}
        className="home-tile-icon size-12 object-contain md:size-16"
      />
    </span>

    <p className="line-clamp-1 text-xs font-medium md:text-sm md:font-bold">
      {title}
    </p>
  </Link>
);

export default HomeTileCard;
