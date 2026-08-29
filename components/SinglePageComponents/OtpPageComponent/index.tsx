"use client";

import { useOtpFlow } from "@features/auth/hooks/useOtpFlow";

import AuthHeader from "@/components/headers/AuthHeader";
import _STRINGS from "@/utils/LocalStrings";
import OtpInput from "./OtpInput";
import Button from "@elements/Button";
import Image from "next/image";

const OtpPageSignInComponent = () => {
  const {
    setOtp,
    submit,
    resetKey,
    challenge,
    countdown,
    editNumber,
    resendCode,
    isResending,
    isSubmitting,
  } = useOtpFlow();
  const hasExpired = countdown.seconds === "00" && countdown.minutes === "00";

  return (
    <div className="auth-container flex min-h-screen h-fit flex-col items-center gap-8 bg-cover md:pb-8">
      <AuthHeader title={_STRINGS.CONFIRM_CODE} customeBackRoute="/auth" />
      <div className="mt-8 flex w-full flex-col items-center gap-6 rounded-2xl pb-8 pt-0 md:w-3/4 md:border md:pt-8 md:shadow-lg lg:w-[35%] ">
        <div className="relative z-1 flex size-28 flex-col items-center gap-2">
          <Image
            fill
            unoptimized
            alt="لوگوی جایاب"
            className="object-contain"
            src="/assets/icons/logo/logo.svg"
          />
        </div>
        <div className="relative z-1 mx-auto flex w-full flex-col items-center gap-8 rounded-2xl px-4 py-4">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col items-start justify-center gap-1 px-1 lg:px-4 2xl:px-8">
              <button type="button" onClick={() => void editNumber()}>
                <bdi dir="ltr" className="inline-block text-base font-medium">
                  {challenge?.masked_mobile}
                </bdi>
              </button>
              <p className="text-xs">{_STRINGS.ENTER_FOUR_DIGITS}</p>
              <OtpInput setValue={setOtp} key={resetKey} />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => void editNumber()}
                className="flex cursor-pointer items-center gap-1"
              >
                <Image
                  width={16}
                  height={16}
                  alt="ویرایش شماره"
                  src="/assets/icons/edit/blue_edit_pen.svg"
                />
                <span className="text-sm text-brand-600">
                  {_STRINGS.EDIT_NUMBER}
                </span>
              </button>
              {hasExpired ? (
                <button
                  type="button"
                  disabled={isResending}
                  onClick={resendCode}
                  className="cursor-pointer rounded-md py-1.5 text-sm text-brand-600 disabled:opacity-50"
                >
                  {_STRINGS.SEND_AGAIN}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <span>{_STRINGS.CODE_EXPI_TIME}:</span>
                  <bdi dir="ltr">
                    {countdown.minutes}:{countdown.seconds}
                  </bdi>
                </div>
              )}
            </div>
            <Button
              width="w-full"
              onClick={submit}
              loading={isSubmitting}
              disabled={isSubmitting}
              roundedClass="rounded-full"
              containerClass="mt-16 w-full"
              title={_STRINGS.ENTER_AND_MOVE_ON}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPageSignInComponent;
