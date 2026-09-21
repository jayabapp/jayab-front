import { PropertyDetailsContent } from "@modules/PropertyDetails";
import { ScrollToTopOnMount } from "@elements/ScrollToTop";
import { PageSurface } from "@elements/PageSurface";

import type { PropertyDetailsTemplateProps } from "@/types/components/templates/property-details";

const PropertyDetailsTemplate = ({
  schema,
  devices,
  property,
}: PropertyDetailsTemplateProps) => (
  <div className="container flex !h-auto flex-col !overflow-x-visible !pb-48 lg:!pb-36">
    <PageSurface />
    <ScrollToTopOnMount />
    {schema}
    <PropertyDetailsContent property={property} devices={devices} />
  </div>
);

export default PropertyDetailsTemplate;
