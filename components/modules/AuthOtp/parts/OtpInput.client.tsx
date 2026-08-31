"use client";

import type { OtpInputProps } from "@/types/components/modules/auth";
import { useEffect, useRef, useState } from "react";
import { p2e } from "@/helpers/NumberConverter";

const OTP_LENGTH = 4;

const OtpInput = ({ setValue }: OtpInputProps) => {
  const [digits, setDigits] = useState(() =>
    Array<string>(OTP_LENGTH).fill(""),
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const updateDigits = (nextDigits: string[]) => {
    setDigits(nextDigits);
    setValue(nextDigits.join(""));
  };

  useEffect(() => {
    if (!("OTPCredential" in window)) return;
    const controller = new AbortController();
    const credentials = navigator.credentials as CredentialsContainer & {
      get: (
        options: CredentialRequestOptions & { otp: { transport: string[] } },
      ) => Promise<Credential | null>;
    };
    void credentials
      .get({ otp: { transport: ["sms"] }, signal: controller.signal })
      .then((credential) => {
        const code = p2e(
          (credential as Credential & { code?: string })?.code ?? "",
        ).slice(0, OTP_LENGTH);
        if (code.length === OTP_LENGTH) updateDigits(code.split(""));
      })
      .catch(() => undefined);
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="otp"
      dir="ltr"
      className="mt-5 flex w-full flex-row items-center justify-between text-center"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          aria-label={`رقم ${index + 1} کد ورود`}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={index === 0}
          inputMode="numeric"
          className={`h-14 w-16 rounded-10 border bg-white/80 text-center text-lg font-medium opacity-80 ${digit ? "border-brand-600 " : ""}`}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(event) => {
            const value = p2e(event.target.value).replace(/\D/g, "").slice(-1);
            const next = [...digits];
            next[index] = value;
            updateDigits(next);
            if (value) inputRefs.current[index + 1]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit)
              inputRefs.current[index - 1]?.focus();
          }}
          onPaste={(event) => {
            const pasted = p2e(event.clipboardData.getData("text"))
              .replace(/\D/g, "")
              .slice(0, OTP_LENGTH);
            if (!pasted) return;
            event.preventDefault();
            const next = Array<string>(OTP_LENGTH).fill("");
            pasted.split("").forEach((value, digitIndex) => {
              next[digitIndex] = value;
            });
            updateDigits(next);
            inputRefs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
          }}
        />
      ))}
    </div>
  );
};

export default OtpInput;
