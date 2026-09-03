"use client";

import type { NotificationSkeletonGridProps } from "@/types/components/modules/profile";
import { useNotifications } from "@features/notifications/hooks/useNotifications";

import NotificationCardSkeleton from "./NotificationCardSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import NotificationCard from "./parts/NotificationCard";
import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";

const SKELETON_COUNT = 4;
const GRID_CLASS = "grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 md:p-4";

const NotificationSkeletonGrid = ({
  count = SKELETON_COUNT,
}: NotificationSkeletonGridProps) => (
  <div
    role="status"
    className={GRID_CLASS}
    aria-label={_STRINGS.LOADING_NOTIFICATIONS}
  >
    {Array.from({ length: count }, (_, index) => (
      <NotificationCardSkeleton key={index} />
    ))}
  </div>
);

const NotificationList = () => {
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
        className="rounded-lg bg-danger-500/10 p-4 text-sm text-danger-500"
      >
        {_STRINGS.NOTIFICATIONS_FAILED}
      </div>
    );

  if (notifications.length === 0) return <EmptyState
        title={_STRINGS.EMPTY_NOTIFICATIONS_TITLE}
        description={_STRINGS.EMPTY_NOTIFICATIONS_DESC}
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
