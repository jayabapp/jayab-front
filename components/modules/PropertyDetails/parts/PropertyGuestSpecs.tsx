import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import { SPEC_ACCORDION_ITEM } from "./PropertyPrimarySpecs";

import SimpleAccordion from "@elements/Accordion/SimpleAccordion.client";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import SpecRow from "@elements/SpecRow";

const PropertyGuestSpecs = ({
  devices,
  property,
}: PropertySpecsSectionProps) => (
  <SimpleAccordion
    item={SPEC_ACCORDION_ITEM}
    title={_STRINGS.GUEST_CAP_AND_EXTRA_COSTS}
    isOpenFirst={!!devices?.isMobile || !!devices?.isTablet}
  >
    <div className="flex items-center flex-col gap-4">
      <div className="flex w-full flex-col gap-3">
        <p className="font-bold">{_STRINGS.GUEST_CAP}</p>
        <SpecRow
          unit={_STRINGS.NAFAR}
          value={property?.std_capacity}
          title={_STRINGS.STANDARD_GUEST_CAP}
        />
        <SpecRow
          unit={_STRINGS.NAFAR}
          value={property?.max_capacity}
          title={_STRINGS.MAX_GUEST_CAP}
        />
      </div>

      <div className="flex w-full flex-col gap-3">
        <p className="font-bold">{_STRINGS.EXTRA_COSTS}</p>
        <SpecRow
          unit={_STRINGS.TOMAN}
          title={_STRINGS.EXTRA_GUEST_PRICE}
          value={numberWithCommas(property?.daily_price?.additional_person)}
        />
        <SpecRow
          unit={_STRINGS.TOMAN}
          title={_STRINGS.CLEANING_PRiCE}
          value={numberWithCommas(property?.daily_price?.cleaning)}
        />
      </div>

      <div className="flex w-full flex-col gap-3">
        <p className="font-bold">{_STRINGS.RENT_TYPE}</p>
        <SpecRow
          title={_STRINGS.PROP_RENT_TYPE}
          value={property?.rent_type === "DAILY" ? _STRINGS.DAILY : ""}
        />
      </div>
    </div>
  </SimpleAccordion>
);

export default PropertyGuestSpecs;
