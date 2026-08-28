import SkeletonCircle from "@/components/elements/Skeleton/SkeletonCircle";
import Skeleton from "@/components/elements/Skeleton/Skeleton";

export const SuggestionRowSkeleton = () => (
  <div className="flex w-full flex-col gap-3 px-4 py-3" aria-hidden="true">
    {[0, 1, 2, 3].map((item) => (
      <div className="flex items-center gap-3" key={item}>
        <SkeletonCircle className="size-4" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
    ))}
  </div>
);
