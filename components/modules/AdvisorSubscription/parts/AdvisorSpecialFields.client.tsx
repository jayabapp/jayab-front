"use client";

import { useAdvisorLocations } from "@features/advisors/hooks/useAdvisorLocations";
import type { AdvisorFieldsProps } from "@/types/components/modules/advisors";
import { SingleSelectPopUpSelect as SinglePopUpSelect } from "@elements/Form";
import { MultiSelectPopUpSelect as MultyPopUpSelect } from "@elements/Form";
import { MultiLineFormInput } from "@elements/Form";
import { FormInput } from "@elements/Form";

import _STRINGS from "@/utils/LocalStrings";
import isArray from "lodash/isArray";
import dynamic from "next/dynamic";

const MainUploader = dynamic(() => import("@/components/uploader"));

const UPLOAD_BOX =
  "!bg-white  !border !border-dashed   w-24 h-24 !border-neutral-300 ";
const NATIONAL_CODE_LENGTH = 10;
const TELEPHONE_LENGTH = 11;

const DOCUMENT_UPLOADS = [
  {
    key: "document_image",
    label: `${_STRINGS.UPLOAD_RENTAL_DOC}*`,
    link: "/attachments?type=ADVISOR_DOCUMENT_IMAGE",
  },
  {
    key: "national_card_image",
    label: `${_STRINGS.NATIONAL_CARD_IMAGE}*`,
    link: "/attachments?type=ADVISOR_NATIONAL_CARD_IMAGE",
  },
  {
    key: "profile_image",
    label: _STRINGS.YOUR_IMAGE,
    link: "/attachments?type=PROFILE",
  },
] as const;

const AdvisorSpecialFields = ({ values, setValues }: AdvisorFieldsProps) => {
  const { provinces, cities } = useAdvisorLocations(values?.province);

  const onChange = (value: unknown, key: string) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  const toggleCity = (city: { id: number | string }) =>
    setValues((previous) => {
      const current = previous?.cityIds;
      if (!isArray(current)) return { ...previous, cityIds: [] };
      return {
        ...previous,
        cityIds: current.some((entry: any) => entry?.id == city?.id)
          ? current.filter((entry: any) => entry?.id != city?.id)
          : [...current, city],
      };
    });

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
        <FormInput
          value={values?.national_code || ""}
          onChangeText={(entered) => onChange(entered, "national_code")}
          item={{
            containerClass: "w-full",
            direction: "ltr",
            inputClass: "ltr text-left",
            isMandatory: true,
            keyboard: "number",
            maxLength: NATIONAL_CODE_LENGTH,
            title: _STRINGS.NATIONAL_CODE,
          }}
        />
      </div>

      <div className="w-full flex items-center gap-3">
        <FormInput
          value={values?.tel || ""}
          onChangeText={(entered) => onChange(entered, "tel")}
          item={{
            containerClass: " w-full md:w-1/2",
            direction: "ltr",
            inputClass: "ltr text-left",
            isMandatory: true,
            keyboard: "number",
            maxLength: TELEPHONE_LENGTH,
            title: _STRINGS.TELEPHONE_NUMBER,
          }}
        />
      </div>

      <div className="w-full flex flex-col gap-3 items-start">
        <SinglePopUpSelect
          closeOnSelect
          value={values?.province || ""}
          onSelect={(selected) => onChange(selected, "province")}
          item={{
            containerClass: " w-full md:w-1/2",
            isMandatory: true,
            list: provinces || [],
            title: _STRINGS.PROVINCE,
          }}
        />
        <MultyPopUpSelect
          onSelect={toggleCity}
          value={values?.cityIds || []}
          title={_STRINGS.SELECT_ACTIVE_CITIES}
          item={{ full_item: true, list: cities || [] }}
        />
      </div>

      <MultiLineFormInput
        value={values?.address || ""}
        onChangeText={(entered) => onChange(entered, "address")}
        item={{
          containerClass: "w-full",
          isMandatory: true,
          rows: 3,
          title: _STRINGS.STATIONERY_PLACE,
        }}
      />

      <p className="w-full text-start text-base md:text-lg font-medium">
        {_STRINGS.ADDRESS_DOCS_IMAGES}
      </p>

      {DOCUMENT_UPLOADS.map((upload) => (
        <div
          key={upload.key}
          className="w-full flex items-center justify-center flex-col"
        >
          <p className="w-full text-start text-sm md:text-base">
            {upload.label}
          </p>
          <MainUploader
            withCrop
            link={upload.link}
            key={`advisor-${upload.key}`}
            title={_STRINGS.IMAGE}
            item={values?.[upload.key]}
            innerClasses={{ sizeClass: UPLOAD_BOX }}
            onDelete={() => onChange(null, upload.key)}
            onSelect={(file) => onChange(file, upload.key)}
            containerClass="my-3 w-full flex items-start justify-start"
          />
        </div>
      ))}

      <FormInput
        value={values?.referrer_code || ""}
        onChangeText={(entered) => onChange(entered, "referrer_code")}
        item={{
          containerClass: "w-full  md:w-1/2",
          direction: "ltr",
          inputClass: "ltr text-left",
          maxLength: NATIONAL_CODE_LENGTH,
          title: _STRINGS.REFRAL_CODE,
        }}
      />
    </div>
  );
};

export default AdvisorSpecialFields;
