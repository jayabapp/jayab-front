"use client";

import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useOwnerProperty } from "@features/owner-property/hooks/useOwnerProperty";
import { upcomingWeekDays } from "@features/owner-property/lib/upcoming-week";
import { PropertyDetailsSkeleton } from "@modules/PropertyDetails";
import { DaysOfTheWeekStatus } from "@modules/PropertyGrid";
import { ShareImageItem } from "@modules/PropertyGallery";
import { MultiLineFormInput } from "@elements/Form";
import { ContentImage } from "@elements/Image";
import { useMemo, useState } from "react";

import ElementToImage from "./parts/ElementToImage.client";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";

moment.loadPersian();

const OwnerPropertyInquiry = ({ propertyId }: OwnerPropertyRouteProps) => {
  const { data: property, isLoading } = useOwnerProperty(propertyId);
  const week = useMemo(() => upcomingWeekDays(), []);
  const [description, setDescription] = useState("");
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  if (isLoading) return <PropertyDetailsSkeleton />;
  if (!property) return null;

  const selectedImage =
    property?.images?.find((image) => image?.id === selectedImageId) ||
    property?.feature_image;

  return (
    <>
      <div className="w-full flex order-2 md:order-1 flex-col gap-4">
        <ElementToImage className="p-4 rounded-2xl gap-3 bg-brand-50 w-full flex flex-col">
          <div className="w-full aspect-square relative">
            <ContentImage
              fill
              alt={selectedImage?.alt || ""}
              sizes="(min-width: 768px) 40vw, 96vw"
              src={getPropertyImageUrl(selectedImage)}
              className="rounded-2xl w-full object-cover aspect-square"
            />
          </div>

          <div className="w-full flex flex-col items-center gap-1 justify-center">
            <div className="text-xs items-center justify-center text-center w-full">
              {moment().format("jDD / jMMMM / jYYYY  ")}
            </div>
            <div className="w-full flex items-start md:items-center justify-between gap-2">
              <p className="font-medium text-lg w-full md:text-2xl">
                {property?.title}
              </p>
            </div>
          </div>

          <DaysOfTheWeekStatus week={week} data={property?.reserve_days} />

          <div className="w-full flex items-center gap-5">
            <div className="flex flex-row items-center gap-2 justify-start">
              <p className="text-xs shrink-0">{_STRINGS.TODAY_STATUS} :</p>
              <p
                className={`font-bold ${property?.is_today_reserved ? "text-danger-500" : "text-brand-600"}`}
              >
                {property?.is_today_reserved
                  ? _STRINGS.OCCUPIED
                  : _STRINGS.EMPTY}
              </p>
            </div>
            <div className="flex items-start gap-1">
              <ContentImage
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 aspect-square"
                src="/assets/icons/adds/pin_point_location.svg"
              />
              <p className="text-xs leading-[19px]">
                {property?.city}{" "}
                <span className="font-light text-xs">
                  ({property?.province})
                </span>
              </p>
            </div>
          </div>

          {description ? (
            <div className="w-full flex flex-col gap-2">
              <p>{_STRINGS.DESCRIPTION} :</p>
              <p className="w-full whitespace-pre-wrap break-words">
                {description}
              </p>
            </div>
          ) : null}
        </ElementToImage>

        <MultiLineFormInput
          value={description}
          onChangeText={setDescription}
          item={{
            containerClass: "w-full",
            inputClass: "w-full",
            placeholder: _STRINGS.YOUR_TEXT,
            title: _STRINGS.DESCRIPTION,
          }}
        />

        <div className="w-full flex items-start gap-2">
          <ContentImage
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 aspect-square"
            src="/assets/icons/property/alert_icon.svg"
          />
          <p>{_STRINGS.SHARE_PROP_MESSAGE}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 w-full order-1 md:order-2 gap-2 border-b pb-4 md:border-0">
        <div className="w-full col-span-full mb-2">
          {_STRINGS.SELECT_YOUR_IMAGE} :
        </div>
        {property?.images?.map((image) => (
          <ShareImageItem
            image={image}
            key={`inquiryImage${image?.id}`}
            isSelected={selectedImage?.id === image?.id}
            cb={() => setSelectedImageId(image?.id ?? null)}
          />
        ))}
      </div>
    </>
  );
};

export default OwnerPropertyInquiry;
