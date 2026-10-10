"use client";

import { useNotifications } from "@features/notifications/hooks/useNotifications";
import { useTranslations } from "next-intl";

import type { NotificationSkeletonGridProps } from "@/types/components/modules/profile";

import NotificationCardSkeleton from "./NotificationCardSkeleton";
import NotificationCard from "./parts/NotificationCard";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyState from "@elements/EmptyState";

const SKELETON_COUNT = 4;
const GRID_CLASS = "grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 md:p-4";

const NotificationSkeletonGrid = ({
  count = SKELETON_COUNT,
}: NotificationSkeletonGridProps) => {
  const t = useTranslations("profile");

  return (
  <div
    role="status"
    className={GRID_CLASS}
    aria-label={t("loadingNotifications")}
  >
    {Array.from({ length: count }, (_, index) => (
      <NotificationCardSkeleton key={index} />
    ))}
  </div>
);
};

const NotificationList = () => {
  const t = useTranslations("profile");

  const {
    isError,
    isPending,
    hasNextPage,
    notifications,
    fetchNextPage,
    isFetchingNextPage,
  } = useNotifications();

  if (isPending) return <NotificationSkeletonGrid />;

  if (isError)
    return (
      <div
        role="alert"
        className="rounded-lg bg-danger-500/10 p-4 text-sm text-status-danger"
      >
        {t("notificationsFailed")}
      </div>
    );

  if (notifications.length === 0) return <EmptyState
        title={t("emptyNotificationsTitle")}
        description={t("emptyNotificationsDesc")}
      />;

  return (
    <InfiniteScroll
      className={GRID_CLASS}
      hasMore={Boolean(hasNextPage)}
      dataLength={notifications.length}
      next={() => void fetchNextPage()}
      loader={
        isFetchingNextPage ? <NotificationSkeletonGrid count={2} /> : null
      }
    >
      {notifications.map((notification) => (
        <NotificationCard notification={notification} key={notification.id} />
      ))}
    </InfiniteScroll>
  );
};

export default NotificationList;
