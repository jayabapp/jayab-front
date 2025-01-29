import { HomeService } from "@/api_services/home/home.service";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import FormInput from "@/components/shared/Form/FormInput";
import AuthUploader from "@/components/uploader/AuthUploader";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const EditCreateUserPage = ({
  values,
  onChange,
}: {
  values: {
    name: string;
    national_code: string;
    image: any;
  };
  onChange: (value: string | number | null, key: string) => void;
}) => {
  const { data: ownerCreateContent, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "ownerCreateContent", 1],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "ownerCreateContent" });
    },
  });

  return (
    <div className="w-full flex flex-col gap-4   ">
      <div className="p-4  rounded-10 bg-primary-100 items-center justify-center  text-justify">
        {isLoading ? <BtnLoading /> : ownerCreateContent?.small_text || ""}
      </div>

      <div className=" w-full flex gap-4  flex-col md:flex-row items-center ">
        {" "}
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
      <div className="flex flex-col gap-1 items-center justify-center ">
        <p>{_STRINGS.YOUR_IMAGE}</p>
        <AuthUploader
          cropRatio={1}
          title={_STRINGS.PROFILE_IMAGE}
          withCrop
          // isLogo
          link="/attachments?type=OWNER_SELFIE_IMAGE"
          key={`uploader`}
          containerClass={" w-full flex items-center justify-center "}
          item={values?.image}
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

export default EditCreateUserPage;
