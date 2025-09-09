import FormInput from "@/components/shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import SinglePopUpSelect from "../shared/Form/SingleSelectPopUpSelect";
import { createPropertySteps, randomeTitlePlaceholder } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import { PropertyService } from "@/api_services/property/property.service";
import FormInputWithExternalUnit from "../shared/Form/FormInputWithExternalUnit";
import { AuthService } from "@/api_services/auth/auth.service";
import { isEmpty, random, sample } from "lodash";
import MultiLineFormInput from "../shared/Form/MultiLineFormInput";
import Checkbox from "../shared/Form/Checkbox";
import { CityService } from "@/api_services/city/city.service";

export interface CreateProperyStepOne {
  title: string | number | null;
  property_type: string | number | null;
  floor_count: string | number | null;
  building_area: string | number | null;
  land_area: string | number | null;
  units_in_floor: string | number | null;
  owenershp_type: string | number | null;
  floor: string | number | null;
  province: string | number | null;
  city: string | number | null;
  construction_year: string | number | null;
  direction: string | number | null;
  address: string | number | null;
  can_chat: boolean | null;
  location_access: boolean | null;
}

const CreateEditProperty = ({
  values,
  onChange,
}: {
  values: CreateProperyStepOne;
  onChange: (value: string | number | null | boolean, key: string) => void;
}) => {
  const { data: propertyTypes } = useQuery({
    queryFn: () =>
      PropertyService.GetUserPropertyGroup({ group: ["PROPERTY_TYPE", "OWNERSHIP", "BUILDING_DIRECTION"] }),
    queryKey: [PropertyService.USER_PROP_OPTIONS_CACHEKEY, "PROPERTY_TYPE", "OWNERSHIP", "BUILDING_DIRECTION"],
  });
  // const { data: ownershipTypes } = useQuery({
  //   queryFn: () => PropertyService.GetUserPropertyGroup({ group: "OWNERSHIP" }),
  //   queryKey: [PropertyService.USER_PROP_OPTIONS_CACHEKEY, "OWNERSHIP"],
  // });
  // const { data: buildingDirection } = useQuery({
  //   queryFn: () => PropertyService.GetUserPropertyGroup({ group: "BUILDING_DIRECTION" }),
  //   queryKey: [PropertyService.USER_PROP_OPTIONS_CACHEKEY, "BUILDING_DIRECTION"],
  // });

  const { data: provinces } = useQuery({
    queryFn: () => CityService.GetAllCities({ is_parent: "1" }),
    queryKey: [CityService.CITIES_CHILDEREN_CACHEKEY, "is_parent"],
  });

  const { data: cities } = useQuery({
    queryFn: () => {
      if (!!values?.province) return CityService.GetCities({ parentId: values?.province });
      else return [];
    },
    queryKey: [CityService.CITIES_CHILDEREN_CACHEKEY, values?.province],
  });
  console.log(sample(randomeTitlePlaceholder), "randomeTitlePlaceholder.slice(random(5), random(4))?.map((e) => e)");

  return (
    <div className=" w-full gap-5  grid grid-cols-1 md:grid-cols-2   items-center ">
      <SinglePopUpSelect
        closeOnSelect
        item={{ list: propertyTypes?.["PROPERTY_TYPE"] || [], title: _STRINGS.PROPERTY_TYPE, isMandatory: true }}
        value={values?.property_type || ""}
        onSelect={(e) => {
          onChange(e, "property_type");
        }}
      />

      <FormInput
        item={{
          title: _STRINGS.ADD_TITLE,
          placeholder: `مثال: ${sample(randomeTitlePlaceholder)}`,
          isMandatory: true,
          containerClass: "w-full",
        }}
        value={values?.title || ""}
        onChangeText={(e) => {
          onChange(e, "title");
        }}
      />
      <FormInputWithExternalUnit
        unit={_STRINGS.METER}
        item={{ title: _STRINGS.LAND_AREA, isMandatory: true, containerClass: "w-full", keyboard: "number" }}
        value={values?.land_area || ""}
        onChangeText={(e) => {
          onChange(e, "land_area");
        }}
      />
      <FormInputWithExternalUnit
        unit={_STRINGS.METER}
        item={{ title: _STRINGS.PROPERTY_AREA, isMandatory: true, containerClass: "w-full", keyboard: "number" }}
        value={values?.building_area || ""}
        onChangeText={(e) => {
          onChange(e, "building_area");
        }}
      />
      <FormInputWithExternalUnit
        unit={_STRINGS.FLOOR}
        item={{ title: _STRINGS.FLOOR_COUNT, isMandatory: true, containerClass: "w-full", keyboard: "number" }}
        value={values?.floor_count || ""}
        onChangeText={(e) => {
          onChange(e, "floor_count");
        }}
      />
      <FormInputWithExternalUnit
        unit={_STRINGS.UNIT}
        item={{ title: _STRINGS.UNITS_IN_FLOOR, isMandatory: true, containerClass: "w-full", keyboard: "number" }}
        value={values?.units_in_floor || ""}
        onChangeText={(e) => {
          onChange(e, "units_in_floor");
        }}
      />
      <FormInput
        item={{ title: _STRINGS.FLOOR, isMandatory: true, containerClass: "w-full", keyboard: "number" }}
        value={values?.floor || ""}
        onChangeText={(e) => {
          onChange(e, "floor");
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        item={{ list: propertyTypes?.["OWNERSHIP"] || [], title: _STRINGS.OWNERSHIP_TYPE, isMandatory: true }}
        value={values?.owenershp_type || ""}
        onSelect={(e) => {
          onChange(e, "owenershp_type");
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        item={{ list: provinces || [], title: _STRINGS.PROVINCE, isMandatory: true }}
        value={values?.province || ""}
        onSelect={(e) => {
          onChange(e, "province");
          onChange(null, "city");
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        item={{ list: cities || [], title: _STRINGS.CITY, isMandatory: true, disable: isEmpty(cities) }}
        value={values?.city || ""}
        onSelect={(e) => {
          onChange(e, "city");
        }}
      />
      <FormInput
        item={{
          title: _STRINGS.CREATED_AT_YEAR,
          isMandatory: true,
          containerClass: "w-full",
          keyboard: "number",
          maxLength: 4,
        }}
        value={values?.construction_year || ""}
        onChangeText={(e) => {
          onChange(e, "construction_year");
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        item={{
          list: propertyTypes?.["BUILDING_DIRECTION"] || [],
          title: _STRINGS.BUILDING_DIRECTION,
          isMandatory: true,
        }}
        value={values?.direction || ""}
        onSelect={(e) => {
          onChange(e, "direction");
        }}
      />
      <MultiLineFormInput
        item={{
          title: _STRINGS.EXACT_ADDRESS,
          isMandatory: true,
          containerClass: "w-full col-span-full",

          rows: 3,
        }}
        value={values?.address || ""}
        onChangeText={(e) => {
          onChange(e, "address");
        }}
      />

      <div className="flex flex-col gap-5 col-span-full">
        {" "}
        <Checkbox
          containerClass="w-full"
          isChecked={!!values?.can_chat}
          onSelect={() => {
            onChange(!values?.can_chat, "can_chat");
          }}
          title={_STRINGS.CAN_CHAT_SET}
        />
        <Checkbox
          title={_STRINGS.LOC_ACCESS}
          containerClass="w-full"
          isChecked={!!values?.location_access}
          onSelect={() => {
            onChange(!values?.location_access, "location_access");
          }}
        />
      </div>
    </div>
  );
};

export default CreateEditProperty;
