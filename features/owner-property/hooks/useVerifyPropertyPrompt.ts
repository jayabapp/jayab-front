"use client";

import {
  acceptVerifyPrompt,
  getServerVerifyPromptSnapshot,
  getVerifyPromptSnapshot,
  rememberVerifyPrompt,
  subscribeVerifyPrompt,
} from "@features/owner-property/lib/verify-prompt";
import { useSyncExternalStore } from "react";

export const useVerifyPropertyPrompt = (
  propertyId?: number | null,
  isAuthorized?: boolean,
) => {
  const prompted = useSyncExternalStore(
    subscribeVerifyPrompt,
    getVerifyPromptSnapshot,
    getServerVerifyPromptSnapshot,
  );

  return {
    accept: () => acceptVerifyPrompt(propertyId),
    dismiss: () => rememberVerifyPrompt(propertyId),
    isOpen: !isAuthorized && !!propertyId && !prompted.includes(propertyId),
  };
};
