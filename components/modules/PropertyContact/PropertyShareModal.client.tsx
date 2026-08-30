"use client";

import type { PropertyShareModalProps } from "@/types/components/modules/property-contact";
import { useShareProperty } from "@features/properties/hooks/useShareProperty";
import { shareButtonItems } from "@/utils/constantss";
import { ModalHeaderPart } from "@elements/Modal";
import { useState } from "react";

import ShareChannelRow from "./parts/ShareChannelRow";
import _STRINGS from "@/utils/LocalStrings";
import PopUpDown from "@elements/PopUpDown";
import Button from "@elements/Button";
import Notify from "@elements/Toast";

const PropertyShareModal = ({
  show,
  onHide,
  property,
}: PropertyShareModalProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { mutate, isPending } = useShareProperty();

  const onShare = async (url: string, title: string) => {
    if (!navigator.share) {
      await navigator.clipboard.writeText(url);
      Notify({ type: "success", body: _STRINGS.SHARE_LINK_COPIED });
      return;
    }
    try {
      await navigator.share({ url, title, text: "" });
    } catch {
      await navigator.clipboard.writeText(url);
      Notify({ type: "success", body: _STRINGS.SHARE_LINK_COPIED });
    }
  };

  const toggleChannel = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );

  return (
    <PopUpDown setVisible={onHide} visible={show}>
      <ModalHeaderPart hideArrow title={_STRINGS.SEND_INFO} onHide={onHide} />

      <div className="w-full p-4 flex flex-col gap-2">
        {shareButtonItems?.map((channel) => (
          <ShareChannelRow
            data={channel}
            key={`share-${channel?.id}`}
            cb={() => toggleChannel(channel?.id)}
            isChecked={selected.includes(channel?.id)}
          />
        ))}
      </div>

      <Button
        title={_STRINGS.SEND}
        loading={isPending}
        width="w-full md:w-1/2"
        containerClass="w-full flex items-center justify-center py-4 px-8"
        onClick={() => {
          if (!property?.id) return;
          mutate(
            { propertyId: property.id, elements: selected.join(",") },
            {
              onSuccess: (url) => {
                if (url) void onShare(url, property.title ?? "");
              },
            },
          );
        }}
      />
    </PopUpDown>
  );
};

export default PropertyShareModal;
