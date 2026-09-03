import Skeleton from "@elements/Skeleton/Skeleton";

const PropertyCardSkeleton = () => (
  <div
    className="surface-card flex min-h-48 flex-col justify-between gap-3 p-3 shadow-sm"
    aria-hidden="true"
  >
    <div className="flex gap-3">
      <Skeleton className="h-28 w-2/5 rounded-10" />
      <div className="flex grow flex-col gap-3">
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-3 w-3/5 rounded" />
        <Skeleton className="h-3 w-2/5 rounded" />
      </div>
    </div>
    <Skeleton className="h-8 w-full rounded" />
  </div>
);

export default PropertyCardSkeleton;
