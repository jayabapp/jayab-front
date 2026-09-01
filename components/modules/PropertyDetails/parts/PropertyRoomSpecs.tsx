import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import { SPEC_ACCORDION_ITEM } from "./PropertyPrimarySpecs";
import SimpleAccordion from "@elements/Accordion/SimpleAccordion.client";
import _STRINGS from "@/utils/LocalStrings";
import SpecRow from "@elements/SpecRow";

const PropertyRoomSpecs = ({
  devices,
  property,
}: PropertySpecsSectionProps) => (
  <SimpleAccordion
    title={_STRINGS.ROOMS_INFO}
    item={SPEC_ACCORDION_ITEM}
    isOpenFirst={!!devices?.isMobile || !!devices?.isTablet}
  >
    <div className="flex items-center flex-col gap-4">
      <SpecRow
        unit={_STRINGS.ROOM}
        title={_STRINGS.ROOM_COUNTS}
        value={property?.bedrooms?.total_bedrooms}
      />

      {property?.bedrooms?.bedrooms?.map((beds, index) => (
        <SpecRow
          value={beds}
          unit={_STRINGS.ADAD}
          key={`bedroom-${index}`}
          title={`${_STRINGS.BED_COUNT_OF_ROOM} ${index + 1}`}
        />
      ))}

      <SpecRow
        unit={_STRINGS.ADAD}
        title={_STRINGS.EXTRA_BED}
        value={property?.bedrooms?.additional_bed}
      />
      <SpecRow
        title={_STRINGS.MASTER_ROOM}
        value={
          property?.bedrooms?.master_room
            ? _STRINGS.HAS
            : _STRINGS.DOSE_NOT_HAVE
        }
      />
      <SpecRow
        title={_STRINGS.SOFA_BED}
        value={
          property?.bedrooms?.sofa_bed ? _STRINGS.HAS : _STRINGS.DOSE_NOT_HAVE
        }
      />

      <div className="flex w-full flex-col gap-3">
        <p className="font-bold">{_STRINGS.WC}</p>
        <SpecRow
          unit={_STRINGS.ADAD}
          title={_STRINGS.WC_IR}
          value={property?.bedrooms?.wc}
        />
        <SpecRow
          unit={_STRINGS.ADAD}
          title={_STRINGS.WC_INTERNATIONAL}
          value={property?.bedrooms?.wc_ir}
        />
      </div>

      <div className="flex w-full flex-col gap-3">
        <p className="font-bold">{_STRINGS.SHOWER}</p>
        <SpecRow
          unit={_STRINGS.ADAD}
          title={_STRINGS.ALL_SHOWER}
          value={property?.bedrooms?.bathroom_general}
        />
        <SpecRow
          unit={_STRINGS.ADAD}
          title={_STRINGS.TUB_SHOWER}
          value={property?.bedrooms?.bathroom_tub}
        />
        <SpecRow
          unit={_STRINGS.ADAD}
          title={_STRINGS.SHOWE_IN_WC}
          value={property?.bedrooms?.bathroom_in_wc}
        />
        <SpecRow
          unit={_STRINGS.ADAD}
          title={_STRINGS.MASTER_SHOWER}
          value={property?.bedrooms?.bathroom_master}
        />
      </div>
    </div>
  </SimpleAccordion>
);

export default PropertyRoomSpecs;
