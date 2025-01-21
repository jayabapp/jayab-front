"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import PopUpDown from "@/components/PopUpDown";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import PropertyContactInfoItem from "./PropertyContactInfoItem";

const SinglePropContactInfoPop = ({
  data,
  show,
  onHide,
}: {
  data: SinglePropDto;
  show: boolean;
  onHide: () => void | null;
}) => {
  const { data: contactInfo, isPending } = useQuery({
    queryKey: [PropertyService.SINGLE_PROPERTY_CONTACT_INFO_CACHEKEY, data?.slug, show],
    queryFn: () => {
      if (!!data?.slug && !!show) {
        return PropertyService.getSinglePropertyContactInfo({ propertySlug: data?.slug });
      } else return null;
    },
  });

  return (
    <PopUpDown setVisible={onHide} visible={show}>
      <ModalHeaderPart title={_STRINGS.CONTACT_INFO} onHide={() => {}} />

      <div className="w-full p-4 flex flex-col gap-2">
        {isPending ? (
          <LottieLoading />
        ) : isEmpty(contactInfo) ? (
          <EmptyList />
        ) : (
          contactInfo?.map((e) => <PropertyContactInfoItem key={`contactItem${e?.assistant_full_name}`} data={e} />)
        )}
      </div>
    </PopUpDown>
  );
};

export default SinglePropContactInfoPop;
