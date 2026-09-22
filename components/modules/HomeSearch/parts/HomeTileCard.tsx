import { ContentImage } from "@elements/Image";

import type { HomeTileCardProps } from "@/types/components/modules/home";
import type { CSSProperties } from "react";

import Link from "next/link";

const TILE_ICON_SIZES = "(min-width: 768px) 64px, 56px";

const HomeTileCard = ({
  href,
  index,
  title,
  imageSrc,
  sizeClassName = "home-tile-box",
}: HomeTileCardProps) => (
  <Link
    href={href}
    title={title}
    style={{ "--card-index": index ?? 0 } as CSSProperties}
    className={`home-tile stagger-rise flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white px-2 shrink-0 md:gap-2.5 ${sizeClassName}`}
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
