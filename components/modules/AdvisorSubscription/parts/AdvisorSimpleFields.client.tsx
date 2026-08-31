"use client";

import type { AdvisorFieldsProps } from "@/types/components/modules/advisors";
import { FormInput } from "@elements/Form";

import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";

const MainUploader = dynamic(() => import("@/components/uploader"));

const UPLOAD_BOX =
  "!bg-white  !border !border-dashed   w-24 h-24 !border-neutral-300 ";

const AdvisorSimpleFields = ({ values, setValues }: AdvisorFieldsProps) => {
  const onChange = (value: unknown, key: string) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="w-full flex items-center flex-col gap-3 md:gap-4 md:flex-row">
        <FormInput
          value={values?.full_name || ""}
          onChangeText={(entered) => onChange(entered, "full_name")}
          item={{
            containerClass: "w-full",
            isMandatory: true,
            title: _STRINGS.FULL_NAME,
          }}
        />
      </div>

      <div className="w-full flex items-center justify-center flex-col">
        <p className="w-full text-start text-sm md:text-base">
          {_STRINGS.YOUR_IMAGE}
        </p>
        <MainUploader
          withCrop
          title={_STRINGS.IMAGE}
          key="advisor-profile-image"
          item={values?.profile_image}
          link="/attachments?type=PROFILE"
          innerClasses={{ sizeClass: UPLOAD_BOX }}
          onDelete={() => onChange(null, "profile_image")}
          onSelect={(file) => onChange(file, "profile_image")}
          containerClass="my-3 !w-full flex items-start justify-start"
        />
      </div>
    </div>
  );
};

export default AdvisorSimpleFields;
