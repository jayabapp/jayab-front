import SkeletonCircle from "@elements/Skeleton/SkeletonCircle";
import Skeleton from "@elements/Skeleton/Skeleton";

const AdvisorCardSkeleton = () => (
  <div
    aria-hidden="true"
    className="flex min-h-52 w-full flex-col gap-4 rounded-2xl p-4 shadow-card"
  >
    <div className="flex gap-3">
      <SkeletonCircle className="size-24" />
      <div className="flex flex-1 flex-col gap-3 py-2">
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-14 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
      </div>
    </div>
    <Skeleton className="h-4 w-4/5 rounded" />
  </div>
);

export default AdvisorCardSkeleton;
