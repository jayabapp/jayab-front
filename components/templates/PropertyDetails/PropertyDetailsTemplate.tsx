import { PropertyDetailsContent } from "@modules/PropertyDetails";
import { ScrollToTopOnMount } from "@elements/ScrollToTop";
import { PageSurface } from "@elements/PageSurface";

import type { PropertyDetailsTemplateProps } from "@/types/components/templates/property-details";

const PropertyDetailsTemplate = ({
  schema,
  devices,
  property,
}: PropertyDetailsTemplateProps) => (
  <div className="listing-page container flex !h-auto flex-col !overflow-x-visible !bg-surface md:!pb-36 xl:!px-4">
    <PageSurface />
    <ScrollToTopOnMount />
    {schema}
    <PropertyDetailsContent property={property} devices={devices} />
  </div>
);

export default PropertyDetailsTemplate;
