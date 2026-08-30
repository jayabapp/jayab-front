import type { PropertyDetailsTemplateProps } from "@/types/components/templates/property-details";
import { PropertyDetailsContent } from "@modules/PropertyDetails";

const PropertyDetailsTemplate = ({
  schema,
  devices,
  property,
}: PropertyDetailsTemplateProps) => (
  <div className="!pb-48 lg:!pb-36 gap-4 justify-start items-start container grid grid-cols-1 md:grid-cols-2 !h-auto !overflow-x-visible">
    {schema}
    <PropertyDetailsContent property={property} devices={devices} />
  </div>
);

export default PropertyDetailsTemplate;
