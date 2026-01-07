"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import PopUpDown from "@/components/PopUpDown";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import { shareButtonItems } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SinglePropSharePopItem from "./SinglePropSharePopItem";

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

  const onShare = async (url: string, title: string) => {
    const text = "";
    const shareDetails = { url, title, text };
    if (navigator.share) {
      try {
        await navigator.share(shareDetails).then(() => console.log("Your content was shared"));
      } catch (error) {
        navigator.clipboard.writeText(url);
        Notify({
          type: "success",
          body: "لینک شیر  کپی شد",
        });
      }
    }
  };

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
      onShare(shareData, data?.title);
    }
  }, [shareData]);

  return (
    <PopUpDown setVisible={onHide} visible={show}>
      <ModalHeaderPart hideArrow title={_STRINGS.SEND_INFO} onHide={onHide} />

      <div className="w-full p-4 flex flex-col gap-2">
        {shareButtonItems?.map((e) => (
          <SinglePropSharePopItem
            key={`share${e?.id}`}
            data={e}
            cb={() => onItemSelect(e?.id)}
            isChecked={selected?.includes(e?.id)}
          />
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
