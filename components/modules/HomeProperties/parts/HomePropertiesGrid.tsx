import type { HomePropertiesGridProps } from "@/types/components/modules/home";
import { PropertyGrid } from "@modules/PropertyGrid";

import HomePropertiesSkeleton from "./HomePropertiesSkeleton";
import EmptyState from "@elements/EmptyState";

// Two columns on a phone rather than one: the showcase card leads with a 4:3
// photo, so a full-width card would be ~380px tall and push the whole grid
// below several folds. Three from md, four from xl.
const HOME_GRID_CLASS =
  "grid grid-cols-2 gap-2.5 pb-8 pt-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4";

const HomePropertiesGrid = ({
  data,
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
          devices={devices}
          variant="showcase"
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
