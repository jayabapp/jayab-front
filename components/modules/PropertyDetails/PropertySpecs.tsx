import type { PropertySpecsProps } from "@/types/components/modules/property-details";

import PropertyEnvironmentSpecs from "./parts/PropertyEnvironmentSpecs";
import PropertyLocationRow from "./parts/PropertyLocationRow.client";
import PropertyFacilitySpecs from "./parts/PropertyFacilitySpecs";
import PropertyPrimarySpecs from "./parts/PropertyPrimarySpecs";
import PropertyGuestSpecs from "./parts/PropertyGuestSpecs";
import PropertyTermsSpecs from "./parts/PropertyTermsSpecs";
import PropertyRoomSpecs from "./parts/PropertyRoomSpecs";

// One panel holding every spec section as a divided row. Previously each was
// its own bordered card and "گزارش تخلف" was stacked in among them, so a
// destructive utility action looked like one more content section; it is now a
// quiet footer row rendered by PropertyDetailsContent instead.
const PropertySpecs = ({ devices, property }: PropertySpecsProps) => (
  <div className="surface-panel flex w-full flex-col overflow-hidden">
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
  </div>
);

export default PropertySpecs;
