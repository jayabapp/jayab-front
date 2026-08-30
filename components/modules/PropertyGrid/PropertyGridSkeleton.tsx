import type { PropertyGridSkeletonProps } from "@/types/components/modules/property-grid";

import PropertyCardSkeleton from "./PropertyCardSkeleton";

const DEFAULT_SKELETON_COUNT = 6;
const DEFAULT_GRID_CLASS =
  "grid grid-cols-1 gap-2 px-3 pt-4 md:grid-cols-2 md:gap-4 xl:grid-cols-3";

const PropertyGridSkeleton = ({
  className = DEFAULT_GRID_CLASS,
  count = DEFAULT_SKELETON_COUNT,
}: PropertyGridSkeletonProps) => (
  <div className={className}>
    {Array.from({ length: count }, (_, index) => (
      <PropertyCardSkeleton key={index} />
    ))}
  </div>
);

export default PropertyGridSkeleton;
