"use client";

import { Suspense } from "react";
import { Toaster } from "sonner";

import AuthQueriesSetter from "./AuthQueriesSetter.client";
import LoginModal from "./LoginModal.client";

const AppOverlays = () => (
  <>
    <Suspense>
      <AuthQueriesSetter />
    </Suspense>
    <Toaster />
    <LoginModal />
  </>
);

export default AppOverlays;
