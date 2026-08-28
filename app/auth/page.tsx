import { Suspense } from "react";

import AuthPageComponent from "@/components/SinglePageComponents/AuthComponent";

const Auth = () => {
  return (
    <Suspense>
      <AuthPageComponent />
    </Suspense>
  );
};

export default Auth;
