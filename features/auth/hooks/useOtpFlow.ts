import { useEffect, useEffectEvent, useState } from "react";
import { useAuthQueriesStore, useAuthStore } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateTimeLeft } from "@/helpers/calculateTimeLeft";
import { safeInternalPath } from "@/helpers/safeRedirect";
import { useOtpChallenge } from "./useOtpChallenge";
import { useVerifyOtp } from "./useVerifyOtp";
import { AuthService } from "@/api_services/auth/auth.service";
import { useSendOtp } from "./useSendOtp";
import { p2e } from "@/helpers/NumberConverter";

import _STRINGS from "@/utils/LocalStrings";
import Notify from "@/components/shared/Toast";

export const useOtpFlow = () => {
  const [otp, setOtp] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [countdown, setCountdown] = useState({ minutes: "00", seconds: "00" });
  const challengeQuery = useOtpChallenge();
  const resend = useSendOtp();
  const verifyMutation = useVerifyOtp();
  const authCodeExpire = useAuthStore((state) => state.authCodeExpire);
  const authQueries = useAuthQueriesStore((state) => state.auth_queries);
  const authQueryParams =
    authQueries && typeof authQueries === "object" ? authQueries : {};
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = safeInternalPath(searchParams.get("redirect_url"));
  const codeExpiry = challengeQuery.data?.expires_at ?? authCodeExpire;

  const submit = () => {
    const numericCode = p2e(otp);
    if (!/^\d{4}$/.test(numericCode)) {
      Notify({
        type: "warn",
        title: _STRINGS.ATTENTION,
        body: _STRINGS.SHORT_CODE,
      });
      return;
    }
    verifyMutation.verify(
      {
        code: numericCode,
        query_params: {
          redirectUrl: redirectUrl ?? undefined,
          ...authQueryParams,
        },
      },
      {
        onSuccess: (result) => {
          useAuthQueriesStore.setState({ auth_queries: null });
          if (result?.needs_registration) {
            const query = redirectUrl
              ? `?redirect_url=${encodeURIComponent(redirectUrl)}`
              : "";
            router.replace(`/auth/register${query}`);
          } else {
            router.replace(redirectUrl ?? "/");
          }
        },
      },
    );
  };
  const submitEvent = useEffectEvent(submit);

  useEffect(() => {
    if (!challengeQuery.isPending && !challengeQuery.data)
      router.replace("/auth");
  }, [challengeQuery.data, challengeQuery.isPending, router]);

  useEffect(() => {
    if (!codeExpiry) return;
    const updateCountdown = () =>
      setCountdown(calculateTimeLeft(`${codeExpiry}`));
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [codeExpiry]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Enter") submitEvent();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (otp.length === 4) submitEvent();
  }, [otp]);

  const resendCode = () => {
    if (
      resend.isPending ||
      countdown.minutes !== "00" ||
      countdown.seconds !== "00"
    )
      return;
    resend.mutate(undefined, {
      onSuccess: ({ challenge }) => {
        if (challenge?.sandbox_otp_code) {
          Notify({
            type: "info",
            body: `${_STRINGS.SANDBOX_OTP}: ${challenge.sandbox_otp_code}`,
          });
        }
        setOtp("");
        setResetKey((current) => current + 1);
        useAuthStore.setState({
          authCodeExpire: challenge?.expires_at ?? null,
        });
      },
    });
  };

  const editNumber = async () => {
    await AuthService.clearOtpChallenge();
    router.replace("/auth");
  };

  return {
    otp,
    submit,
    setOtp,
    resetKey,
    countdown,
    editNumber,
    resendCode,
    isResending: resend.isPending,
    challenge: challengeQuery.data,
    isSubmitting: verifyMutation.isPending,
    challengeLoading: challengeQuery.isPending,
  };
};
