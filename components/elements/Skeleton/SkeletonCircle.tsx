import Skeleton from "./Skeleton";

const SkeletonCircle = ({ className = "size-12" }: { className?: string }) => (
  <Skeleton className={`shrink-0 rounded-full ${className}`} />
);

export default SkeletonCircle;
