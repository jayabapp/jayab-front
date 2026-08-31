import Skeleton from "@elements/Skeleton/Skeleton";

const AdvisorProfileFormSkeleton = () => (
  <div aria-hidden="true" className="w-full">
    <Skeleton className="h-12 rounded-xl" />
    <Skeleton className="mt-4 h-40 rounded-xl" />
  </div>
);

export default AdvisorProfileFormSkeleton;
