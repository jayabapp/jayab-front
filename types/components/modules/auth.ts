import type { OtpChallengeDto } from "@/api_services/auth/auth.interface";

export type AuthTermsProps = {
  visibleTermsModal: boolean;
  setvisibleTermsModal: (visible: boolean) => void;
  termsLoading: boolean;
  termsContent?: { html?: string; full_text?: string };
};

export type OtpInputProps = {
  setValue: (value: string) => void;
};

export type AuthOtpCardProps = {
  /**
   * Challenge handed over by the in-page flip, which already received it from
   * the send-OTP response. When it is absent the card falls back to reading the
   * challenge cookie itself, which is what the standalone /auth/otp route does.
   */
  challenge?: OtpChallengeDto | null;
  /** Flips back to the phone step instead of routing away from the page. */
  onEditNumber?: () => void;
};
