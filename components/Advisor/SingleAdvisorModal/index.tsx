import Modal from "@/components/Modal";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import _STRINGS from "@/utils/LocalStrings";
import React, { useEffect, useState } from "react";
import AdvisorCard from "../AdvisorCard";
import Button from "@/components/shared/Button/Button";
import AdvisorCircularProgresCard from "../AdvisorCircularProgressPart/AdvisorCircularProgresCard";
import RatePop from "./RatePop";

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
  const [showRate, setShowRate] = useState(false);
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

  const onHideRate = () => {
    setShowRate(false);
  };
  const onShowRate = () => {
    setShowRate(true);
  };
  return (
    <>
      <Modal
        options={{
          containerClass:
            "mx-auto !my-0 h-[100dvh] md:h-auto md:my-10 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-2xl overflow-y-scroll bg-white dark:bg-zinc-900",
        }}
        show={show}
        onHide={onHide}
      >
        <ModalHeaderPart onHide={onHide} title={_STRINGS.CONSULTANT_INFO} />
        <div className=" w-full p-4 rounded-10 bg-white flex flex-col gap-4 ">
          <AdvisorCard isSingle data={data} />

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
              pStyles={{ pathColor: "#34C759", textColor: "#000", textSize: "1.3rem" }}
              data={{ value: data?.owners_satisfaction || 50 }}
              item={{ title: _STRINGS.CONSULTANT_APPROACHES, title_class: " !text-sm" }}
            />
            <AdvisorCircularProgresCard
              pStyles={{ pathColor: "#34C759", textColor: "#000", textSize: "1.3rem" }}
              data={{ value: data?.owners_satisfaction || 50 }}
              item={{ title: _STRINGS.CONSULTANT_RESPONSIBILITY, title_class: " !text-sm" }}
            />
          </div>
          <div className="flex items-center justify-between">
            <AdvisorCircularProgresCard
              pStyles={{ pathColor: "#34C759", textColor: "#000", textSize: "1.3rem" }}
              data={{ value: data?.owners_satisfaction || 50 }}
              item={{ title: _STRINGS.FOLLOWUP_SPEED_RESPONSE, title_class: " !text-sm" }}
            />
          </div>

          <Button
            onClick={onShowRate}
            title={_STRINGS.RECORD_SCORE}
            roundedClass="rounded-full"
            containerClass="w-full"
            width="w-full"
          />
        </div>
      </Modal>
      <RatePop show={!!showRate} onHide={onHideRate} selectedAdvisor={selectedAdvisor} />
    </>
  );
};

export default SingleAdvisorModal;
