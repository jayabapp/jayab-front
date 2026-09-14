import type { PropertyGridProps } from "@/types/components/modules/property-grid";
import { DEFAULT_GRID_CLASS } from "@/utils/constantss";

import PropertyGridItems from "./PropertyGridItems";

const PropertyGrid = ({
  data,
  banners,
  devices,
  className = DEFAULT_GRID_CLASS,
}: PropertyGridProps) => (
  <div className={className}>
    <PropertyGridItems banners={banners} data={data} devices={devices} />
  </div>
);

export default PropertyGrid;
