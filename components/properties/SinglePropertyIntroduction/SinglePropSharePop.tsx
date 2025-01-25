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
import React, { use, useEffect, useState } from "react";
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

  const { data: shareData, refetch } = useQuery({
    queryKey: [PropertyService.SINGLE_PROPERTY_ADVISOR_SHARE_CACHEKEY, data?.id, selected],
    queryFn: () => {
      if (!!data?.id && !!selected) {
        return PropertyService.getSingleAdvisorShare({ propertyId: data?.id, elements: `${selected?.map((e) => e)}` });
      } else return null;
    },
    enabled: false,
  });

  const onItemSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected((e) => e?.filter((x) => x !== id));
    } else {
      setSelected((e) => [...e, id]);
    }
  };

  useEffect(() => {
    if (!!shareData) {
      window.open(shareData, "_blank", "noopener,noreferrer");
    }
  }, [shareData]);

  return (
    <PopUpDown setVisible={onHide} visible={show}>
      <ModalHeaderPart title={_STRINGS.SEND_INFO} onHide={() => {}} />

      <div className="w-full p-4 flex flex-col gap-2">
        {shareButtonItems?.map((e) => (
          <SinglePropSharePopItem data={e} cb={() => onItemSelect(e?.id)} isChecked={selected?.includes(e?.id)} />
        ))}
      </div>
      <Button
        title={_STRINGS.SEND}
        onClick={() => refetch()}
        width="w-full md:w-1/2 "
        containerClass="w-full flex items-center justify-center   py-4 px-8"
      />
    </PopUpDown>
  );
};

export default SinglePropSharePop;
