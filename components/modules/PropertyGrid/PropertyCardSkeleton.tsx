import Skeleton from "@elements/Skeleton/Skeleton";

const PropertyCardSkeleton = () => (
  <div className="surface-card flex flex-col gap-3 p-3 sm:p-4" aria-hidden="true">
    <div className="grid w-full grid-cols-[minmax(0,1.35fr)_minmax(7.75rem,0.8fr)] items-stretch gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(10rem,0.8fr)]">
      <div className="flex flex-col gap-2.5 py-1">
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Skeleton className="h-5 w-2/5 rounded" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
        </div>
      </div>
      <Skeleton className="h-full min-h-[7.75rem] w-full rounded-[1.75rem]" />
    </div>
  </div>
);

export default PropertyCardSkeleton;
