"use client";

import { useOwnerPropertyOptions } from "@features/owner-property/hooks/useOwnerPropertyOptions";
import type { PropertyEnvironmentFieldsProps } from "@/types/components/modules/owner-property";
import { SingleSelectPopUpSelect as SinglePopUpSelect } from "@elements/Form";
import { MultiLineFormInput } from "@elements/Form";

import FieldCharacterCounter from "./FieldCharacterCounter";
import _STRINGS from "@/utils/LocalStrings";

const DESCRIPTION_MAX_LENGTH = 1024;

const PropertyEnvironmentFields = ({
  values,
  onChange,
}: PropertyEnvironmentFieldsProps) => {
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
          title: _STRINGS.ENV_PATTERN,
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        value={values?.access || ""}
        onSelect={(selected) => onChange(selected, "access")}
        item={{
          isMandatory: true,
          list: patterns?.["ACCESS"] || [],
          title: _STRINGS.ACCESS_ROUTE,
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
          placeholder: _STRINGS.ENVIRONMENT_DESCRIPTION,
          rows: 3,
          title: _STRINGS.ACCESS_ROUTE_DESC,
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        value={values?.neighborhood || ""}
        onSelect={(selected) => onChange(selected, "neighborhood")}
        item={{
          isMandatory: true,
          list: patterns?.["NEIGHBORHOOD"] || [],
          title: _STRINGS.NEIGHBORHOOD_TYPE,
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
          placeholder: _STRINGS.PLACES_DESCRIPTION,
          rows: 3,
          title: _STRINGS.DISTANCETO_POINT,
        }}
      />
    </div>
  );
};

export default PropertyEnvironmentFields;
