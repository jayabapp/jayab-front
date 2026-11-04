import Skeleton from "@elements/Skeleton/Skeleton";

const PropertyCardSkeleton = ({ owner = false }: { owner?: boolean }) => owner ? (
  <div className="surface-card flex flex-col gap-3 p-3" aria-hidden="true">
    <Skeleton className="aspect-video w-full rounded-2xl" />
    <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface-muted p-3 sm:border-0 sm:bg-transparent sm:px-1">
      <Skeleton className="h-5 w-4/5 rounded" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <Skeleton className="mt-2 h-5 w-3/4 rounded" />
    </div>
    <Skeleton className="h-10 w-full rounded-10" />
  </div>
) : (
  <div className="property-card-shadow relative w-full overflow-hidden rounded-20 bg-surface p-3" aria-hidden="true">
    <div className="grid w-full grid-cols-5 gap-3">
      <div className="order-1 col-span-3 flex min-h-0 flex-col justify-between py-1">
        <Skeleton className="h-10 w-full rounded" />
        <div className="flex flex-col gap-3.5">
          <Skeleton className="h-4 w-3/5 rounded" />
          <Skeleton className="h-9 w-4/5 rounded" />
        </div>
        <div className="flex items-end justify-between gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
        </div>
      </div>

      <Skeleton className="order-2 col-span-2 aspect-square w-full rounded-2xl" />
    </div>
  </div>
);

export default PropertyCardSkeleton;
