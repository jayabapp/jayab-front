import type { PropertyGridProps } from "@/types/components/modules/property-grid";

import PropertyGridItems from "./PropertyGridItems";

const DEFAULT_GRID_CLASS =
  "grid grid-cols-1 gap-2 overflow-hidden px-1 pb-8 pt-4 md:grid-cols-2 md:gap-4 md:pt-2 xl:grid-cols-3";

const PropertyGrid = ({
  data,
  week,
  banners,
  devices,
  variant,
  className = DEFAULT_GRID_CLASS,
}: PropertyGridProps) => (
  <div className={className}>
    <PropertyGridItems
      banners={banners}
      data={data}
      devices={devices}
      variant={variant}
      week={week}
    />
  </div>
);

export default PropertyGrid;
