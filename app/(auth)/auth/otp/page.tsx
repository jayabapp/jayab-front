import { AuthOtpTemplate } from "@templates/AuthOtp";
import { Suspense } from "react";

const OtpPage = () => (
  <Suspense>
    <AuthOtpTemplate />
  </Suspense>
);

export default OtpPage;
