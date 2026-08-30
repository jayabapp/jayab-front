import type { HomePropertiesGridProps } from "@/types/components/modules/home";
import { PropertyGrid } from "@modules/PropertyGrid";

import HomePropertiesSkeleton from "./HomePropertiesSkeleton";
import EmptyState from "@elements/EmptyState";

const HOME_GRID_CLASS =
  "grid pb-8 pt-2 md:pt-2 grid-cols-1 gap-2 md:gap-4 md:grid-cols-2 xl:grid-cols-4";

const HomePropertiesGrid = ({
  data,
  week,
  devices,
  middleBanner,
}: HomePropertiesGridProps) => (
  <div className="w-full px-0 self-center">
    <div className="w-full">
      {!data ? (
        <HomePropertiesSkeleton />
      ) : data?.length > 0 ? (
        <PropertyGrid
          data={data}
          week={week}
          devices={devices}
          className={HOME_GRID_CLASS}
          banners={middleBanner ? [middleBanner] : []}
        />
      ) : (
        <div className="col-span-4">
          <EmptyState />
        </div>
      )}
    </div>
  </div>
);

export default HomePropertiesGrid;
