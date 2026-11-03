"use client";

import { testAccessMeOptions } from "../api/test-access.options";
import { useQuery } from "@tanstack/react-query";

export const useTestAccessMe = (enabled = true) =>
  useQuery(testAccessMeOptions(enabled));
