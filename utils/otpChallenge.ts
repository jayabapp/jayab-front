import type { NextResponse } from "next/server";

export const OTP_CHALLENGE_COOKIE = "otp_challenge";

export const OTP_CODE_TTL_MS = 3 * 60 * 1000;

const COOKIE_MAX_AGE = 15 * 60;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export type OtpChallenge = { mobile: string; expiresAt: number };

export const isValidMobile = (value: unknown): value is string =>
  typeof value === "string" && /^09\d{9}$/.test(value);

export const maskMobile = (mobile: string) =>
  `${mobile.slice(0, 4)}***${mobile.slice(-4)}`;

export const readOtpChallenge = (raw?: string): OtpChallenge | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (!isValidMobile(parsed?.mobile) || typeof parsed?.expiresAt !== "number")
      return null;
    if (parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const setOtpChallenge = (
  response: NextResponse,
  challenge: OtpChallenge,
) => {
  const value = Buffer.from(JSON.stringify(challenge), "utf8").toString(
    "base64url",
  );
  response.cookies.set(OTP_CHALLENGE_COOKIE, value, {
    ...cookieOptions,
    maxAge: COOKIE_MAX_AGE,
  });
};

export const clearOtpChallenge = (response: NextResponse) => {
  response.cookies.set(OTP_CHALLENGE_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
};
