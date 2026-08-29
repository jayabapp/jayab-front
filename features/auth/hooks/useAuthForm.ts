import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeInternalPath } from "@/helpers/safeRedirect";
import { useAuthStore } from "@/store";
import { useSendOtp } from "./useSendOtp";
import { p2e } from "@/helpers/NumberConverter";

import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";

export const useAuthForm = () => {
  const [mobile, setMobile] = useState<number | string>("");
  const [visibleTermsModal, setVisibleTermsModal] = useState(false);
  const submissionLockRef = useRef(false);
  const isLogin = useAuthStore((state) => state.isLogin);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sendOtp = useSendOtp();

  const submit = () => {
    if (submissionLockRef.current) return;
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
      onSuccess: ({ challenge }) => {
        if (challenge?.sandbox_otp_code) {
          Notify({
            type: "info",
            body: `${_STRINGS.SANDBOX_OTP}: ${challenge.sandbox_otp_code}`,
          });
        }
        const redirectUrl = safeInternalPath(searchParams.get("redirect_url"));
        const query = redirectUrl
          ? `?redirect_url=${encodeURIComponent(redirectUrl)}`
          : "";
        router.replace(`/auth/otp${query}`);
        useAuthStore.setState({
          authCodeExpire: challenge?.expires_at ?? null,
        });
      },
      onSettled: () => {
        submissionLockRef.current = false;
      },
    });
  };
  const submitEvent = useEffectEvent(submit);

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
    mobile,
    setMobile,
    submit,
    isSubmitting: sendOtp.isPending,
    visibleTermsModal,
    setVisibleTermsModal,
  };
};
