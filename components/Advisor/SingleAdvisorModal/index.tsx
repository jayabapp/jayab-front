import { useMutation, useQuery } from "@tanstack/react-query";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { STALE_TIME } from "@/helpers/queryCache";
import { useState } from "react";

import AdvisorCircularProgresCard from "../AdvisorCircularProgressPart/AdvisorCircularProgresCard";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import AdvisorCard from "../AdvisorCard";
import _STRINGS from "@/utils/LocalStrings";
import RatePop from "./RatePop";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/Modal";

const SingleAdvisorModal = ({
  show,
  onHide,
  selectedAdvisor,
}: {
  show: boolean;
  onHide: () => void | null;
  selectedAdvisor: any;
}) => {
  const [showRate, setShowRate] = useState(false);
  const [refresher, setRefresher] = useState(false);
  const onHideRate = () => {
    setShowRate(false);
  };
  const onShowRate = () => {
    setShowRate(true);
  };

  const { data, isPending } = useQuery({
    queryKey: [
      AdvisorService.SINGLE_ADVISOR_CACHEKEY,
      selectedAdvisor?.id,
      refresher,
    ],
    queryFn: () => {
      if (selectedAdvisor?.id)
        return AdvisorService.singleAdvisor({ advisorId: selectedAdvisor?.id });
      else return null;
    },
    staleTime: STALE_TIME.DEFAULT,
  });

  const { mutate, isPending: contactLoading } = useMutation({
    mutationFn: AdvisorService.singleAdvisorInitContact,
  });

  const onActionButtinsClick = (type: "tel" | "sms") => {
    mutate(
      { advisorId: data?.id || selectedAdvisor?.id },
      {
        onSuccess: () => {
          setRefresher((e) => !e);
          var linkElement = document.createElement("a");
          linkElement.id = "link";
          window.document.body.appendChild(linkElement);
          var menuAddress = `${type}:${data?.user?.mobile_number}`;
          var link = document.getElementById("link");
          if (!!link) {
            link.setAttribute("href", menuAddress);
            link.click();
          }
        },
      },
    );
  };

  return (
    <>
      <Modal
        options={{
          containerClass:
            "mx-auto !my-0 h-[100dvh] md:h-auto md:my-10 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4  rounded-0  md:rounded-2xl overflow-y-scroll bg-white dark:bg-zinc-900",
        }}
        show={show}
        onHide={onHide}
      >
        <ModalHeaderPart onHide={onHide} title={_STRINGS.CONSULTANT_INFO} />
        {isPending ? (
          <LottieLoading />
        ) : (
          <div className=" w-full p-4 rounded-10 bg-white flex flex-col gap-4 ">
            <AdvisorCard
              key="singleCard"
              isSingle
              data={{
                id: data?.id || null,
                user: data?.user || null,
                cities: data?.cities || [],
                created_at: data?.created_at || "",
                users_satisfaction: data?.users_satisfaction || 100,
                owners_satisfaction: data?.owners_satisfaction || 100,
                work_history_in_month: data?.work_history_in_month || 100,
              }}
            />

            <div className=" w-full  gap-4 flex items-center justify-between">
              <Button
                loading={contactLoading}
                onClick={() => {
                  onActionButtinsClick("tel");
                }}
                containerClass="w-full"
                width="w-full"
                title={_STRINGS.CALL}
                roundedClass="rounded-full"
                icon={
                  <img
                    className="w-4 h-4 ml-2 aspect-square"
                    src="/assets/icons/advisor/white_phone.svg"
                  />
                }
              />
              <Button
                loading={contactLoading}
                onClick={() => {
                  onActionButtinsClick("sms");
                }}
                containerClass="w-full"
                width="w-full"
                variant="outline"
                title={_STRINGS.MESSAGE}
                roundedClass="rounded-full"
                icon={
                  <img
                    className="w-4 h-4 ml-2 aspect-square"
                    src="/assets/icons/advisor/blue_message.svg"
                  />
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <AdvisorCircularProgresCard
                containerClass=" w-full "
                pStyles={{
                  pathColor: "#34C759",
                  textColor: "#000",
                  textSize: "1.3rem",
                }}
                data={{ value: data?.advisor_behavior || 100 }}
                item={{
                  title: _STRINGS.CONSULTANT_APPROACHES,
                  title_class: " !text-sm",
                }}
              />
              <AdvisorCircularProgresCard
                containerClass=" w-full "
                pStyles={{
                  pathColor: "#34C759",
                  textColor: "#000",
                  textSize: "1.3rem",
                }}
                data={{ value: data?.advisor_responsibility || 100 }}
                item={{
                  title: _STRINGS.CONSULTANT_RESPONSIBILITY,
                  title_class: " !text-sm",
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <AdvisorCircularProgresCard
                containerClass=" w-full "
                pStyles={{
                  pathColor: "#34C759",
                  textColor: "#000",
                  textSize: "1.3rem",
                }}
                data={{ value: data?.response_speed_and_followup || 100 }}
                item={{
                  title: _STRINGS.FOLLOWUP_SPEED_RESPONSE,
                  title_class: " !text-sm",
                }}
              />
            </div>

            <Button
              disabled={!data?.can_user_add_rate}
              onClick={onShowRate}
              title={_STRINGS.RECORD_SCORE}
              roundedClass="rounded-full"
              containerClass="w-full"
              width="w-full"
            />
          </div>
        )}
      </Modal>
      <RatePop
        show={!!showRate}
        onHide={onHideRate}
        data={data}
        onSuccessCb={() => {
          setRefresher((e) => !e);
        }}
      />
    </>
  );
};

export default SingleAdvisorModal;
