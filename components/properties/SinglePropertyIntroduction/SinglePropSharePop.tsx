"use client";

import { useShareProperty } from "@features/properties/hooks/useShareProperty";
import { shareButtonItems } from "@/utils/constantss";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { useState } from "react";

import SinglePropSharePopItem from "./SinglePropSharePopItem";
import { ModalHeaderPart } from "@elements/Modal";
import PopUpDown from "@elements/PopUpDown";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";

type TSinglePropsShareProps = {
  show: boolean;
  data: SinglePropDto;
  onHide: () => void | null;
};

const SinglePropSharePop = ({ data, show, onHide }: TSinglePropsShareProps) => {
  const [selected, setSelected] = useState<any[]>([]);

  const onShare = async (url: string, title: string) => {
    const text = "";
    const shareDetails = { url, title, text };
    if (navigator.share) {
      try {
        await navigator
          .share(shareDetails)
          .then(() => console.log("Your content was shared"));
      } catch {
        navigator.clipboard.writeText(url);
        Notify({
          type: "success",
          body: "لینک شیر  کپی شد",
        });
      }
    }
  };

  const { mutate, isPending } = useShareProperty();

  const onItemSelect = (id: string) => {
    if (selected.includes(id)) setSelected((e) => e?.filter((x) => x !== id));
    else setSelected((e) => [...e, id]);
  };

  return (
    <PopUpDown setVisible={onHide} visible={show}>
      <ModalHeaderPart hideArrow title={_STRINGS.SEND_INFO} onHide={onHide} />

      <div className="w-full p-4 flex flex-col gap-2">
        {shareButtonItems?.map((e) => (
          <SinglePropSharePopItem
            data={e}
            key={`share${e?.id}`}
            cb={() => onItemSelect(e?.id)}
            isChecked={selected?.includes(e?.id)}
          />
        ))}
      </div>
      <Button
        title={_STRINGS.SEND}
        loading={isPending}
        onClick={() => {
          if (!data?.id) return;
          mutate(
            { propertyId: data.id, elements: selected.join(",") },
            {
              onSuccess: (url) => {
                if (url) void onShare(url, data.title ?? "");
              },
            },
          );
        }}
        width="w-full md:w-1/2 "
        containerClass="w-full flex items-center justify-center   py-4 px-8"
      />
    </PopUpDown>
  );
};

export default SinglePropSharePop;
