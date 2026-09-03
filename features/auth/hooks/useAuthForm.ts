import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { OtpChallengeDto } from "@/api_services/auth/auth.interface";
import { safeInternalPath } from "@/helpers/safeRedirect";
import { useAuthStore } from "@/store";
import { useSendOtp } from "./useSendOtp";
import { p2e } from "@/helpers/NumberConverter";

import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";

/**
 * Keeps the address bar in step with the flip without a client navigation.
 * `history.replaceState` is the App-Router-sanctioned escape hatch: the flip
 * itself costs no fetch, and a refresh still lands on a route that renders the
 * same step. It replaces rather than pushes, which matches the `router.replace`
 * this flow used before — back never returned to the phone step either.
 */
const syncStepUrl = (pathname: string) => {
  if (typeof window === "undefined") return;
  window.history.replaceState(null, "", `${pathname}${window.location.search}`);
};

export const useAuthForm = () => {
  const [mobile, setMobile] = useState<number | string>("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [challenge, setChallenge] = useState<OtpChallengeDto | null>(null);
  const [visibleTermsModal, setVisibleTermsModal] = useState(false);
  const submissionLockRef = useRef(false);
  const isLogin = useAuthStore((state) => state.isLogin);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sendOtp = useSendOtp();

  const submit = () => {
    if (step !== "phone" || submissionLockRef.current) return;
    const mobileNumber = p2e(mobile);
    if (!/^09\d{9}$/.test(mobileNumber)) {
      Notify({
        type: "warn",
        title: _STRINGS.ATTENTION,
        body: _STRINGS.WORNG_NUMBER,
      });
      return;
    }
    submissionLockRef.current = true;
    sendOtp.mutate(mobileNumber, {
      onSuccess: ({ challenge: sentChallenge }) => {
        if (sentChallenge?.sandbox_otp_code) {
          Notify({
            type: "info",
            body: `${_STRINGS.SANDBOX_OTP}: ${sentChallenge.sandbox_otp_code}`,
          });
        }
        useAuthStore.setState({
          authCodeExpire: sentChallenge?.expires_at ?? null,
        });

        // Without a challenge in the response there is nothing to hand the OTP
        // step, so fall back to the route that can read it from the cookie.
        if (!sentChallenge) {
          const redirectUrl = safeInternalPath(searchParams.get("redirect_url"));
          const query = redirectUrl
            ? `?redirect_url=${encodeURIComponent(redirectUrl)}`
            : "";
          router.replace(`/auth/otp${query}`);
          return;
        }

        setChallenge(sentChallenge);
        setStep("otp");
        syncStepUrl("/auth/otp");
      },
      onSettled: () => {
        submissionLockRef.current = false;
      },
    });
  };
  const submitEvent = useEffectEvent(submit);

  const backToPhone = () => {
    // The challenge is deliberately kept: the OTP face outlives this state change
    // by one rotation, and nulling it here would re-enable the challenge query it
    // is meant to avoid — and with it a stray redirect. The next send replaces it.
    setStep("phone");
    syncStepUrl("/auth");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Enter") submitEvent();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (isLogin) router.replace("/");
  }, [isLogin, router]);

  return {
    step,
    mobile,
    setMobile,
    challenge,
    backToPhone,
    submit,
    isSubmitting: sendOtp.isPending,
    visibleTermsModal,
    setVisibleTermsModal,
  };
};
