"use client";

import { usePropertyLocationOptions } from "@features/owner-property/hooks/usePropertyLocationOptions";
import { useOwnerPropertyOptions } from "@features/owner-property/hooks/useOwnerPropertyOptions";
import type { PropertyInitialsFieldsProps } from "@/types/components/modules/owner-property";
import { SingleSelectPopUpSelect as SinglePopUpSelect } from "@elements/Form";
import { randomeTitlePlaceholder } from "@/utils/constantss";
import { FormInputWithExternalUnit } from "@elements/Form";
import { MultiLineFormInput } from "@elements/Form";
import { FormInput } from "@elements/Form";
import { Checkbox } from "@elements/Form";
import { useAuthStore } from "@/store";

import FieldCharacterCounter from "./FieldCharacterCounter";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import sample from "lodash/sample";

const TITLE_MAX_LENGTH = 55;
const DESCRIPTION_MAX_LENGTH = 1024;
const TITLE_LOCKED_STATUSES = [30, 31];

const PropertyInitialsFields = ({
  values,
  status,
  onChange,
}: PropertyInitialsFieldsProps) => {
  const { isAdminSso } = useAuthStore();
  const { data: propertyTypes } = useOwnerPropertyOptions([
    "PROPERTY_TYPE",
    "OWNERSHIP",
    "BUILDING_DIRECTION",
  ]);
  const { provinces, cities, regions } = usePropertyLocationOptions(
    values?.province,
    values?.city,
  );

  return (
    <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 items-center">
      <SinglePopUpSelect
        closeOnSelect
        value={values?.property_type || ""}
        onSelect={(selected) => onChange(selected, "property_type")}
        item={{
          isMandatory: true,
          list: propertyTypes?.["PROPERTY_TYPE"] || [],
          title: _STRINGS.PROPERTY_TYPE,
        }}
      />

      <FormInput
        value={values?.title || ""}
        onChangeText={(entered) => onChange(entered, "title")}
        item={{
          containerClass: "w-full  relative ",
          disabled:
            TITLE_LOCKED_STATUSES.includes(Number(status)) && !isAdminSso,
          extraElement: (
            <FieldCharacterCounter
              max={TITLE_MAX_LENGTH}
              value={values?.title || ""}
              containerClass=" top-0  !bottom-auto"
            />
          ),
          isMandatory: true,
          maxLength: TITLE_MAX_LENGTH,
          placeholder: `${_STRINGS.FOR_EXAMPLE}: ${sample(randomeTitlePlaceholder)}`,
          title: _STRINGS.ADD_TITLE,
        }}
      />

      <FormInputWithExternalUnit
        unit={_STRINGS.METER}
        value={values?.land_area || ""}
        onChangeText={(entered) => onChange(entered, "land_area")}
        item={{
          containerClass: "w-full",
          isMandatory: true,
          keyboard: "number",
          title: _STRINGS.LAND_AREA,
        }}
      />
      <FormInputWithExternalUnit
        unit={_STRINGS.METER}
        value={values?.building_area || ""}
        onChangeText={(entered) => onChange(entered, "building_area")}
        item={{
          containerClass: "w-full",
          isMandatory: true,
          keyboard: "number",
          title: _STRINGS.PROPERTY_AREA,
        }}
      />
      <FormInputWithExternalUnit
        unit={_STRINGS.FLOOR}
        value={values?.floor_count || ""}
        onChangeText={(entered) => onChange(entered, "floor_count")}
        item={{
          containerClass: "w-full",
          isMandatory: true,
          keyboard: "number",
          title: _STRINGS.FLOOR_COUNT,
        }}
      />
      <FormInputWithExternalUnit
        unit={_STRINGS.UNIT}
        value={values?.units_in_floor || ""}
        onChangeText={(entered) => onChange(entered, "units_in_floor")}
        item={{
          containerClass: "w-full",
          isMandatory: true,
          keyboard: "number",
          title: _STRINGS.UNITS_IN_FLOOR,
        }}
      />
      <FormInput
        value={values?.floor || ""}
        onChangeText={(entered) => onChange(entered, "floor")}
        item={{
          containerClass: "w-full",
          isMandatory: true,
          keyboard: "number",
          title: _STRINGS.FLOOR,
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        value={values?.owenershp_type || ""}
        onSelect={(selected) => onChange(selected, "owenershp_type")}
        item={{
          isMandatory: true,
          list: propertyTypes?.["OWNERSHIP"] || [],
          title: _STRINGS.OWNERSHIP,
        }}
      />

      <div
        className={`w-full col-span-full grid grid-cols-1 gap-5 ${
          isEmpty(regions) ? "md:grid-cols-2" : "md:grid-cols-3"
        }`}
      >
        <SinglePopUpSelect
          closeOnSelect
          value={values?.province || ""}
          item={{
            isMandatory: true,
            list: provinces,
            searcheable: true,
            title: _STRINGS.PROVINCE,
          }}
          onSelect={(selected) => {
            onChange(selected, "province");
            onChange(null, "city");
            onChange(null, "region");
          }}
        />
        <SinglePopUpSelect
          closeOnSelect
          value={values?.city || ""}
          item={{
            disable: isEmpty(cities),
            isMandatory: true,
            list: cities,
            searcheable: true,
            title: _STRINGS.CITY,
          }}
          onSelect={(selected) => {
            onChange(selected, "city");
            onChange(null, "region");
          }}
        />
        {isEmpty(regions) ? null : (
          <SinglePopUpSelect
            closeOnSelect
            value={values?.region || ""}
            onSelect={(selected) => onChange(selected, "region")}
            item={{
              disable: isEmpty(regions),
              isMandatory: true,
              list: regions,
              searcheable: true,
              title: _STRINGS.LOCAL,
            }}
          />
        )}
      </div>

      <FormInput
        value={values?.construction_year || ""}
        onChangeText={(entered) => onChange(entered, "construction_year")}
        item={{
          containerClass: "w-full",
          isMandatory: true,
          keyboard: "number",
          maxLength: 4,
          title: _STRINGS.CREATED_AT_YEAR,
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        value={values?.direction || ""}
        onSelect={(selected) => onChange(selected, "direction")}
        item={{
          isMandatory: true,
          list: propertyTypes?.["BUILDING_DIRECTION"] || [],
          title: _STRINGS.BUILDING_DIRECTION,
        }}
      />
      <MultiLineFormInput
        value={values?.address || ""}
        onChangeText={(entered) => onChange(entered, "address")}
        item={{
          containerClass: "w-full relative col-span-full",
          extraElement: (
            <FieldCharacterCounter
              max={DESCRIPTION_MAX_LENGTH}
              value={values?.address || ""}
            />
          ),
          isMandatory: true,
          rows: 3,
          title: _STRINGS.EXACT_ADDRESS,
        }}
      />

      <div className="flex flex-col gap-5 col-span-full">
        <Checkbox
          containerClass="w-full"
          title={_STRINGS.CAN_CHAT_SET}
          isChecked={!!values?.can_chat}
          onSelect={() => onChange(!values?.can_chat, "can_chat")}
        />
        <Checkbox
          containerClass="w-full"
          title={_STRINGS.LOC_ACCESS}
          isChecked={!!values?.location_access}
          onSelect={() => onChange(!values?.location_access, "location_access")}
        />
      </div>
    </div>
  );
};

export default PropertyInitialsFields;
