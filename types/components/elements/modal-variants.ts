import type { ReactNode } from "react";

export type ConfirmModalProps = {
  children?: ReactNode;
  confirmText?: string;
  confirmTextClassName?: string;
  headerImage?: string;
  hideText?: string;
  hideTextClassName?: string;
  isLoading?: boolean;
  isVisible?: boolean;
  messageClass?: string;
  onConfirm: (message?: string | null) => void | null;
  onHide: () => void;
  options?: {
    containerClass?: string;
    hasInput?: boolean;
    inputTitle?: string;
  };
  text: string;
  title?: string;
};

export type SimpleModalProps = {
  children: ReactNode;
  image?: string;
  onClick: () => void;
  subtitle?: string;
  title?: string;
};
