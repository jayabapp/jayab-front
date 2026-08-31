"use client";

import { usePropertyLicenseForm } from "@features/owner-property/hooks/usePropertyLicenseForm";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { useRouter } from "next/navigation";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import StatusShower from "@/components/shared/StatusShower";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import dynamic from "next/dynamic";

const UploadField = dynamic(() =>
  import("@modules/PropertyMedia").then((module) => module.UploadField),
);

const DOC_UPLOAD_LINK = "/attachments?type=OWNER_PROPERTY_DOCS";
const DOC_THUMB = {
  secontParentClass: "w-24",
  sizeClass: "w-24 aspect-square h-24",
};

const PropertyLicenseForm = ({ propertyId }: OwnerPropertyRouteProps) => {
  const router = useRouter();
  const {
    docs,
    status,
    submit,
    isLocked,
    isLoading,
    isPending,
    setDocs,
    nationalImage,
    setNationalImage,
  } = usePropertyLicenseForm(propertyId);

  if (isLoading) return <PropertyEditStepSkeleton variant="media" />;

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <p className="font-bold text-brand-600 text-start">
          {_STRINGS.AUTHORiZIATION_REQUEST}
        </p>
        <StatusShower data={status} />
      </div>

      <div className="w-full flex items-center justify-center flex-col">
        <p className="w-full text-start">
          {_STRINGS.NATIONAL_CARD_IMAGE_AUTH} :
        </p>
        <UploadField
          withCrop
          item={nationalImage}
          title={_STRINGS.IMAGE}
          key="uploader-national"
          link={DOC_UPLOAD_LINK}
          onSelect={setNationalImage}
          containerClass="my-3 w-full flex items-start justify-start"
          onDelete={isLocked ? undefined : () => setNationalImage(null)}
        />
      </div>

      <div className="flex items-start w-full flex-wrap gap-2">
        <p>{_STRINGS.DOCS_IMAGE_AUTH} :</p>

        {isLocked ? null : (
          <UploadField
            item={null}
            key="uploader-add"
            containerClass="w-24"
            link={DOC_UPLOAD_LINK}
            onDelete={() => {}}
            innerClasses={DOC_THUMB}
            title={_STRINGS.ADD_IMAGE}
            onSelect={(file) => setDocs((previous) => [...previous, file])}
          />
        )}

        {docs?.map((doc) => (
          <UploadField
            item={doc}
            onSelect={() => {}}
            containerClass="w-24"
            link={DOC_UPLOAD_LINK}
            key={`uploader-${doc?.id}`}
            innerClasses={DOC_THUMB}
            title={_STRINGS.ADD_IMAGE}
            onDelete={
              isLocked
                ? undefined
                : () =>
                    setDocs((previous) =>
                      previous.filter((entry) => entry?.id !== doc?.id),
                    )
            }
          />
        ))}
      </div>

      <FixedBottomContainer>
        <Button
          loading={isPending}
          disabled={isPending}
          width="w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          title={_STRINGS.SUBMIT_REQUEST}
          onClick={() => submit(() => router.back())}
          containerClass="w-full flex items-center justify-center"
        />
      </FixedBottomContainer>
    </>
  );
};

export default PropertyLicenseForm;
