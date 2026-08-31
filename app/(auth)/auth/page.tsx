import { AuthTemplate } from "@templates/Auth";
import { Suspense } from "react";

const Auth = () => {
  return (
    <Suspense>
      <AuthTemplate />
    </Suspense>
  );
};

export default Auth;
