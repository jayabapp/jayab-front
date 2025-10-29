"use client";
import AuthPageComponent from "@/components/SinglePageComponents/AuthComponent";
import React, { Suspense } from "react";
const Auth = () => {
  return (
    <Suspense>
      <AuthPageComponent />
    </Suspense>
  );
};

export default Auth;
