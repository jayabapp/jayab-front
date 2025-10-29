"use client";
import OtpPageSignInComponent from "@/components/SinglePageComponents/OtpPageComponent";
import { useAuthStore, useStoreSocket, useStoreTheme } from "@/store";
import React, { Suspense } from "react";

const Auth = () => {
  const { socket } = useStoreSocket((state) => state);
  return (
    <Suspense>
      {" "}
      <OtpPageSignInComponent socket={socket} authUserStore={useAuthStore} />
    </Suspense>
  );
};

export default Auth;
