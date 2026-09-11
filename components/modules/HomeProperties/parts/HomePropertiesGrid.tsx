import type { HomePropertiesGridProps } from "@/types/components/modules/home";
import { PropertyGrid, PropertyGridSkeleton } from "@modules/PropertyGrid";

import EmptyState from "@elements/EmptyState";

const HOME_GRID_CLASS =
  "grid grid-cols-1 gap-2.5 pb-8 pt-2 md:grid-cols-2 md:gap-4 xl:grid-cols-3";

const HomePropertiesGrid = ({
  data,
  devices,
  middleBanner,
}: HomePropertiesGridProps) => (
  <div className="w-full px-0 self-center">
    <div className="w-full">
      {!data ? (
        <PropertyGridSkeleton className={HOME_GRID_CLASS} />
      ) : data?.length > 0 ? (
        <PropertyGrid
          data={data}
          devices={devices}
          className={HOME_GRID_CLASS}
          banners={middleBanner ? [middleBanner] : []}
        />
      ) : (
        <div className="col-span-full">
          <EmptyState />
        </div>
      )}
    </div>
  </div>
);

export default HomePropertiesGrid;
