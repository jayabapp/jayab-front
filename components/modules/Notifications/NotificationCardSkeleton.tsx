import SkeletonCircle from "@elements/Skeleton/SkeletonCircle";
import Skeleton from "@elements/Skeleton/Skeleton";

const NotificationCardSkeleton = () => (
  <div
    aria-hidden="true"
    className="flex flex-col gap-4 rounded-20 bg-white/60 px-3 py-3 shadow-sm"
  >
    <div className="flex items-start gap-3">
      <SkeletonCircle className="size-5" />
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-4 w-2/5 rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>
    </div>
    <Skeleton className="h-3 w-28 self-end rounded" />
  </div>
);

export default NotificationCardSkeleton;
