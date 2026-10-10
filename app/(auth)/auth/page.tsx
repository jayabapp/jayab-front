import { AuthTemplate } from "@templates/Auth";
import { Suspense } from "react";

import IntlNamespaces from "@/i18n/IntlNamespaces";

const Auth = () => {
  return (
    <IntlNamespaces namespaces={["calendar"]}>
      <Suspense>
        <AuthTemplate />
      </Suspense>
    </IntlNamespaces>
  );
};

export default Auth;
