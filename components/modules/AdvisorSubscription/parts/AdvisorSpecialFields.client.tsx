"use client";

import { SingleSelectPopUpSelect as SinglePopUpSelect } from "@elements/Form";
import { MultiSelectPopUpSelect as MultyPopUpSelect } from "@elements/Form";
import { useAdvisorLocations } from "@features/advisors/hooks/useAdvisorLocations";
import { MultiLineFormInput } from "@elements/Form";
import { useTranslations } from "next-intl";
import { FormInput } from "@elements/Form";

import type { AdvisorFieldsProps } from "@/types/components/modules/advisors";

import isArray from "lodash/isArray";
import dynamic from "next/dynamic";

const UploadField = dynamic(() =>
  import("@modules/PropertyMedia").then((module) => module.UploadField),
);

const UPLOAD_BOX =
  "!bg-white  !border !border-dashed   w-24 h-24 !border-neutral-300 ";
const NATIONAL_CODE_LENGTH = 10;
const TELEPHONE_LENGTH = 11;

const DOCUMENT_UPLOADS = [
  {
    key: "document_image",
    label: "advisor.uploadRentalDoc",
    star: true,
    link: "/attachments?type=ADVISOR_DOCUMENT_IMAGE",
  },
  {
    key: "national_card_image",
    label: "advisor.nationalCardImage",
    star: true,
    link: "/attachments?type=ADVISOR_NATIONAL_CARD_IMAGE",
  },
  {
    key: "profile_image",
    label: "common.yourImage",
    star: false,
    link: "/attachments?type=PROFILE",
  },
] as const;

const AdvisorSpecialFields = ({ values, setValues }: AdvisorFieldsProps) => {
  const t = useTranslations();

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
            title: t("advisor.fullName"),
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
            title: t("advisor.nationalCode"),
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
            title: t("advisor.telephoneNumber"),
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
            title: t("common.province"),
          }}
        />
        <MultyPopUpSelect
          onSelect={toggleCity}
          value={values?.cityIds || []}
          title={t("advisor.selectActiveCities")}
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
          title: t("advisor.stationeryPlace"),
        }}
      />

      <p className="w-full text-start text-base md:text-lg font-medium">
        {t("advisor.addressDocsImages")}
      </p>

      {DOCUMENT_UPLOADS.map((upload) => (
        <div
          key={upload.key}
          className="w-full flex items-center justify-center flex-col"
        >
          <p className="w-full text-start text-sm md:text-base">
            {t(upload.label)}
            {upload.star ? "*" : ""}
          </p>
          <UploadField
            withCrop
            link={upload.link}
            key={`advisor-${upload.key}`}
            title={t("common.image")}
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
          title: t("common.refralCode"),
        }}
      />
    </div>
  );
};

export default AdvisorSpecialFields;
