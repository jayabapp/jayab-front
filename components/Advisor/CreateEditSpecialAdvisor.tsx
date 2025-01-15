import { AuthService } from "@/api_services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import SinglePopUpSelect from "../shared/Form/SingleSelectPopUpSelect";
import FormInput from "../shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import { CreateAdvisorDto } from "@/api_services/advisor/advisor.interface";
import { isArray, isEmpty } from "lodash";
import MultyPopUpSelect from "../shared/Form/MultiSelectPopUpSelect";

const CreateEditSpecialAdvisor = ({
  values,
  setValues,
}: {
  values: CreateAdvisorDto & { province: string | number | null };
  setValues: React.Dispatch<
    React.SetStateAction<
      CreateAdvisorDto & {
        province: string | number | null;
      }
    >
  >;
}) => {
  const { data: provinces } = useQuery({
    queryFn: AuthService.GetProvince,
    queryKey: [AuthService.CITIES_CACHEKEY],
  });

  const { data: cities } = useQuery({
    queryFn: () => {
      if (!!values?.province) return AuthService.GetCities({ parentId: values?.province });
      else return [];
    },
    queryKey: [AuthService.CITIES_CHILDEREN_CACHEKEY, values?.province],
  });

  const onChangeMulty = (value: { id: string | number }, key: keyof CreateAdvisorDto) => {
    if (isArray(values?.[key]) && values?.[key]?.map((e) => e?.id)?.includes(value?.id)) {
      setValues((e) => ({
        ...e,
        [key]: isArray(values?.[key]) ? values?.[key]?.filter((e) => e?.id != value?.id) : [],
      }));
    } else {
      setValues((e) => ({ ...e, [key]: isArray(values?.[key]) ? [...values?.[key], value] : [] }));
    }
  };

  const onChange = (value: string | number | null | boolean, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };
  return (
    <div className="flex flex-col w-full gap-3">
      <FormInput
        item={{ title: _STRINGS.ADD_TITLE, isMandatory: true, containerClass: "w-full" }}
        value={values?.full_name || ""}
        onChangeText={(e) => {
          onChange(e, "title");
        }}
      />
      <FormInput
        item={{
          title: _STRINGS.NATIONAL_CODE,
          isMandatory: true,
          containerClass: "w-full",
          direction: "ltr",
          inputClass: "ltr text-left",
          maxLength: 10,
        }}
        value={values?.national_code || ""}
        onChangeText={(e) => {
          onChange(e, "national_code");
        }}
      />

      <div className="w-full flex items-center">
        {" "}
        <SinglePopUpSelect
          closeOnSelect
          item={{ list: provinces || [], title: _STRINGS.PROVINCE, isMandatory: true }}
          value={values?.province || ""}
          onSelect={(e) => {
            onChange(e, "province");
          }}
        />
        <MultyPopUpSelect
          onSelect={(e) => {
            onChangeMulty(e, "cityIds");
          }}
          value={values?.cityIds}
          title={_STRINGS.SELECT_ACTIVE_CITIES}
          item={{ list: cities || [], full_item: true }}
        />
      </div>
    </div>
  );
};

export default CreateEditSpecialAdvisor;
