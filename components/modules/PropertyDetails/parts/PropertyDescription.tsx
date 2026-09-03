import type { PropertyDescriptionProps } from "@/types/components/modules/property-details";

import _STRINGS from "@/utils/LocalStrings";

// Lifted out of PropertyPrimarySpecs, where it sat collapsed at the bottom of a
// table of floor numbers and ownership types. It is the listing's own words
// about itself and the first thing a guest actually reads.
const PropertyDescription = ({ property }: PropertyDescriptionProps) => {
  const text =
    property?.property_descriptions?.ad_dscr ||
    property?.property_descriptions?.property_dscr;

  if (!text) return <></>;

  return (
    <section className="surface-panel flex flex-col gap-2 p-4 md:p-5">
      <h2 className="text-sm font-bold md:text-base">{_STRINGS.PROP_DESC}</h2>
      <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-800 md:leading-8">
        {text}
      </p>
    </section>
  );
};

export default PropertyDescription;
