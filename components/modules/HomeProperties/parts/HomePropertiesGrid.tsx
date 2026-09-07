import type { HomePropertiesGridProps } from "@/types/components/modules/home";
import { PropertyGrid } from "@modules/PropertyGrid";

import HomePropertiesSkeleton from "./HomePropertiesSkeleton";
import EmptyState from "@elements/EmptyState";

// One column on a phone. The listing card is horizontal — photo beside text —
// so two of them on a 390px screen leave each photo about 80px wide and the
// title squeezed to three or four characters a line. Two from md, three from
// xl, matching `/rooms` so the same card is not laid out two different ways.
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
        <HomePropertiesSkeleton />
      ) : data?.length > 0 ? (
        <PropertyGrid
          data={data}
          devices={devices}
          variant="compact"
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
