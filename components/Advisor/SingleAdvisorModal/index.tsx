import Modal from "@/components/Modal";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import _STRINGS from "@/utils/LocalStrings";
import React, { useEffect, useState } from "react";
import AdvisorCard from "../AdvisorCard";
import Button from "@/components/shared/Button/Button";
import AdvisorCircularProgresCard from "../AdvisorCircularProgressPart/AdvisorCircularProgresCard";

const SingleAdvisorModal = ({
  show,
  onHide,
  selectedAdvisor,
}: {
  show: boolean;
  onHide: () => void | null;
  selectedAdvisor: any;
}) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!!selectedAdvisor) {
      setData(selectedAdvisor);
    } else {
      setData(null);
    }
  }, [selectedAdvisor]);

  const onActionButtinsClick = (type: "tel" | "sms") => {
    window.open(`${type}:${selectedAdvisor?.phone}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal show={show} onHide={onHide}>
      <ModalHeaderPart onHide={onHide} title={_STRINGS.CONSULTANT_INFO} />
      <div className=" w-full p-4 rounded-10 bg-white flex flex-col gap-4 ">
        <AdvisorCard data={data} />

        <div className=" w-full  gap-4 flex items-center justify-between">
          <Button
            onClick={() => {
              onActionButtinsClick("tel");
            }}
            containerClass="w-full"
            width="w-full"
            title={_STRINGS.CALL}
            roundedClass="rounded-full"
            icon={<img className="w-4 h-4 ml-2 aspect-square" src="/assets/icons/advisor/white_phone.svg" />}
          />
          <Button
            onClick={() => {
              onActionButtinsClick("sms");
            }}
            containerClass="w-full"
            width="w-full"
            variant="outline"
            title={_STRINGS.MESSAGE}
            roundedClass="rounded-full"
            icon={<img className="w-4 h-4 ml-2 aspect-square" src="/assets/icons/advisor/blue_message.svg" />}
          />
        </div>
        <div className="flex items-center justify-between">
          <AdvisorCircularProgresCard
            pStyles={{ pathColor: "#34C759", textColor: "#000", textSize: "1.2rem" }}
            data={{ value: data?.owners_satisfaction }}
            item={{ title: _STRINGS.OWNERS_SATISFACTION, title_class: "" }}
          />
          <AdvisorCircularProgresCard
            pStyles={{ pathColor: "#34C759", textColor: "#000", textSize: "1.2rem" }}
            data={{ value: data?.owners_satisfaction }}
            item={{ title: _STRINGS.OWNERS_SATISFACTION, title_class: "" }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SingleAdvisorModal;
