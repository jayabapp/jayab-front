"use client";

import { useStartAdvisorContact } from "@features/advisors/hooks/useStartAdvisorContact";
import { useAdvisorDetails } from "@features/advisors/hooks/useAdvisorDetails";
import { useTranslations } from "next-intl";
import { ModalHeaderPart } from "@elements/Modal";
import { ContentImage } from "@elements/Image";
import { useState } from "react";
import { colors } from "@/theme/colors";

import type { AdvisorDetailsModalProps } from "@/types/components/modules/advisors";

import AdvisorDetailsSkeleton from "./AdvisorDetailsSkeleton";
import AdvisorRatingSheet from "./parts/AdvisorRatingSheet.client";
import AdvisorGauge from "./parts/AdvisorGauge";
import AdvisorCard from "./AdvisorCard";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const MODAL_CLASS =
  "mx-auto !my-0 h-[100dvh] md:h-auto md:my-10 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4  rounded-0  md:rounded-2xl overflow-y-scroll bg-surface ";
const DEFAULT_SCORE = 100;

const AdvisorDetailsModal = ({
  show,
  onHide,
  advisor,
}: AdvisorDetailsModalProps) => {
  const t = useTranslations();

  const [showRating, setShowRating] = useState(false);
  const { data, isPending } = useAdvisorDetails(advisor?.id ?? undefined);
  const { mutate, isPending: isContacting } = useStartAdvisorContact();

  const onContact = (channel: "sms" | "tel") => {
    if (isContacting) return;
    mutate(
      { advisorId: data?.id ?? advisor?.id ?? null },
      {
        onSuccess: () => {
          window.location.href = `${channel}:${data?.user?.mobile_number}`;
        },
      },
    );
  };

  const gaugeRows = [
    [
      {
        title: t("advisor.consultantApproaches"),
        value: data?.advisor_behavior || DEFAULT_SCORE,
      },
      {
        title: t("advisor.consultantResponsibility"),
        value: data?.advisor_responsibility || DEFAULT_SCORE,
      },
    ],
    [
      {
        title: t("advisor.followupSpeedResponse"),
        value: data?.response_speed_and_followup || DEFAULT_SCORE,
      },
    ],
  ];

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        options={{ containerClass: MODAL_CLASS }}
      >
        <ModalHeaderPart onHide={onHide} title={t("advisor.consultantInfo")} />

        {isPending ? (
          <AdvisorDetailsSkeleton />
        ) : (
          <div className="w-full p-4 rounded-10 bg-surface flex flex-col gap-4">
            <AdvisorCard
              isSingle
              key="advisor-details-card"
              advisor={{
                cities: data?.cities || [],
                created_at: data?.created_at || "",
                id: data?.id ?? null,
                owners_satisfaction: data?.owners_satisfaction || DEFAULT_SCORE,
                user: data?.user || null,
                users_satisfaction: data?.users_satisfaction || DEFAULT_SCORE,
                work_history_in_month:
                  data?.work_history_in_month || DEFAULT_SCORE,
              }}
            />

            <div className="w-full gap-4 flex items-center justify-between">
              <Button
                width="w-full"
                loading={isContacting}
                disabled={isContacting}
                containerClass="w-full"
                title={t("common.call")}
                roundedClass="rounded-full"
                onClick={() => onContact("tel")}
                icon={
                  <ContentImage
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 ml-2 aspect-square"
                    src="/assets/icons/advisor/white_phone.svg"
                  />
                }
              />
              <Button
                width="w-full"
                variant="outline"
                loading={isContacting}
                disabled={isContacting}
                containerClass="w-full"
                title={t("common.message")}
                roundedClass="rounded-full"
                onClick={() => onContact("sms")}
                icon={
                  <ContentImage
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 ml-2 aspect-square"
                    src="/assets/icons/advisor/blue_message.svg"
                  />
                }
              />
            </div>

            {gaugeRows.map((row) => (
              <div
                key={row[0].title}
                className="flex items-center justify-between"
              >
                {row.map((gauge) => (
                  <AdvisorGauge
                    key={gauge.title}
                    title={gauge.title}
                    value={gauge.value}
                    textSize="1.3rem"
                    titleClass=" !text-sm"
                    containerClass=" w-full "
                    pathColor={colors.success[500]}
                    textColor="rgb(var(--c-ink))"
                  />
                ))}
              </div>
            ))}

            <Button
              width="w-full"
              containerClass="w-full"
              roundedClass="rounded-full"
              title={t("advisor.recordScore")}
              onClick={() => setShowRating(true)}
              disabled={!data?.can_user_add_rate}
            />
          </div>
        )}
      </Modal>

      <AdvisorRatingSheet
        advisor={data}
        show={!!showRating}
        key={data?.id ?? "advisor-rate"}
        onHide={() => setShowRating(false)}
      />
    </>
  );
};

export default AdvisorDetailsModal;
