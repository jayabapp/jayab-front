import FormInput from "@/components/shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import SinglePopUpSelect from "../shared/Form/SingleSelectPopUpSelect";
import { createPropertySteps } from "@/utils/constantss";

const CreateEditProperty = ({
  values,
  onChange,
}: {
  values: {
    name: string;
    property_type: string;
    national_code: string;
  };
  onChange: (value: string | number | null, key: string) => void;
}) => {
  return (
    <div className="w-full flex flex-col gap-4   ">
      <div className=" w-full flex gap-4  flex-col md:flex-row items-center ">
        <SinglePopUpSelect
          closeOnSelect
          item={{ list: createPropertySteps, title: _STRINGS.PROPERTY_TYPE, isMandatory: true }}
          value={values?.property_type}
          onSelect={(e) => {
            onChange(e, "property_type");
          }}
        />

        <FormInput
          item={{ title: _STRINGS.TOTAL_NAME, isMandatory: true, containerClass: "w-full" }}
          value={values?.name}
          onChangeText={(e) => {
            onChange(e, "name");
          }}
        />
        <FormInput
          item={{ title: _STRINGS.NATIONAL_ID, isMandatory: true, containerClass: "w-full" }}
          value={values?.national_code}
          onChangeText={(e) => {
            onChange(e, "national_code");
          }}
        />
      </div>
    </div>
  );
};

export default CreateEditProperty;
