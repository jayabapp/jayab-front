import type { PropertyDescriptionProps } from "@/types/components/modules/property-details";

import ClampText from "./ClampText.client";

const PropertyDescription = ({ property }: PropertyDescriptionProps) => {
  const field = property?.property_descriptions?.ad_dscr
    ? "ad_dscr"
    : "property_dscr";
  const text = property?.property_descriptions?.[field];
  if (!text) return <></>;
  return (
    <ClampText
      lines={4}
      className="text-base leading-8"
      lang={property?.description_locales?.[field]}
    >
      {text}
    </ClampText>
  );
};

export default PropertyDescription;
