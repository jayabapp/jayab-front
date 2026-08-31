"use client";

import type { MobileNavItemProps } from "@/types/components/modules/mobile-nav";
import { ContentImage } from "@elements/Image";
import { usePathname } from "next/navigation";
import { PulseDot } from "@elements/Badge";

const MobileNavItem = ({ entry, hasBadge, onSelect }: MobileNavItemProps) => {
  const pathname = usePathname();
  const isFocused = pathname === entry?.route;
  const dimmed = isFocused ? " " : " opacity-60 grayscale brightness-90 ";

  return (
    <button
      type="button"
      title={entry?.title}
      onClick={() => onSelect(entry?.route)}
      className="w-full relative cursor-pointer select-none flex flex-col items-center gap-1 justify-center transition-all duration-1000 ease-in-out"
    >
      {hasBadge && !isFocused ? (
        <PulseDot className="absolute left-2 -top-0.5 z-1" />
      ) : null}

      <ContentImage
        alt=""
        width={24}
        height={24}
        src={entry?.icon}
        className={`w-6 ${dimmed} h-6 aspect-square object-contain`}
      />

      <p
        className={`${dimmed} truncate text-xs md:text-base text-brand-600 select-none`}
      >
        {entry?.title}
      </p>
    </button>
  );
};

export default MobileNavItem;
