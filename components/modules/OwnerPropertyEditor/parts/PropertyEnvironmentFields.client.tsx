"use client";

import { SingleSelectPopUpSelect as SinglePopUpSelect } from "@elements/Form";
import { useOwnerPropertyOptions } from "@features/owner-property/hooks/useOwnerPropertyOptions";
import { MultiLineFormInput } from "@elements/Form";
import { useTranslations } from "next-intl";

import type { PropertyEnvironmentFieldsProps } from "@/types/components/modules/owner-property";

import FieldCharacterCounter from "./FieldCharacterCounter";

const DESCRIPTION_MAX_LENGTH = 1024;

const PropertyEnvironmentFields = ({
  values,
  onChange,
}: PropertyEnvironmentFieldsProps) => {
  const t = useTranslations();

  const { data: patterns } = useOwnerPropertyOptions([
    "PATTERN",
    "ACCESS",
    "NEIGHBORHOOD",
  ]);

  return (
    <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 items-center">
      <SinglePopUpSelect
        closeOnSelect
        value={values?.pattern || ""}
        onSelect={(selected) => onChange(selected, "pattern")}
        item={{
          isMandatory: true,
          list: patterns?.["PATTERN"] || [],
          title: t("common.envPattern"),
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        value={values?.access || ""}
        onSelect={(selected) => onChange(selected, "access")}
        item={{
          isMandatory: true,
          list: patterns?.["ACCESS"] || [],
          title: t("common.accessRoute"),
        }}
      />
      <MultiLineFormInput
        value={values?.pattern_dscr || ""}
        onChangeText={(entered) => onChange(entered, "pattern_dscr")}
        item={{
          containerClass: "w-full relative col-span-full",
          extraElement: (
            <FieldCharacterCounter
              max={DESCRIPTION_MAX_LENGTH}
              value={values?.pattern_dscr || ""}
            />
          ),
          placeholder: t("owner.environmentDescription"),
          rows: 3,
          title: t("owner.accessRouteDesc"),
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        value={values?.neighborhood || ""}
        onSelect={(selected) => onChange(selected, "neighborhood")}
        item={{
          isMandatory: true,
          list: patterns?.["NEIGHBORHOOD"] || [],
          title: t("owner.neighborhoodType"),
        }}
      />
      <MultiLineFormInput
        value={values?.distance_dscr || ""}
        onChangeText={(entered) => onChange(entered, "distance_dscr")}
        item={{
          containerClass: "w-full relative col-span-full",
          extraElement: (
            <FieldCharacterCounter
              max={DESCRIPTION_MAX_LENGTH}
              value={values?.distance_dscr || ""}
            />
          ),
          isMandatory: true,
          placeholder: t("owner.placesDescription"),
          rows: 3,
          title: t("common.distancetoPoint"),
        }}
      />
    </div>
  );
};

export default PropertyEnvironmentFields;
