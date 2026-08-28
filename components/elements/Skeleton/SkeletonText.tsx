import Skeleton from "./Skeleton";

const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="flex w-full flex-col gap-2" aria-hidden="true">
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton
        className={`h-3 rounded ${index === lines - 1 ? "w-2/3" : "w-full"}`}
        key={index}
      />
    ))}
  </div>
);

export default SkeletonText;
