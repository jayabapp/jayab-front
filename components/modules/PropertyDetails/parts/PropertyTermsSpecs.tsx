import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";
import { SPEC_ACCORDION_ITEM } from "./PropertyPrimarySpecs";

import SimpleAccordion from "@/components/shared/SimpleAccorion";
import PropertyTermsBody from "./PropertyTermsBody.client";
import _STRINGS from "@/utils/LocalStrings";

const PropertyTermsSpecs = ({
  devices,
  property,
}: PropertySpecsSectionProps) => (
  <SimpleAccordion
    title={_STRINGS.PROP_TERMS}
    item={SPEC_ACCORDION_ITEM}
    isOpenFirst={!!devices?.isMobile || !!devices?.isTablet}
  >
    <PropertyTermsBody property={property} />
  </SimpleAccordion>
);

export default PropertyTermsSpecs;
