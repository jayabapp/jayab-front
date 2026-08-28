import { Suspense } from "react";

import OtpPageSignInComponent from "@/components/SinglePageComponents/OtpPageComponent";

const OtpPage = () => (
  <Suspense>
    <OtpPageSignInComponent />
  </Suspense>
);

export default OtpPage;
