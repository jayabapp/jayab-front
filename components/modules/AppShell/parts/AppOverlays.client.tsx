"use client";

import { Suspense } from "react";
import { Toaster } from "sonner";

import AuthQueriesSetter from "./AuthQueriesSetter.client";
import LoginModal from "@/components/Modal/LoginModal";

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
