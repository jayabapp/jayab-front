import { SingleAdvisorDto } from "@/api_services/advisor/advisor.interface";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import Button from "@/components/shared/Button/Button";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import { easyRatingItems } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useState } from "react";
import { useRateAdvisor } from "@features/advisors/hooks/useRateAdvisor";

const RatePop = ({
  show,
  onHide,
  data,
}: {
  show: boolean;
  onHide: () => void | null;
  data: SingleAdvisorDto | null | undefined;
}) => {
  const [values, setValues] = useState(() => ({
    response_speed_and_followup: data?.user_rate?.response_speed_and_followup ?? 50,
    advisor_behavior: data?.user_rate?.advisor_behavior ?? 50,
    advisor_responsibility: data?.user_rate?.advisor_responsibility ?? 50,
  }));

  const onChange = (value: string | number | null | number[], key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const { mutate: rateFunc, isPending: rateLoading } = useRateAdvisor();

  const onSubmit = () => {
    if (data?.id)
      rateFunc({
        advisorId: data?.id,
        advisor_behavior: values?.advisor_behavior,
        advisor_responsibility: values?.advisor_responsibility,
        response_speed_and_followup: values?.response_speed_and_followup,
      }, { onSuccess: onHide });
  };

  return (
    <ModalBottomSheet
      options={{
        containerClass: `mx-auto rounded-t-20 absolute pb-[1.5rem] md:pb-10 bottom-0 md:translate-x-1/2 md:right-1/2 w-full md:w-[calc(50svw)]  overflow-y-scroll bg-white `,
      }}
      onHide={onHide}
      show={!!show}
    >
      <div
        className=" flex px-4  pb-8 pt-4 flex-col gap-6 w-full
"
      >
        <p className="w-full text-center font-bold pb-3 border-b">{_STRINGS.RECORD_CONSULTANT_SCORE}</p>
        <div className="flex text-xs md:text-sm w-full flex-col gap-12 px-4 ">
          <p>
            <span className="text-brand-600 font-bold">1.</span>میزان رضایت شما از سرعت پیگیری و نحوه پاسخگویی مشاور
          </p>

          <RangeWithTitle
            item={{ visibleDot: true, reverse: true }}
            className=" w-full  rtl"
            marks={easyRatingItems}
            showMark
            step={25}
            max={100}
            min={25}
            setValue={(e: any) => {
              onChange(e, "response_speed_and_followup");
            }}
            value={Number(values?.response_speed_and_followup) || 0}
          />
        </div>
        <div className="flex text-xs md:text-sm  w-full flex-col gap-12 px-4 ">
          <p>
            <span className="text-brand-600 font-bold">2.</span> میزان رضایت شما از مسئولیت پذیری و مشاوره صحیح مشاور
            در خصوص رزرو اقامتگاه
          </p>
          <RangeWithTitle
            showMark
            item={{ visibleDot: true, reverse: true }}
            className=" w-full   "
            marks={easyRatingItems}
            step={25}
            max={100}
            min={25}
            setValue={(e: any) => {
              onChange(e, "advisor_behavior");
            }}
            value={Number(values?.advisor_behavior) || 0}
          />
        </div>
        <div className="flex w-full flex-col text-xs md:text-sm gap-12 px-4 ">
          <p>
            <span className="text-brand-600 font-bold">3.</span>میزان رضایت شما از برخورد مشاور و پیگیری مراحل تا
            تحویل اقامتگاه
          </p>
          <RangeWithTitle
            showMark
            className=" w-full "
            marks={easyRatingItems}
            item={{ visibleDot: true, reverse: true }}
            step={25}
            max={100}
            min={25}
            setValue={(e: any) => {
              onChange(e, "advisor_responsibility");
            }}
            value={Number(values?.advisor_responsibility) || 0}
          />
        </div>
        <Button
          loading={rateLoading}
          onClick={onSubmit}
          title={_STRINGS.RECORD_SCORE}
          width="w-full"
          containerClass="w-full pt-6"
          roundedClass="rounded-full"
        />
      </div>
    </ModalBottomSheet>
  );
};

export default RatePop;
