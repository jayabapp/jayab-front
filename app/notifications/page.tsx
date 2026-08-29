"use client";

import { useNotifications } from "@features/notifications/hooks/useNotifications";

import NotificationCardSkeleton from "@/components/notification/NotificationCardSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import NotifCard from "@/components/notification/NotifCard";
import EmptyState from "@elements/EmptyState";

const NotificationSkeletonGrid = ({ count = 4 }: { count?: number }) => (
  <div
    className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 md:p-4"
    role="status"
    aria-label="در حال دریافت اعلان‌ها"
  >
    {Array.from({ length: count }, (_, index) => (
      <NotificationCardSkeleton key={index} />
    ))}
  </div>
);

const Notifications = () => {
  const {
    notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useNotifications();

  if (isPending) return <NotificationSkeletonGrid />;

  return (
    <div
      id="homeParent"
      className="container transition-all duration-500 ease-in-out"
    >
      {isError ? (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          دریافت اعلان‌ها با خطا مواجه شد.
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <InfiniteScroll
          hasMore={Boolean(hasNextPage)}
          dataLength={notifications.length}
          next={() => void fetchNextPage()}
          className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 md:p-4"
          loader={
            isFetchingNextPage ? <NotificationSkeletonGrid count={2} /> : null
          }
        >
          {notifications.map((notification) => (
            <NotifCard item={notification} key={notification.id} />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Notifications;
