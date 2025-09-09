import FormInput from "@/components/shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import SinglePopUpSelect from "../shared/Form/SingleSelectPopUpSelect";
import { createPropertySteps } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import { PropertyService } from "@/api_services/property/property.service";
import FormInputWithExternalUnit from "../shared/Form/FormInputWithExternalUnit";
import { AuthService } from "@/api_services/auth/auth.service";
import { isEmpty } from "lodash";
import MultiLineFormInput from "../shared/Form/MultiLineFormInput";
import Checkbox from "../shared/Form/Checkbox";

export interface CreateProperyStepThree {
  distance_dscr: string | number | null;
  neighborhood: string | number | null;
  pattern_dscr: string | number | null;
  access: string | number | null;
  pattern: string | number | null;
}

const CreateEditPropertyEnvInfo = ({
  values,
  onChange,
}: {
  values: CreateProperyStepThree;
  onChange: (value: string | number | null | boolean, key: string) => void;
}) => {
  const { data: patterns } = useQuery({
    queryFn: () => PropertyService.GetUserPropertyGroup({ group: ["PATTERN", "ACCESS", "NEIGHBORHOOD"] }),
    queryKey: [PropertyService.USER_PROP_OPTIONS_CACHEKEY, "PATTERN", "ACCESS", "NEIGHBORHOOD"],
  });
  // const { data: accessRoutes } = useQuery({
  //   queryFn: () => PropertyService.GetUserPropertyGroup({ group: "ACCESS" }),
  //   queryKey: [PropertyService.USER_PROP_OPTIONS_CACHEKEY, "ACCESS"],
  // });
  // const { data: neighborhoods } = useQuery({
  //   queryFn: () => PropertyService.GetUserPropertyGroup({ group: "NEIGHBORHOOD" }),
  //   queryKey: [PropertyService.USER_PROP_OPTIONS_CACHEKEY, "NEIGHBORHOOD"],
  // });

  return (
    <div className=" w-full gap-5  grid grid-cols-1 md:grid-cols-2   items-center ">
      <SinglePopUpSelect
        closeOnSelect
        item={{ list: patterns?.["PATTERN"] || [], title: _STRINGS.ENV_PATTERN, isMandatory: true }}
        value={values?.pattern || ""}
        onSelect={(e) => {
          onChange(e, "pattern");
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        item={{ list: patterns?.["ACCESS"] || [], title: _STRINGS.ACCESS_ROUTE, isMandatory: true }}
        value={values?.access || ""}
        onSelect={(e) => {
          onChange(e, "access");
        }}
      />
      <MultiLineFormInput
        item={{
          title: _STRINGS.ACCESS_ROUTE_DESC,
          // isMandatory: true,
          containerClass: "w-full relative col-span-full",

          rows: 3,
          extraElement: (
            <div className="absolute font-medium  left-0 top-0">{200 - `${values?.pattern_dscr}`?.length}</div>
          ),
        }}
        value={values?.pattern_dscr || ""}
        onChangeText={(e) => {
          onChange(e, "pattern_dscr");
        }}
      />
      <SinglePopUpSelect
        closeOnSelect
        item={{ list: patterns?.["NEIGHBORHOOD"] || [], title: _STRINGS.NEIGHBORHOOD_TYPE, isMandatory: true }}
        value={values?.neighborhood || ""}
        onSelect={(e) => {
          onChange(e, "neighborhood");
        }}
      />
      <MultiLineFormInput
        item={{
          title: _STRINGS.DISTANCETO_POINT,
          isMandatory: true,
          containerClass: "w-full col-span-full",

          rows: 3,
        }}
        value={values?.distance_dscr || ""}
        onChangeText={(e) => {
          onChange(e, "distance_dscr");
        }}
      />
    </div>
  );
};

export default CreateEditPropertyEnvInfo;
