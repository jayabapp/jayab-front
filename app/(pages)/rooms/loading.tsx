import { GRID_CLASS } from "@/utils/constantss";

import PropertyGridSkeleton from "@modules/PropertyGrid/PropertyGridSkeleton";

const RoomsLoading = () => (
  <div aria-busy="true" className="route-enter app-container !overflow-visible">
    <PropertyGridSkeleton className={GRID_CLASS} count={9} />
  </div>
);

export default RoomsLoading;
