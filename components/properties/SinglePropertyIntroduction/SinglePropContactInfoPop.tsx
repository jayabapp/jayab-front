"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";

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
    staleTime: 300,
    gcTime: 300,
  });

  return (
    <>
      <ModalBottomSheet onHide={onHide} show={show}>
        <ModalHeaderPart hideArrow title={_STRINGS.CONTACT_INFO} onHide={onHide} />

        {/* <div className="w-full p-4 flex flex-col">
          {isPending ? (
            <LottieLoading />
          ) : isEmpty(contactInfo?.list) ? (
            <EmptyList />
          ) : (
            contactInfo?.list?.map((e) => (
              <PropertyContactInfoItem
                isPropertyExpired={contactInfo?.isPropertyExpired}
                onHide={onHide}
                key={`contactItem${e?.assistant_full_name}`}
                data={e}
              />
            ))
          )}
        </div> */}
      </ModalBottomSheet>
    </>
  );
};

export default SinglePropContactInfoPop;
