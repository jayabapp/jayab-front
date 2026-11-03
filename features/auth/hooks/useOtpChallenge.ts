import { otpChallengeOptions } from "../api/auth.options";
import { useQuery } from "@tanstack/react-query";

export const useOtpChallenge = (enabled = true) =>
  useQuery({ ...otpChallengeOptions(), enabled });
