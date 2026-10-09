"use client";

import { useTheme } from "@hooks/useTheme";
import { Suspense } from "react";
import { Toaster } from "sonner";

import AuthQueriesSetter from "./AuthQueriesSetter.client";
import LoginModal from "./LoginModal.client";

const AppOverlays = () => {
  const { resolved } = useTheme();
  return (
    <>
      <Suspense>
        <AuthQueriesSetter />
      </Suspense>
      <Toaster theme={resolved} />
      <LoginModal />
    </>
  );
};

export default AppOverlays;
