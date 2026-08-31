import Skeleton from "@elements/Skeleton/Skeleton";

const AdvisorSubscriptionSkeleton = () => (
  <div aria-hidden="true" className="w-full">
    <Skeleton className="h-24 rounded-xl" />
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      <Skeleton className="h-52 rounded-2xl" />
      <Skeleton className="h-52 rounded-2xl" />
    </div>
  </div>
);

export default AdvisorSubscriptionSkeleton;
