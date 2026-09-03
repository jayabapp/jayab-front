"use client";

import { AuthHeader } from "@layouts/AuthHeader";

import AuthOtpCard from "./AuthOtpCard.client";
import _STRINGS from "@/utils/LocalStrings";

/**
 * Standalone /auth/otp route: reached by a refresh or a direct link, where the
 * challenge has to be read back from the cookie. The happy path flips the card
 * on /auth instead and never lands here.
 */
const OtpPageSignInComponent = () => (
  <div className="auth-container">
    <AuthHeader title={_STRINGS.CONFIRM_CODE} backRoute="/auth" />

    <div className="glass-panel auth-card-enter w-full max-w-md px-6 pb-8 pt-10 md:px-9">
      <AuthOtpCard />
    </div>
  </div>
);

export default OtpPageSignInComponent;
