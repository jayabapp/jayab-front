import SkeletonCircle from "@/components/elements/Skeleton/SkeletonCircle";
import Skeleton from "@/components/elements/Skeleton/Skeleton";

const ProfileFormSkeleton = () => (
  <div className="flex w-full flex-col gap-6" aria-hidden="true">
    <div className="flex items-center gap-3">
      <SkeletonCircle className="size-20" />
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
    <Skeleton className="h-12 w-full rounded-xl" />
    <Skeleton className="h-12 w-full rounded-xl" />
    <Skeleton className="h-12 w-full rounded-xl" />
  </div>
);

export default ProfileFormSkeleton;
