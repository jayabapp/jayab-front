import type { PropertyGridSkeletonProps } from "@/types/components/modules/property-grid";
import { DEFAULT_GRID_CLASS_PROPERTY } from "@/utils/constantss";

import PropertyCardSkeleton from "./PropertyCardSkeleton";

const DEFAULT_SKELETON_COUNT = 6;

const PropertyGridSkeleton = ({
  className = DEFAULT_GRID_CLASS_PROPERTY,
  count = DEFAULT_SKELETON_COUNT,
}: PropertyGridSkeletonProps) => (
  <div className={className}>
    {Array.from({ length: count }, (_, index) => (
      <PropertyCardSkeleton key={index} />
    ))}
  </div>
);

export default PropertyGridSkeleton;
