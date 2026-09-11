import Skeleton from "@elements/Skeleton/Skeleton";

const PropertyCardSkeleton = () => (
  <div className="surface-card flex flex-col gap-2 p-3" aria-hidden="true">
    <div className="grid w-full grid-cols-2 gap-2">
      <div className="flex flex-col justify-between gap-2 py-1">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-3 w-3/5 rounded" />
        <Skeleton className="h-5 w-2/5 rounded-full" />
        <Skeleton className="h-4 w-4/5 rounded" />
      </div>
      <Skeleton className="aspect-square w-full rounded-2xl" />
    </div>
    <Skeleton className="h-6 w-full rounded" />
  </div>
);

export default PropertyCardSkeleton;
