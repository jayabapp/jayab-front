export type AuthTermsProps = {
  visibleTermsModal: boolean;
  setvisibleTermsModal: (visible: boolean) => void;
  termsLoading: boolean;
  termsContent?: { html?: string; full_text?: string };
};

export type OtpInputProps = {
  setValue: (value: string) => void;
};
