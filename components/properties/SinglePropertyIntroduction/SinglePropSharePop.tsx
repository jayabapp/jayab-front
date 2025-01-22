"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import PopUpDown from "@/components/PopUpDown";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { shareButtonItems } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import SinglePropSharePopItem from "./SinglePropSharePopItem";
import Button from "@/components/shared/Button/Button";

const SinglePropSharePop = ({
  data,
  show,
  onHide,
}: {
  data: SinglePropDto;
  show: boolean;
  onHide: () => void | null;
}) => {
  const [selected, setSelected] = useState<any[]>([]);

  const { data: contactInfo, isPending } = useQuery({
    queryKey: [PropertyService.SINGLE_PROPERTY_CONTACT_INFO_CACHEKEY, data?.slug, show],
    queryFn: () => {
      if (!!data?.slug && !!show) {
        return PropertyService.getSinglePropertyContactInfo({ propertySlug: data?.slug });
      } else return null;
    },
  });

  const onItemSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected((e) => e?.filter((x) => x !== id));
    } else {
      setSelected((e) => [...e, id]);
    }
  };

  return (
    <PopUpDown setVisible={onHide} visible={show}>
      <ModalHeaderPart title={_STRINGS.SEND_INFO} onHide={() => {}} />

      <div className="w-full p-4 flex flex-col gap-2">
        {shareButtonItems?.map((e) => (
          <SinglePropSharePopItem data={e} cb={() => onItemSelect(e?.id)} isChecked={selected?.includes(e?.id)} />
        ))}
      </div>
      <Button title={_STRINGS.SEND} width="w-full" containerClass="w-full  px-8" />
    </PopUpDown>
  );
};

export default SinglePropSharePop;
