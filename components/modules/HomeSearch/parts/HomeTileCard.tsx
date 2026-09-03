import type { HomeTileCardProps } from "@/types/components/modules/home";
import { ContentImage } from "@elements/Image";

import type { CSSProperties } from "react";
import Link from "next/link";

// The icon renders at a fixed CSS size — 40px below md, 56px at md and above —
// so these are exact widths rather than viewport-relative ones.
const TILE_ICON_SIZES = "(min-width: 768px) 56px, 40px";

const HomeTileCard = ({ href, title, imageSrc, index }: HomeTileCardProps) => (
  <Link
    href={href}
    title={title}
    style={{ "--card-index": index ?? 0 } as CSSProperties}
    className="home-tile stagger-rise flex h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white bg-white px-2 md:h-32 md:gap-2.5"
  >
    <span className="home-tile-well size-11 shrink-0 md:size-16">
      <ContentImage
        width={56}
        height={56}
        alt={title || ""}
        src={imageSrc}
        sizes={TILE_ICON_SIZES}
        className="home-tile-icon size-7 object-contain md:size-10"
      />
    </span>

    <p className="line-clamp-1 text-xs font-medium md:text-sm md:font-bold">
      {title}
    </p>
  </Link>
);

export default HomeTileCard;
