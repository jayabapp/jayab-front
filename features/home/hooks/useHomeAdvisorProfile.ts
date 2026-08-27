"use client";

import { useAdvisorProfile } from "@features/advisors/hooks/useAdvisorProfile";

export const useHomeAdvisorProfile = (isLogin: boolean) => useAdvisorProfile(isLogin);
