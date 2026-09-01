"use client";

import type { PropertyTermsBodyProps } from "@/types/components/modules/property-details";
import { useContentList } from "@features/home/hooks/useContentList";
import { Checkbox } from "@elements/Form";

import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@elements/CmsText";

const PROPERTY_RULES_KEY = "propertyRules";

const PropertyTermsBody = ({
  className = "",
  enabled = true,
  prologueClass = " text-sm font-medium ",
  property,
}: PropertyTermsBodyProps) => {
  const { items: propertyRules } = useContentList(
    { key: PROPERTY_RULES_KEY, page: 1 },
    enabled,
  );
  const selectedRule = propertyRules.find(
    (rule) => rule?.key === property?.canceling_type?.id,
  );

  return (
    <div
      className={`w-full h-full flex flex-col items-start justify-start gap-4 bg-white md:rounded-md ${className}`}
    >
      <p className={prologueClass}>{_STRINGS.PROP_TERMS_PROLUGE}</p>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">{_STRINGS.CANCENLATION_DESC}</p>
        <CmsText className="text-sm text-justify content">
          {selectedRule?.small_text}
        </CmsText>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">{_STRINGS.GUEST_TYPE_STATUS}</p>
        {property?.options?.guest_type?.map((guestType) => (
          <Checkbox
            isChecked
            disabled
            title={guestType}
            onSelect={() => {}}
            key={guestType}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">{_STRINGS.ANIMAL_RULES}</p>
        <p className="text-sm">{property?.options?.pet}</p>
        <CmsText className="text-sm text-justify content">
          {property?.property_descriptions?.pet_dscr}
        </CmsText>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">{_STRINGS.PARTY_RULES}</p>
        <p className="text-sm">{property?.options?.party}</p>
        <CmsText className="text-sm text-justify content">
          {property?.property_descriptions?.party_dscr}
        </CmsText>
      </div>

      <div className="w-full flex items-center gap-8">
        <div className="flex flex-row gap-2">
          <p className="text-sm font-bold">{_STRINGS.ENTER_HOUR} :</p>
          <p className="text-sm">{property?.check_in_hour}</p>
        </div>
        <div className="flex flex-row gap-2">
          <p className="text-sm font-bold">{_STRINGS.END_HOUR} :</p>
          <p className="text-sm">{property?.check_out_hour}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">{_STRINGS.REQUIRED_DOCS}</p>
        <CmsText className="text-sm">
          {property?.property_descriptions?.doc_dscr}
        </CmsText>
      </div>

      {property?.property_descriptions?.other_dscr ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">{_STRINGS.OTHER_TERMS}</p>
          <CmsText className="text-sm text-justify content">
            {property?.property_descriptions?.other_dscr}
          </CmsText>
        </div>
      ) : null}
    </div>
  );
};

export default PropertyTermsBody;
