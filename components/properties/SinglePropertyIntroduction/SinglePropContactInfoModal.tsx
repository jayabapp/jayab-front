"use client";
import { PropertyContactIInfDto, SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import LinearSkeleton from "../ProductSkeleton/LinearSkeleton";
import PropertyContactInfoItem from "./PropertyContactInfoItem";

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
    <>
      <ModalBottomSheet
        options={{
          containerClass: `mx-auto rounded-t-20 absolute pb-[1.5rem] md:pb-4 bottom-0 md:translate-x-1/2 md:right-1/2 w-full md:w-[calc(35svw)]  bg-white dark:bg-zinc-900 overflow-y-scroll  dark:bg-dark-700`,
        }}
        onHide={onHide}
        show={show}
      >
        <ModalHeaderPart hideArrow title={_STRINGS.CONTACT_INFO} onHide={onHide} />

        <div className="w-full p-4 flex flex-col">
          {isPending ? (
            <div className="w-full flex flex-col gap-2">
              <LinearSkeleton width={"100%"} />
              <LinearSkeleton width={"100%"} />
            </div>
          ) : isEmpty(contactInfo) ? (
            <p className="w-full text-center">{_STRINGS?.EMPTY_CONTACT_LIST}</p>
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
    </>
  );
};

export default SinglePropContactInfoModal;
