import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import { SPEC_ACCORDION_ITEM } from "./PropertyPrimarySpecs";

import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import SpecRow from "@elements/SpecRow";

const PropertyEnvironmentSpecs = ({
  devices,
  property,
}: PropertySpecsSectionProps) => (
  <SimpleAccordion
    title={_STRINGS.ENV_INFO}
    item={SPEC_ACCORDION_ITEM}
    isOpenFirst={!!devices?.isMobile || !!devices?.isTablet}
  >
    <div className="flex items-center flex-col gap-4">
      <SpecRow
        title={_STRINGS.ENV_PATTERN}
        value={property?.options?.pattern}
      />
      <SpecRow
        title={_STRINGS.ACCESS_ROUTE}
        value={property?.options?.access}
      />
      <div className="flex w-full flex-col items-start justify-start gap-2">
        <p className="text-sm font-medium">{_STRINGS.ACCSESS_ROUTE_DESC}</p>
        <p className="font-medium whitespace-pre-wrap">
          {property?.property_descriptions?.pattern_dscr}
        </p>
      </div>
      <SpecRow
        title={_STRINGS.PROP_NEIGHTBOUR}
        value={property?.options?.neighborhood}
      />
      <div className="flex w-full flex-col items-start justify-start gap-2">
        <p className="text-sm font-medium">{_STRINGS.DISTANCETO_POINT}</p>
        <p className="font-medium whitespace-pre-wrap">
          {property?.property_descriptions?.distance_dscr}
        </p>
      </div>
    </div>
  </SimpleAccordion>
);

export default PropertyEnvironmentSpecs;
