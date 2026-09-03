// Imported from the skeleton file rather than the module barrel on purpose: a
// route loading boundary is evaluated during prerender, and going through the
// index would drag the module's client islands and feature hooks into that
// graph for the sake of one static component.
import PropertyGridSkeleton from "@modules/PropertyGrid/PropertyGridSkeleton";

const RoomsLoading = () => (
  <div aria-busy="true" className="route-enter app-container !overflow-visible">
    <PropertyGridSkeleton count={9} />
  </div>
);

export default RoomsLoading;
