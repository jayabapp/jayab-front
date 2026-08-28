import SkeletonText from "@/components/elements/Skeleton/SkeletonText";
import Skeleton from "@/components/elements/Skeleton/Skeleton";

const CmsContentSkeleton = ({ withImage = true }: { withImage?: boolean }) => (
  <div
    className="flex w-full flex-col items-center gap-4 p-4"
    aria-busy="true"
    aria-label="در حال دریافت محتوا"
  >
    {withImage ? <Skeleton className="aspect-[1.6] w-60 rounded-xl" /> : null}
    <Skeleton className="h-5 w-1/3 rounded" />
    <SkeletonText lines={4} />
  </div>
);

export default CmsContentSkeleton;
