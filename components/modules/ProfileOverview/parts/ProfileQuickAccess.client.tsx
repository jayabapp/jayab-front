"use client";

import type { ProfileQuickAccessProps } from "@/types/components/modules/profile";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const ProfileQuickAccess = ({ entries, limit = 6 }: ProfileQuickAccessProps) => {
  const shortcuts = entries.slice(0, limit);

  if (!shortcuts.length) return <></>;

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm font-medium text-neutral-600">
        {_STRINGS.PROFILE_QUICK_ACCESS}
      </p>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {shortcuts.map((entry) => (
          <Link
            href={entry?.route}
            title={entry?.title}
            key={`quickAccess${entry.id}${entry.route}`}
            className="glass-surface group flex items-center gap-3 rounded-20 px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-glass"
          >
            <span className="menu-icon-chip">
              <ContentImage
                alt=""
                width={24}
                height={24}
                src={entry?.imgSrc}
                className="aspect-square h-6 w-6"
              />
            </span>
            <p className="flex-1 text-sm font-medium text-neutral-900">
              {entry?.title}
            </p>
            {entry?.badgeCounter ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-[10px] text-white">
                {entry.badgeCounter}
              </span>
            ) : (
              <></>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileQuickAccess;
