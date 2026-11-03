import { AuthOtpTemplate } from "@templates/AuthOtp";
import { Suspense } from "react";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OtpPage = () => (
  <IntlNamespaces namespaces={["calendar"]}>
    <Suspense>
      <AuthOtpTemplate />
    </Suspense>
  </IntlNamespaces>
);

export default OtpPage;
