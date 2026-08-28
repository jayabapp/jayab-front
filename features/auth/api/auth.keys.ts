export const authKeys = {
  all: ["auth"] as const,
  otpChallenge: () => [...authKeys.all, "otp-challenge"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  ownerProfile: () => [...authKeys.all, "owner-profile"] as const,
  init: () => [...authKeys.all, "init"] as const,
};
