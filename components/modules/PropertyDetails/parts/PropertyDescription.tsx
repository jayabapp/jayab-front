import type { PropertyDescriptionProps } from "@/types/components/modules/property-details";

import ClampText from "./ClampText.client";

const PropertyDescription = ({ property }: PropertyDescriptionProps) => {
  const text =
    property?.property_descriptions?.ad_dscr ||
    property?.property_descriptions?.property_dscr;
  if (!text) return <></>;
  return (
    <ClampText lines={4} className="text-base leading-8">
      {text}
    </ClampText>
  );
};

export default PropertyDescription;
