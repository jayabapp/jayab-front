import { DEFAULT_GRID_CLASS } from "@/utils/constantss";

import type { PropertyGridProps } from "@/types/components/modules/property-grid";

import PropertyGridItems from "./PropertyGridItems";

const PropertyGrid = ({
  data,
  banners,
  devices,
  searchParams,
  className = DEFAULT_GRID_CLASS,
}: PropertyGridProps) => (
  <div className={className}>
    <PropertyGridItems
      data={data}
      banners={banners}
      devices={devices}
      searchParams={searchParams}
    />
  </div>
);

export default PropertyGrid;
