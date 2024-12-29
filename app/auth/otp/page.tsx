"use client";
import OtpPageSignInComponent from "@/components/SinglePageComponents/OtpPageComponent";
import { useAuthStore, useStoreSocket, useStoreTheme } from "@/store";
import React from "react";

const Auth = () => {
  const { socket } = useStoreSocket((state) => state);
  return <OtpPageSignInComponent socket={socket} authUserStore={useAuthStore} />;
};

export default Auth;
