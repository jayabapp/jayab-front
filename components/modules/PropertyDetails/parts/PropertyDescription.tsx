import type { PropertyDescriptionProps } from "@/types/components/modules/property-details";

import _STRINGS from "@/utils/LocalStrings";
import ClampText from "./ClampText.client";

const PropertyDescription = ({ property }: PropertyDescriptionProps) => {
  const text =
    property?.property_descriptions?.ad_dscr ||
    property?.property_descriptions?.property_dscr;

  if (!text) return <></>;

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-bold text-neutral-900 md:text-base">
        {_STRINGS.PROP_DESC}
      </h3>
      <ClampText lines={2}>{text}</ClampText>
    </section>
  );
};

export default PropertyDescription;
