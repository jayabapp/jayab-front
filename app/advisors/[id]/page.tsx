"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import CircularProgress from "@/components/Advisor/AdvisorCircularProgressPart/AdvisorCircularProgresCard";
import PageHeaders from "@/components/headers/PageHeader";

import _STRINGS from "@/utils/LocalStrings";

const LazyScoreToAdvisorModal = dynamic(() => import("@/components/Consultants/ScoreConsultantModal"), {
  loading: () => <p className="text-center p-10">{_STRINGS.LOADING}...</p>,
  ssr: false,
});

const Page = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="!bg-transparent relative transition-all duration-500 ease-in-out py-16 container">
        <PageHeaders title={_STRINGS.CONSULTANT_INFO} />

        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
          {/* Advisor info */}
          <ConsultantCard
            data={{
              id: 1,
              code: "66",
              name: "Alice Green",
              avatar: "/assets/images/fake_consultant_image.png",
              specialization: "Project Management",
              experience: 5,
              city: "Los Angeles",
              country: "USA",
              average_rating: 4.6,
              is_favorite: true,
              owners_satisfaction: 90,
              locations: ["تهران", "تهران", "تهران"],
            }}
          />

          <div className="w-full flex items-center justify-between gap-4">
            <Button
              icon={
                <>
                  <img src={"/assets/icons/shared/call.svg"} width={20} height={20} alt="call icon" />
                </>
              }
              width="flex items-center justify-center w-full gap-1"
              containerClass="w-full"
              roundedClass="rounded-full"
              title={_STRINGS.CALL}
            />
            <Button
              icon={
                <>
                  <img src={"/assets/icons/shared/message.svg"} width={20} height={20} alt="call icon" />
                </>
              }
              width="flex items-center justify-center w-full gap-1"
              containerClass="w-full"
              roundedClass="rounded-full"
              title={_STRINGS.MESSAGE}
              variant="outline"
            />
          </div>

          <div className="flex flex-col gap-6 pt-6 px-12">
            <div className="w-full grid grid-cols-2 items-center justify-around gap-6">
              <div className="w-full mx-auto">
                <CircularProgress
                  size="w-16 sm:w-24"
                  value={90}
                  color="#0070f3"
                  subtitle={_STRINGS.CONSULTANT_APPROACHES}
                  pStyles={{
                    textColor: "#2F3237",
                    pathColor: "#34C759",
                    textSize: "270%",
                  }}
                />
              </div>
              <div className="w-full mx-auto">
                <CircularProgress
                  size="w-16 sm:w-24"
                  value={80}
                  color="#0070f3"
                  subtitle={_STRINGS.CONSULTANT_RESPONSIBILITY}
                  pStyles={{
                    textColor: "#2F3237",
                    pathColor: "#34C759",
                    textSize: "270%",
                  }}
                />
              </div>
            </div>
            <div className="mx-auto">
              <CircularProgress
                size="w-16 sm:w-24"
                value={75}
                color="#0070f3"
                subtitle={_STRINGS.FOLLOWUP_SPEED_RESPONSE}
                pStyles={{
                  textColor: "#2F3237",
                  pathColor: "#34C759",
                  textSize: "240%",
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="w-full fixed bottom-0 left-0 bg-white flex items-center justify-center px-4 py-4"
          style={{ boxShadow: "0px -1px 6px 0px #00000026" }}
        >
          <Button
            disabled={false} // TODO: Check if contact button clicked correctly then update this value
            width="flex items-center justify-center w-full max-w-2xl mx-auto"
            containerClass="w-full"
            roundedClass="rounded-full"
            title={_STRINGS.RECORD_SCORE}
            onClick={() => setShowModal(!showModal)}
          />
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(!showModal)}
        options={{
          containerClass:
            "mx-auto md:!my-10 w-full h-full max-w-lg md:h-[inherit] overflow-y-scroll bg-white dark:bg-zinc-900 md:rounded-2xl",
        }}
      >
        <div className="h-full">
          <div className="flex items-center justify-center sticky select-none z-[40]   shadow-md   bg-white w-full transition-all top-0 h-16 px-6 py-4">
            <span className="font-semibold">{_STRINGS.ADVISOR_REGUSTER_SCORE}</span>
            <button onClick={() => setShowModal(!showModal)} className="text-2xl text-gray-500 absolute right-7 top-7">
              <img src="/assets/icons/close.svg" alt="" />
            </button>
          </div>
          <LazyScoreToAdvisorModal />
        </div>
      </Modal>
    </>
  );
};

export default Page;
