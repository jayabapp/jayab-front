import SkeletonCircle from "@elements/Skeleton/SkeletonCircle";
import Skeleton from "@elements/Skeleton/Skeleton";

const AdvisorDetailsSkeleton = () => (
  <div aria-hidden="true" className="flex flex-col gap-4 p-4">
    <div className="flex gap-3">
      <SkeletonCircle className="size-24" />
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-5 w-1/2 rounded" />
        <Skeleton className="h-16 rounded" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-11 rounded-full" />
      <Skeleton className="h-11 rounded-full" />
    </div>
    <Skeleton className="h-24 rounded-xl" />
  </div>
);

export default AdvisorDetailsSkeleton;
