"use client";

import { useOwnerActiveReservationCount } from "@features/reservations/hooks/useOwnerActiveReservationCount";
import { useNotificationBadge } from "@features/notifications/hooks/useNotificationBadge";
import { useUnreadChatCount } from "@features/chat/hooks/useUnreadChatCount";
import { useTranslations } from "next-intl";
import { useStoreParams } from "@/store";
import { ContentImage } from "@elements/Image";

import type { ProfileStatsProps } from "@/types/components/modules/profile";

import Link from "next/link";

const ProfileStats = ({ profile, isLogin }: ProfileStatsProps) => {
  const t = useTranslations("profile");

  const isOwner = !!profile?.owner_id;

  const { data: chat } = useUnreadChatCount(isLogin);
  const { data: notificationCount = 0 } = useNotificationBadge(isLogin);
  const { data: activeReserves = 0 } = useOwnerActiveReservationCount(isOwner);
  const bookmarks = useStoreParams((state) => state.bookmarks);
  const likes = useStoreParams((state) => state.likes);

  const stats = [
    {
      id: "chat",
      route: "/chat",
      title: t("statUnreadMessages"),
      value: chat?.unread_count ?? 0,
      imgSrc: "/assets/icons/header/blue_chat.svg",
    },
    {
      id: "notifications",
      route: "/profile/notifications",
      title: t("statNotifications"),
      value: notificationCount ?? 0,
      imgSrc: "/assets/icons/header/blue_bell.svg",
    },
    {
      id: "bookmarks",
      route: "/profile/bookmarks",
      title: t("statBookmarks"),
      value: bookmarks?.length ?? 0,
      imgSrc: "/assets/icons/header/header_my_saves.svg",
    },
    ...(isOwner
      ? [
          {
            id: "reserves",
            route: "/profile/owner/reserves",
            title: t("statActiveReserves"),
            value: activeReserves ?? 0,
            imgSrc: "/assets/icons/adds/header_reserve.svg",
          },
        ]
      : [
          {
            id: "likes",
            route: "/profile/bookmarks",
            title: t("statLikes"),
            value: likes?.length ?? 0,
            imgSrc: "/assets/icons/adds/filled_heart.svg",
          },
        ]),
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm font-medium text-ink-muted">
        {t("profileOverviewTitle")}
      </p>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            prefetch
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
            <p className="text-2xl font-bold leading-none text-ink">
              {stat.value}
            </p>
            <p className="text-xs text-ink-muted">{stat.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;
