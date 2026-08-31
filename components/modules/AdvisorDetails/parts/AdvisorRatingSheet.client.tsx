"use client";

import type { AdvisorRatingSheetProps } from "@/types/components/modules/advisors";
import { useRateAdvisor } from "@features/advisors/hooks/useRateAdvisor";
import { easyRatingItems } from "@/utils/constantss";
import { ModalBottomSheet } from "@elements/Modal";
import { useState } from "react";

import RangeWithTitle from "@elements/Slider";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const SHEET_CLASS =
  "mx-auto rounded-t-20 absolute pb-[1.5rem] md:pb-10 bottom-0 md:translate-x-1/2 md:right-1/2 w-full md:w-[calc(50svw)]  overflow-y-scroll bg-white ";
const NEUTRAL_SCORE = 50;

const QUESTIONS = [
  { key: "response_speed_and_followup", text: _STRINGS.RATE_RESPONSE_SPEED },
  { key: "advisor_behavior", text: _STRINGS.RATE_RESPONSIBILITY },
  { key: "advisor_responsibility", text: _STRINGS.RATE_BEHAVIOUR },
] as const;

const AdvisorRatingSheet = ({
  show,
  onHide,
  advisor,
}: AdvisorRatingSheetProps) => {
  const [values, setValues] = useState(() => ({
    advisor_behavior: advisor?.user_rate?.advisor_behavior ?? NEUTRAL_SCORE,
    advisor_responsibility:
      advisor?.user_rate?.advisor_responsibility ?? NEUTRAL_SCORE,
    response_speed_and_followup:
      advisor?.user_rate?.response_speed_and_followup ?? NEUTRAL_SCORE,
  }));

  const { mutate, isPending } = useRateAdvisor();

  const onSubmit = () => {
    if (!advisor?.id || isPending) return;
    mutate(
      {
        advisorId: advisor.id,
        advisor_behavior: values.advisor_behavior,
        advisor_responsibility: values.advisor_responsibility,
        response_speed_and_followup: values.response_speed_and_followup,
      },
      { onSuccess: onHide },
    );
  };

  return (
    <ModalBottomSheet
      show={!!show}
      onHide={onHide}
      options={{ containerClass: SHEET_CLASS }}
    >
      <div className="flex px-4 pb-8 pt-4 flex-col gap-6 w-full">
        <p className="w-full text-center font-bold pb-3 border-b">
          {_STRINGS.RECORD_CONSULTANT_SCORE}
        </p>

        {QUESTIONS.map((question, index) => (
          <div
            key={question.key}
            className="flex text-xs md:text-sm w-full flex-col gap-12 px-4"
          >
            <p>
              <span className="text-brand-600 font-bold">{index + 1}.</span>
              {question.text}
            </p>
            <RangeWithTitle
              showMark
              step={25}
              max={100}
              min={25}
              className=" w-full "
              marks={easyRatingItems}
              item={{ visibleDot: true, reverse: true }}
              value={Number(values[question.key]) || 0}
              setValue={(value: number) =>
                setValues((previous) => ({
                  ...previous,
                  [question.key]: value,
                }))
              }
            />
          </div>
        ))}

        <Button
          width="w-full"
          onClick={onSubmit}
          loading={isPending}
          disabled={isPending}
          roundedClass="rounded-full"
          containerClass="w-full pt-6"
          title={_STRINGS.RECORD_SCORE}
        />
      </div>
    </ModalBottomSheet>
  );
};

export default AdvisorRatingSheet;
