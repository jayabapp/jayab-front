"use client";

import { referralProfileOptions } from "@features/user/api/user.options";
import { useQuery } from "@tanstack/react-query";

export const useReferralProfile = () => useQuery(referralProfileOptions());
