import { ContentImage } from "@elements/Image";

import type { HomeTileCardProps } from "@/types/components/modules/home";
import type { CSSProperties } from "react";

import Link from "next/link";

const TILE_ICON_SIZES = "(min-width: 768px) 64px, 56px";

const HomeTileCard = ({ href, title, imageSrc, index }: HomeTileCardProps) => (
  <Link
    href={href}
    title={title}
    style={{ "--card-index": index ?? 0 } as CSSProperties}
    className="home-tile stagger-rise flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border bg-white px-2 md:aspect-auto md:h-[8.8125rem] md:w-[8.8125rem] md:shrink-0 md:gap-2.5 lg:aspect-square lg:h-auto lg:w-full"
  >
    <span className="home-tile-well shrink-0">
      <ContentImage
        width={64}
        height={64}
        src={imageSrc}
        alt={title || ""}
        sizes={TILE_ICON_SIZES}
        className="home-tile-icon size-7 object-contain md:size-16"
      />
    </span>

    <p className="line-clamp-1 text-xs font-medium md:text-sm md:font-bold">
      {title}
    </p>
  </Link>
);

export default HomeTileCard;
