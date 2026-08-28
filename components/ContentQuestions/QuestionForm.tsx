"use client";

import { colors } from "@/theme/colors";

import { FC, Fragment, useEffect, useState } from "react";
import { useSubmitContentQuestion } from "@features/home/hooks/useContentQuestions";
import { useRecaptchaGenerator } from "@/helpers/captcha.helper";
import { useStoreInit } from "@/store";
import { p2e } from "@/helpers/NumberConverter";

import MultiLineFormInput from "../shared/Form/MultiLineFormInput";
import FormInput from "../shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import Button from "../shared/Button/Button";
import Notify from "../shared/Toast";

export const QuestionForm: FC<{
  contentId?: string | number;
  productId?: string | number;
  captchaKey?: string;
}> = ({ contentId, productId, captchaKey }) => {
  const { userInfo } = useStoreInit((data) => data);
  const [author_name, setauthor_name] = useState(``);
  const [mobile_number, setmobile_number] = useState(
    userInfo?.mobile_number || "",
  );
  const [question, setquestion] = useState("");
  const [rate, setRate] = useState(3);
  const [recaptcha, setRecaptcha] = useState("");
  const { regenerate, validateCaptcha } = useRecaptchaGenerator(
    5,
    5,
    30,
    captchaKey,
  );
  const { mutate, isPending: isSending } = useSubmitContentQuestion(() => {
    setquestion("");
    setmobile_number("");
    setauthor_name("");
    setRecaptcha("");
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      regenerate();
    }, 10);
    return () => clearTimeout(timeout);
  }, [regenerate]);
  const onSendClick = () => {
    if (!validateCaptcha(recaptcha)) {
      Notify({ body: _STRINGS.RECAPTHCA_ERROR });
      regenerate();
    } else {
      mutate({
        author_name,
        content_id: contentId,
        product_id: productId,
        rate,
        mobile_number: p2e(mobile_number),
        question,
      });
    }
  };
  const _onRateClick = (rate: number) => {
    setRate(rate);
  };

  return (
    <Fragment>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="md:col-span-2 flex flex-col md:flex-row md:items-center justify-start gap-5">
          <p className="col-span-1">امتیاز خود را ثبت کنید</p>
          <div className="flex flex-row w-fit justify-between">
            {[5, 4, 3, 2, 1].map((i) => {
              if (Number(rate) >= i) {
                return (
                  <img
                    src="/assets/icons/blogs/filled_star.svg"
                    onClick={() => _onRateClick(i)}
                    color={colors.warning[500]}
                    className={` h-8 aspect-square mx-1  cursor-pointer `}
                    key={i}
                  />
                );
              } else {
                return (
                  <img
                    src="/assets/icons/blogs/empty_star.svg"
                    color={colors.neutral[300]}
                    onClick={() => _onRateClick(i)}
                    className={` h-8 aspect-square mx-1 cursor-pointer `}
                    key={i}
                  />
                );
              }
            })}
          </div>
        </div>
        <div className="col-span-1! flex flex-col gap-4">
          <FormInput
            value={author_name}
            item={{
              title: _STRINGS.ASK_QUESTION_NAME,
              placeholder: _STRINGS.ASK_QUESTION_NAME_PLACEHOLDER,
              containerClass: "w-full",
              inputClass: "bg-white! border-neutral-200! ",
            }}
            onChangeText={setauthor_name}
          />
        </div>
        <div className="col-span-1! flex flex-col gap-4">
          <FormInput
            value={mobile_number}
            item={{
              title: _STRINGS.ASK_QUESTION_PHONE,
              placeholder: _STRINGS.ASK_QUESTION_PHONE_PLACEHOLDER,
              keyboard: "number",
              containerClass: "w-full",
              maxLength: 11,
              inputClass: "bg-white! border-neutral-200! ",
            }}
            onChangeText={setmobile_number}
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <MultiLineFormInput
            value={question}
            item={{
              title: "",
              rows: 6,
              placeholder: _STRINGS.ASK_QUESTION_DESCRIPTION_PLACEHOLDER,
              containerClass: "w-full",
              inputClass: "bg-white! border-neutral-200! w-full!",
            }}
            onChangeText={setquestion}
          />
        </div>
      </div>
      <div className="w-full mt-4 flex flex-col  gap-2 md:flex-row  items-center justify-between">
        <div className="w-full md:w-fit gap-4 flex flex-col md:flex-row items-start md:items-center  justify-between">
          <div className="w-fit">
            <div className="flex flex-row gap-4 items-center">
              <div className="cursor-pointer" onClick={regenerate}>
                refresh
              </div>
              <canvas id={captchaKey || "recaptcha"} />
            </div>
          </div>
          <FormInput
            value={recaptcha}
            onChangeText={setRecaptcha}
            item={{
              placeholder: _STRINGS.ASK_QUESTION_CAPTCHA,
              maxLength: 5,
              containerClass: "w-full! md:w-fit!",
              inputClass: "bg-white!  border-neutral-200! ",
              direction: "rtl",
            }}
          />
        </div>
        <Button
          width="w-full"
          loading={isSending}
          onClick={onSendClick}
          roundedClass="rounded-full"
          title={_STRINGS.ASK_QUESTION_SUBMIT}
          containerClass="w-full md:w-fit self-start"
        />
      </div>
    </Fragment>
  );
};
