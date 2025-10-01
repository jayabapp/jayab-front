"use client";
import { PropertyContactIInfDto, SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import PopUpDown from "@/components/PopUpDown";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import PropertyContactInfoItem from "./PropertyContactInfoItem";
import Modal from "@/components/Modal";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import LinearSkeleton from "../ProductSkeleton/LinearSkeleton";

const SinglePropContactInfoModal = ({
  data,
  show,
  onHide,
}: {
  data: SinglePropDto;
  show: boolean;
  onHide: () => void | null;
}) => {
  const [state, setState] = useState<PropertyContactIInfDto[] | null>();
  const { data: contactInfo, isPending } = useQuery({
    queryKey: [PropertyService.SINGLE_PROPERTY_CONTACT_INFO_CACHEKEY, data?.slug, show],
    queryFn: () => {
      if (!!data?.slug && !!show) {
        return PropertyService.getSinglePropertyContactInfo({ propertySlug: data?.slug });
      } else return null;
    },
    staleTime: 300,
    gcTime: 300,
  });

  useEffect(() => {
    if (!!contactInfo) {
      setState(contactInfo?.list);
    }
  }, [contactInfo]);
  return (
    <ModalBottomSheet onHide={onHide} show={show}>
      <ModalHeaderPart hideArrow title={_STRINGS.CONTACT_INFO} onHide={onHide} />

      <div className="w-full p-4 flex flex-col">
        {isPending ? (
          <div className="w-full flex flex-col gap-2">
            <LinearSkeleton width={"100%"} />
            <LinearSkeleton width={"100%"} />
          </div>
        ) : isEmpty(contactInfo) ? (
          <p className="w-full text-center">{_STRINGS?.EMPTY_LIST}</p>
        ) : (
          state?.map((e) => (
            <PropertyContactInfoItem
              image={contactInfo?.owner?.selfie_image}
              onHide={onHide}
              key={`contactItem${e?.assistant_full_name}`}
              data={e}
            />
          ))
        )}
      </div>
    </ModalBottomSheet>
  );
};

export default SinglePropContactInfoModal;
