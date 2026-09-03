import { PropertyGridSkeleton } from "@modules/PropertyGrid";

import Skeleton from "@elements/Skeleton/Skeleton";

// Landing pages render the same discovery grid as /rooms, with a CMS intro
// block above it.
const LandingLoading = () => (
  <div aria-busy="true" className="route-enter app-container !overflow-visible">
    <Skeleton className="h-7 w-2/5 rounded" />
    <Skeleton className="mt-3 h-4 w-4/5 rounded" />
    <PropertyGridSkeleton count={9} />
  </div>
);

export default LandingLoading;
