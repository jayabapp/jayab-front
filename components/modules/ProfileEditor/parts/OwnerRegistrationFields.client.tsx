import { AuthUploadField } from "@modules/PropertyMedia";
import { useTranslations } from "next-intl";
import { BtnLoading } from "@elements/Button";
import { FormInput } from "@elements/Form";

import type { TEditCreateProps } from "@/types/components/modules/property-media";

import useCmsContent from "@/hooks/useCmsContent";
import CmsText from "@elements/CmsText";

const OwnerRegistrationFields = ({ values, onChange }: TEditCreateProps) => {
  const t = useTranslations();

  const { content: ownerCreateContent, isLoading } =
    useCmsContent("ownerCreateContent");

  return (
    <div className="w-full flex flex-col gap-4   ">
      <div className="p-4  rounded-10 bg-brand-100 items-center justify-center content  text-justify">
        {isLoading ? (
          <BtnLoading />
        ) : (
          <CmsText>{ownerCreateContent?.small_text || ""}</CmsText>
        )}
      </div>

      <div className="w-full flex gap-4 flex-col md:flex-row items-center">
        {" "}
        <FormInput
          item={{
            title: t("profile.totalName"),
            isMandatory: true,
            containerClass: "w-full",
          }}
          value={values?.name}
          onChangeText={(e) => {
            onChange(e, "name");
          }}
        />
        <FormInput
          item={{
            title: t("profile.nationalId"),
            isMandatory: true,
            containerClass: "w-full",
          }}
          value={values?.national_code}
          onChangeText={(e) => {
            onChange(e, "national_code");
          }}
        />
      </div>
      <div className="flex flex-col gap-1 items-center justify-center ">
        <div className="p-4  rounded-10 bg-orange-50 items-center my-3 justify-center content  text-justify ">
          <p className="text-sm   text-center text-orange-700    ">
            {" "}
            {t("profile.addImageWarning")}
          </p>
        </div>
        <p>{t("common.yourImage")}</p>
        <AuthUploadField
          withCrop
          cropRatio={1}
          key={`uploader`}
          item={values?.image}
          title={t("profile.profileImage")}
          link="/attachments?type=OWNER_SELFIE_IMAGE"
          containerClass={" w-full flex items-center justify-center "}
          onSelect={(file) => {
            onChange(file, "image");
          }}
          onDelete={() => {
            onChange(null, "image");
          }}
        />{" "}
      </div>
    </div>
  );
};

export default OwnerRegistrationFields;
