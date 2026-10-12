import type { OtpChallengeDto } from "@/api_services/auth/auth.interface";
import type { Locale } from "@/i18n/config";

export type AuthTermsProps = {
  termsLoading: boolean;
  visibleTermsModal: boolean;
  setvisibleTermsModal: (visible: boolean) => void;
  termsContent?: {
    html?: string;
    full_text?: string;
    content_locale?: Locale;
  } | null;
};

export type OtpInputProps = {
  setValue: (value: string) => void;
};

export type AuthOtpCardProps = {
  onEditNumber?: () => void;
  challenge?: OtpChallengeDto | null;
};
