"use client";

import type { ProfileMenuRowProps } from "@/types/components/modules/profile";
import { ContentImage } from "@elements/Image";
import { usePathname } from "next/navigation";

import Link from "next/link";

const ProfileMenuRow = ({ entry, compact }: ProfileMenuRowProps) => {
  const pathname = usePathname();
  const isSelected = pathname.includes(entry?.route);

  const badge = entry?.badgeCounter ? (
    <div className="aspect-square w-5 h-5 rounded-full text-white border border-brand-100 bg-danger-500 flex z-1 items-center justify-center text-[10px]">
      {entry.badgeCounter}
    </div>
  ) : null;

  return (
    <Link
      href={entry?.route}
      title={entry?.title}
      className={`${
        isSelected ? "text-brand-600" : "text-neutral-900"
      } group flex w-full cursor-pointer items-center justify-between gap-2 border-b border-white/70 px-2 py-3 transition-colors last:border-b-0 hover:bg-white/60 hover:text-brand-600 md:py-4 rounded-2xl`}
    >
      <div className="flex items-center gap-3 md:gap-4 relative">
        <span className="menu-icon-chip">
          <ContentImage
            alt=""
            width={24}
            height={24}
            src={entry?.imgSrc}
            className="w-6 h-6 aspect-square"
          />
        </span>
        <p className="nav-underline relative text-sm md:text-base font-medium">
          {entry?.title}
        </p>
      </div>
      {compact ? (
        badge
      ) : (
        <div className="flex items-center gap-1">
          {badge}
          <ContentImage
            alt=""
            width={16}
            height={16}
            className="rotate-90"
            src="/assets/icons/shared/chevron.svg"
          />
        </div>
      )}
    </Link>
  );
};

export default ProfileMenuRow;
