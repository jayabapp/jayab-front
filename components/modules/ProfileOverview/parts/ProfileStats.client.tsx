"use client";

import { useOwnerActiveReservationCount } from "@features/reservations/hooks/useOwnerActiveReservationCount";
import { useNotificationBadge } from "@features/notifications/hooks/useNotificationBadge";
import { useUnreadChatCount } from "@features/chat/hooks/useUnreadChatCount";
import type { ProfileStatsProps } from "@/types/components/modules/profile";
import { ContentImage } from "@elements/Image";
import { useStoreParams } from "@/store";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const ProfileStats = ({ profile, isLogin }: ProfileStatsProps) => {
  const isOwner = !!profile?.owner_id;

  // Every number here already exists somewhere in the shell — the header badges
  // and the auth-init payload — so the dashboard adds no endpoint of its own and
  // React Query serves the counts the header already has from cache.
  const { data: chat } = useUnreadChatCount(isLogin);
  const { data: notificationCount = 0 } = useNotificationBadge(isLogin);
  const { data: activeReserves = 0 } = useOwnerActiveReservationCount(isOwner);
  const bookmarks = useStoreParams((state) => state.bookmarks);
  const likes = useStoreParams((state) => state.likes);

  const stats = [
    {
      id: "chat",
      route: "/chat",
      title: _STRINGS.STAT_UNREAD_MESSAGES,
      value: chat?.unread_count ?? 0,
      imgSrc: "/assets/icons/header/blue_chat.svg",
    },
    {
      id: "notifications",
      route: "/profile/notifications",
      title: _STRINGS.STAT_NOTIFICATIONS,
      value: notificationCount ?? 0,
      imgSrc: "/assets/icons/header/blue_bell.svg",
    },
    {
      id: "bookmarks",
      route: "/profile/bookmarks",
      title: _STRINGS.STAT_BOOKMARKS,
      value: bookmarks?.length ?? 0,
      imgSrc: "/assets/icons/header/header_my_saves.svg",
    },
    ...(isOwner
      ? [
          {
            id: "reserves",
            route: "/profile/owner/reserves",
            title: _STRINGS.STAT_ACTIVE_RESERVES,
            value: activeReserves ?? 0,
            imgSrc: "/assets/icons/adds/header_reserve.svg",
          },
        ]
      : [
          {
            id: "likes",
            route: "/profile/bookmarks",
            title: _STRINGS.STAT_LIKES,
            value: likes?.length ?? 0,
            imgSrc: "/assets/icons/adds/filled_heart.svg",
          },
        ]),
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm font-medium text-neutral-600">
        {_STRINGS.PROFILE_OVERVIEW_TITLE}
      </p>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            prefetch={false}
            href={stat.route}
            title={stat.title}
            key={`profileStat${stat.id}`}
            className="glass-surface group flex flex-col gap-2 rounded-20 px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-glass"
          >
            <span className="menu-icon-chip">
              <ContentImage
                alt=""
                width={20}
                height={20}
                src={stat.imgSrc}
                className="aspect-square h-5 w-5"
              />
            </span>
            <p className="text-2xl font-bold leading-none text-neutral-900">
              {stat.value}
            </p>
            <p className="text-xs text-neutral-600">{stat.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;
