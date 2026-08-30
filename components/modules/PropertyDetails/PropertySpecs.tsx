import type { PropertySpecsProps } from "@/types/components/modules/property-details";

import PropertyEnvironmentSpecs from "./parts/PropertyEnvironmentSpecs";
import PropertyLocationRow from "./parts/PropertyLocationRow.client";
import PropertyFacilitySpecs from "./parts/PropertyFacilitySpecs";
import PropertyReportRow from "./parts/PropertyReportRow.client";
import PropertyPrimarySpecs from "./parts/PropertyPrimarySpecs";
import PropertyGuestSpecs from "./parts/PropertyGuestSpecs";
import PropertyTermsSpecs from "./parts/PropertyTermsSpecs";
import PropertyRoomSpecs from "./parts/PropertyRoomSpecs";

const PropertySpecs = ({ devices, property }: PropertySpecsProps) => (
  <div className="w-full order-4 md:order-3 flex gap-2 flex-col">
    <PropertyPrimarySpecs property={property} devices={devices} />
    <PropertyGuestSpecs property={property} devices={devices} />
    <PropertyEnvironmentSpecs property={property} devices={devices} />
    <PropertyRoomSpecs property={property} devices={devices} />
    <PropertyFacilitySpecs property={property} devices={devices} />
    <PropertyTermsSpecs property={property} devices={devices} />
    {property?.latitude ? (
      <PropertyLocationRow
        latitude={property?.latitude}
        longitude={property?.longitude}
      />
    ) : null}
    <PropertyReportRow propertyId={property?.id} />
  </div>
);

export default PropertySpecs;
