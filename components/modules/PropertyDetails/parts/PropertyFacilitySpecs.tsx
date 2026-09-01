import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";
import type { TOptionGroup } from "@/types/components/modules/property-details";
import { SPEC_ACCORDION_ITEM } from "./PropertyPrimarySpecs";

import SimpleAccordion from "@elements/Accordion/SimpleAccordion.client";
import _STRINGS from "@/utils/LocalStrings";
import SpecRow from "@elements/SpecRow";
import SpecOption from "./SpecOption";

const OptionGroup = ({ options, title }: TOptionGroup) =>
  options?.length ? (
    <div className="flex w-full flex-col gap-3">
      <p className="font-bold">{title}</p>
      <div className="flex w-full flex-wrap gap-3">
        {options.map((option) => (
          <SpecOption title={option} key={`${title}-${option}`} />
        ))}
      </div>
    </div>
  ) : null;

const PropertyFacilitySpecs = ({
  devices,
  property,
}: PropertySpecsSectionProps) => (
  <SimpleAccordion
    item={SPEC_ACCORDION_ITEM}
    title={_STRINGS.PROPERTY_FACILITIES}
    isOpenFirst={!!devices?.isMobile || !!devices?.isTablet}
  >
    <div className="flex items-center flex-col gap-4">
      <SpecRow
        title={_STRINGS.POOL_STATUS}
        value={property?.has_pool ? _STRINGS.HAS_POOL : _STRINGS.NO_POOL}
      />
      {property?.has_pool ? (
        <OptionGroup
          title={_STRINGS.POOL_TYPE}
          options={property?.options?.pool_type}
        />
      ) : null}
      <OptionGroup
        title={_STRINGS.ENTERTAINMENT}
        options={property?.options?.entertainment}
      />
      <OptionGroup
        title={_STRINGS.KITCHEN_ACC}
        options={property?.options?.kitchen}
      />
      <OptionGroup
        title={_STRINGS.COOL_HEAT}
        options={property?.options?.cool_heat}
      />
      <OptionGroup
        title={_STRINGS.WELFARE}
        options={property?.options?.welfare}
      />

      {property?.property_descriptions?.facility_dscr ? (
        <div className="flex w-full flex-col items-start justify-start gap-2">
          <p className="text-sm font-medium">{_STRINGS.OTHER_ACCS}</p>
          <p className="font-medium">
            {property?.property_descriptions?.facility_dscr}
          </p>
        </div>
      ) : null}
    </div>
  </SimpleAccordion>
);

export default PropertyFacilitySpecs;
