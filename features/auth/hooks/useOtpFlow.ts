import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useAuthQueriesStore, useAuthStore } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateTimeLeft } from "@/helpers/calculateTimeLeft";
import { safeInternalPath } from "@/helpers/safeRedirect";
import { useOtpChallenge } from "./useOtpChallenge";
import { useVerifyOtp } from "./useVerifyOtp";
import type { OtpChallengeDto } from "@/api_services/auth/auth.interface";
import { AuthService } from "@/api_services/auth/auth.service";
import { useSendOtp } from "./useSendOtp";
import { p2e } from "@/helpers/NumberConverter";

import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";

type OtpFlowOptions = {
  /**
   * A challenge the caller already holds. The in-page flip passes the one that
   * came back from the send-OTP response, so the OTP step costs no round-trip;
   * the standalone /auth/otp route passes nothing and reads the cookie instead.
   */
  challenge?: OtpChallengeDto | null;
  /** Replaces the route-back on "edit number" — the flip turns the card over. */
  onEditNumber?: () => void;
};

export const useOtpFlow = ({
  challenge: providedChallenge = null,
  onEditNumber,
}: OtpFlowOptions = {}) => {
  const [otp, setOtp] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const autoSubmittedCodeRef = useRef<string | null>(null);
  const [countdown, setCountdown] = useState({ minutes: "00", seconds: "00" });
  const challengeQuery = useOtpChallenge(!providedChallenge);
  const resend = useSendOtp();
  const verifyMutation = useVerifyOtp();
  const authCodeExpire = useAuthStore((state) => state.authCodeExpire);
  const authQueries = useAuthQueriesStore((state) => state.auth_queries);
  const authQueryParams =
    authQueries && typeof authQueries === "object" ? authQueries : {};
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = safeInternalPath(searchParams.get("redirect_url"));
  // The cache wins when it holds anything: `useSendOtp` writes the new challenge
  // there on resend, so the countdown restarts without another read.
  const challenge = challengeQuery.data ?? providedChallenge;
  const codeExpiry = challenge?.expires_at ?? authCodeExpire;

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
    // Only the cookie-reading caller can conclude that nothing is in flight; the
    // flip owns its challenge in memory and must never bounce itself to /auth.
    if (providedChallenge) return;
    if (!challengeQuery.isPending && !challengeQuery.data)
      router.replace("/auth");
  }, [providedChallenge, challengeQuery.data, challengeQuery.isPending, router]);

  useEffect(() => {
    if (!codeExpiry) return;
    const updateCountdown = () =>
      setCountdown(calculateTimeLeft(`${codeExpiry}`));
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [codeExpiry]);

  // A complete code verifies itself, once per code value. This used to have two
  // more triggers — a document-wide Enter listener and the submit button — and
  // all three fired for a single user gesture, so one wrong code produced three
  // identical requests and a toast that visibly restarted three times. The Enter
  // listener is gone rather than guarded: it also fired for Enter pressed in any
  // other field on the page, and with auto-submit in place it added nothing.
  useEffect(() => {
    const numericCode = p2e(otp);
    if (!/^\d{4}$/.test(numericCode)) {
      // Editing the code re-arms auto-submit, so retyping the same digits after
      // a rejection still verifies.
      autoSubmittedCodeRef.current = null;
      return;
    }
    if (autoSubmittedCodeRef.current === numericCode) return;
    autoSubmittedCodeRef.current = numericCode;
    submitEvent();
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
        autoSubmittedCodeRef.current = null;
        useAuthStore.setState({
          authCodeExpire: challenge?.expires_at ?? null,
        });
      },
    });
  };

  const editNumber = async () => {
    // The flip turns immediately and clears the cookie behind it — waiting on a
    // round-trip before the card moves is exactly what this flow set out to
    // avoid. The standalone route still awaits it, since it navigates after.
    if (onEditNumber) {
      onEditNumber();
      await AuthService.clearOtpChallenge();
      return;
    }
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
    challenge,
    isSubmitting: verifyMutation.isPending,
    challengeLoading: challengeQuery.isPending && !providedChallenge,
  };
};
