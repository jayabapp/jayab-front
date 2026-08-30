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
      prefetch={false}
      href={entry?.route}
      title={entry?.title}
      className={`${isSelected ? "text-brand-600" : "border-r-transparent"} py-3 md:py-5 flex border-b last:border-b-0 border-neutral-200 items-center w-full justify-between cursor-pointer hover:scale-102 transition-all`}
    >
      <div className="flex items-center gap-3 md:gap-4 relative">
        <ContentImage
          alt=""
          width={28}
          height={28}
          src={entry?.imgSrc}
          className="w-7 h-7 aspect-square"
        />
        <p className="text-sm md:text-base font-medium">{entry?.title}</p>
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
