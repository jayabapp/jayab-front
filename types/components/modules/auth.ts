import type { OtpChallengeDto } from "@/api_services/auth/auth.interface";

export type AuthTermsProps = {
  termsLoading: boolean;
  visibleTermsModal: boolean;
  setvisibleTermsModal: (visible: boolean) => void;
  termsContent?: { html?: string; full_text?: string };
};

export type OtpInputProps = {
  setValue: (value: string) => void;
};

export type AuthOtpCardProps = {
  onEditNumber?: () => void;
  challenge?: OtpChallengeDto | null;
};
