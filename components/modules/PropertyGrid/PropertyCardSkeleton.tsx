import Skeleton from "@elements/Skeleton/Skeleton";

const PropertyCardSkeleton = () => (
  <div className="surface-card flex flex-col gap-3 p-3 sm:p-4" aria-hidden="true">
    <div className="grid w-full grid-cols-[minmax(0,1.35fr)_minmax(7.75rem,0.8fr)] items-stretch gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(10rem,0.8fr)]">
      <div className="flex flex-col gap-2.5 py-1">
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="mt-auto h-5 w-2/5 rounded" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="aspect-square w-full rounded-[1.75rem]" />
        <Skeleton className="h-7 w-3/4 rounded" />
      </div>
    </div>
  </div>
);

export default PropertyCardSkeleton;
