"use client";

import { useAuthForm } from "@features/auth/hooks/useAuthForm";
import { AuthHeader } from "@layouts/AuthHeader";
import { AuthOtpCard } from "@modules/AuthOtp";
import { FormInput } from "@elements/Form";
import { useState } from "react";

import DotLoading from "@elements/Button/DotLoading";
import useCmsContent from "@/hooks/useCmsContent";
import _STRINGS from "@/utils/LocalStrings";
import Terms from "./parts/Terms.client";
import Button from "@elements/Button";
import Image from "next/image";
import Link from "next/link";

const AuthPageComponent = () => {
  const {
    step,
    submit,
    mobile,
    challenge,
    setMobile,
    isSubmitting,
    backToPhone,
    visibleTermsModal,
    setVisibleTermsModal,
  } = useAuthForm();

  const { content: terms, isLoading: termsLoading } = useCmsContent("terms");
  const isOtpStep = step === "otp";

  // The OTP face is mounted only while it is in play: its WebOTP listener,
  // autofocus and countdown must not run behind the phone form. On the way back
  // it has to outlive the state change, or the face the user is still looking at
  // would empty out mid-rotation — so it is torn down on transitionend instead.
  const [rotatingBack, setRotatingBack] = useState(false);
  const otpVisible = isOtpStep || rotatingBack;

  const flipBack = () => {
    setRotatingBack(true);
    backToPhone();
  };

  return (
    <div className="auth-container">
      <AuthHeader
        title={isOtpStep ? _STRINGS.CONFIRM_CODE : _STRINGS.ENTER}
        onBack={isOtpStep ? flipBack : undefined}
      />

      <div className="flip-scene auth-card-enter w-full max-w-md">
        <div
          className={`flip-card ${isOtpStep ? "is-flipped" : ""}`}
          onTransitionEnd={(event) => {
            if (event.propertyName === "transform") setRotatingBack(false);
          }}
        >
          {/* PHONE */}
          <div
            inert={isOtpStep}
            className="flip-face glass-panel px-6 pb-8 pt-10 md:px-9"
          >
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
              <h1 className="text-xl font-bold text-neutral-900">
                {_STRINGS.AUTH_WELCOME_TITLE}
              </h1>
              <p className="max-w-64 text-center text-sm text-neutral-600">
                {_STRINGS.ENTER_TOUR_MOBILE_NUMBER}
              </p>
            </div>

            <div className="mt-8 flex w-full flex-col gap-5">
              <FormInput
                value={mobile}
                item={{
                  maxLength: 11,
                  direction: "ltr",
                  keyboard: "number",
                  autoFocus: false,
                  containerClass: "relative w-full",
                  placeholder: _STRINGS.MOBILE_PLACEHOLDER,
                  inputClass:
                    "glass-field !rounded-2xl !py-4 !text-lg tracking-[0.3em] !text-center placeholder:!text-center placeholder:!text-base placeholder:tracking-[0.3em]",
                }}
                onChangeText={(v: number) => {
                  setMobile(v);
                }}
              />

              <div className="flex flex-wrap items-center justify-center gap-1 text-xs text-neutral-600">
                <p>{_STRINGS.U_ACCEPTED}</p>
                <button
                  type="button"
                  onClick={() => setVisibleTermsModal(true)}
                  className="font-medium text-brand-600 underline underline-offset-4"
                >
                  {_STRINGS?.TERMS}
                </button>
                <p>{_STRINGS.AUTH_TERMS_SUFFIX}</p>
              </div>

              <Button
                width="w-full"
                onClick={submit}
                loading={isSubmitting}
                loadingIndicator={<DotLoading />}
                preserveStyleWhileLoading
                disabled={isSubmitting}
                containerClass="w-full"
                roundedClass="rounded-2xl"
                btnClass="btn-glass-primary !py-3.5"
                title={_STRINGS?.ENTER_AND_MOVE_ON}
              />

              <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-600">
                <svg
                  fill="none"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeWidth="2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 10V8a6 6 0 1 1 12 0v2m-13 0h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"
                  />
                </svg>
                <span>{_STRINGS.AUTH_SECURE_NOTE}</span>
              </div>
            </div>
          </div>

          {/* CODE */}
          <div
            inert={!isOtpStep}
            className="flip-face flip-face-back glass-panel px-6 pb-8 pt-10 md:px-9"
          >
            {otpVisible ? (
              <AuthOtpCard challenge={challenge} onEditNumber={flipBack} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      {/* The modal is a plain `fixed` element, and the flip card's transform and
          backdrop-filter would both make it the containing block — so it stays
          outside the rotating surface. */}
      <Terms
        termsLoading={termsLoading}
        visibleTermsModal={visibleTermsModal}
        setvisibleTermsModal={setVisibleTermsModal}
        termsContent={terms ? terms : { full_text: "", html: "" }}
      />
    </div>
  );
};

export default AuthPageComponent;
