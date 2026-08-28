import Skeleton from "@/components/elements/Skeleton/Skeleton";

const ReservationCardSkeleton = () => (
  <div
    className="w-full space-y-4 rounded-2xl p-3 shadow-card"
    aria-hidden="true"
  >
    <div className="flex gap-3">
      <Skeleton className="size-24 rounded-xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
    <Skeleton className="h-px" />
    {Array.from({ length: 3 }, (_, index) => (
      <Skeleton key={index} className="h-3 w-full rounded" />
    ))}
    <Skeleton className="h-10 w-full rounded-xl" />
  </div>
);
export default ReservationCardSkeleton;
