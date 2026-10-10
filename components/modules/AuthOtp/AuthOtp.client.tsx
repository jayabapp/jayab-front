"use client";

import { useTranslations } from "next-intl";
import { AuthHeader } from "@layouts/AuthHeader";

import AuthOtpCard from "./AuthOtpCard.client";

const OtpPageSignInComponent = () => {
  const t = useTranslations("auth");

  return (
    <div className="auth-container">
      <AuthHeader title={t("confirmCode")} backRoute="/auth" />
      <div className="glass-panel auth-card-enter w-full max-w-md px-6 pb-8 pt-10 md:px-9">
        <AuthOtpCard />
      </div>
    </div>
  );
};

export default OtpPageSignInComponent;
