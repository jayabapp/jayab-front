"use client";

import type { ProfileMenuRowProps } from "@/types/components/modules/profile";
import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";
import { usePathname } from "next/navigation";

import Link from "next/link";

const ProfileMenuRow = ({ entry, compact }: ProfileMenuRowProps) => {
  const pathname = usePathname();
  const isSelected =
    entry.route === "/profile"
      ? pathname === entry.route
      : pathname.includes(entry.route);

  const badge = entry?.badgeCounter ? (
    <div className="aspect-square w-5 h-5 rounded-full text-white border border-selected-line bg-danger-500 flex z-1 items-center justify-center text-[10px]">
      {entry.badgeCounter}
    </div>
  ) : null;

  return (
    <Link
      prefetch
      href={entry?.route}
      title={entry?.title}
      className={`${
        isSelected ? "text-link menu-row-line-active" : "text-ink"
      } group flex w-full cursor-pointer items-center justify-between gap-2 menu-row-line px-2 py-3 transition-colors hover:bg-surface/60 hover:text-link md:py-4 rounded-2xl`}
    >
      <div className="flex items-center gap-3 md:gap-4 relative">
        <span className="menu-icon-chip">
          <ContentImage
            alt=""
            width={20}
            height={20}
            src={entry?.imgSrc}
            className="size-5 aspect-square"
          />
        </span>
        <p className="text-sm md:text-base font-medium">{entry?.title}</p>
      </div>
      {compact ? (
        badge
      ) : (
        <div className="flex items-center gap-1">
          {badge}
          <Icon
            name="chevron-down"
            size={16}
            className="rotate-90 text-ink-subtle ltr:-rotate-90"
          />
        </div>
      )}
    </Link>
  );
};

export default ProfileMenuRow;
