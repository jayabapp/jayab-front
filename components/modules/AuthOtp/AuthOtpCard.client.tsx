"use client";

import type { AuthOtpCardProps } from "@/types/components/modules/auth";
import { useOtpFlow } from "@features/auth/hooks/useOtpFlow";

import OtpInput from "./parts/OtpInput.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Image from "next/image";
import Link from "next/link";

const AuthOtpCard = ({ challenge, onEditNumber }: AuthOtpCardProps) => {
  const {
    setOtp,
    submit,
    resetKey,
    countdown,
    editNumber,
    resendCode,
    isResending,
    isSubmitting,
    challenge: activeChallenge,
  } = useOtpFlow({ challenge, onEditNumber });

  const hasExpired = countdown.seconds === "00" && countdown.minutes === "00";

  return (
    <>
      {/* BRAND */}
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/"
          prefetch={false}
          title={_STRINGS.BACK_TO_HOME}
          className="glass-badge relative flex size-24 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <Image
            width={64}
            height={64}
            unoptimized
            alt={_STRINGS.JAYAB_LOGO_ALT}
            src="/assets/icons/logo/logo.svg"
            className="size-16 object-contain"
          />
        </Link>
        <p className="text-sm text-neutral-600">{_STRINGS.AUTH_CODE_SENT_TO}</p>
        <button
          type="button"
          onClick={() => void editNumber()}
          className="glass-chip text-sm font-medium text-neutral-900"
        >
          <bdi dir="ltr" className="inline-block tracking-widest">
            {activeChallenge?.masked_mobile}
          </bdi>
        </button>
      </div>

      {/* CODE */}
      <div className="mt-8 flex w-full flex-col gap-5">
        <p className="text-center text-xs text-neutral-600">
          {_STRINGS.ENTER_FOUR_DIGITS}
        </p>

        <OtpInput setValue={setOtp} key={resetKey} />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => void editNumber()}
            className="flex cursor-pointer items-center gap-1 text-sm text-brand-600"
          >
            <Image
              width={16}
              height={16}
              alt={_STRINGS.EDIT_NUMBER}
              src="/assets/icons/edit/blue_edit_pen.svg"
            />
            <span>{_STRINGS.EDIT_NUMBER}</span>
          </button>

          {hasExpired ? (
            <button
              type="button"
              disabled={isResending}
              onClick={resendCode}
              className="glass-chip cursor-pointer text-sm font-medium text-brand-600 disabled:opacity-50"
            >
              {_STRINGS.SEND_AGAIN}
            </button>
          ) : (
            <div className="glass-chip flex items-center gap-2 text-xs text-neutral-600">
              <span>{_STRINGS.CODE_EXPI_TIME}</span>
              <bdi dir="ltr" className="font-medium text-neutral-900">
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
          containerClass="mt-2 w-full"
          roundedClass="rounded-2xl"
          btnClass="btn-glass-primary !py-3.5"
          title={_STRINGS.ENTER_AND_MOVE_ON}
        />
      </div>
    </>
  );
};

export default AuthOtpCard;
