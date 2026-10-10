import { PropertyGridSkeleton } from "@modules/PropertyGrid";

import IntlNamespaces from "@/i18n/IntlNamespaces";
import Skeleton from "@elements/Skeleton/Skeleton";

const LandingLoading = () => (
  <IntlNamespaces namespaces={["content"]}>
    <div
      aria-busy="true"
      className="route-enter app-container !overflow-visible"
    >
      <Skeleton className="h-7 w-2/5 rounded" />
      <Skeleton className="mt-3 h-4 w-4/5 rounded" />
      <PropertyGridSkeleton count={9} />
    </div>
  </IntlNamespaces>
);

export default LandingLoading;
