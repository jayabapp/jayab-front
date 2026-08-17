import { NextRequest, NextResponse } from "next/server";
import { callBackend, envelope } from "@/utils/backendFetch";
import { isSameOriginRequest } from "@/utils/sessionCookie";

import {
  OTP_CHALLENGE_COOKIE,
  OTP_CODE_TTL_MS,
  clearOtpChallenge,
  isValidMobile,
  maskMobile,
  readOtpChallenge,
  setOtpChallenge,
} from "@/utils/otpChallenge";

export const dynamic = "force-dynamic";

const forbidden = () =>
  NextResponse.json(envelope("failed", null, null), { status: 403 });

const challengeOf = (request: NextRequest) =>
  readOtpChallenge(request.cookies.get(OTP_CHALLENGE_COOKIE)?.value);

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return forbidden();
  let requested: unknown;
  try {
    requested = (await request.json().catch(() => ({})))?.mobile_number;
  } catch {
    requested = undefined;
  }
  const existing = challengeOf(request);
  const mobile = isValidMobile(requested) ? requested : existing?.mobile;
  if (!mobile) {
    return NextResponse.json(
      envelope("failed", "شماره موبایل وارد شده صحیح نمی باشد.", null),
      { status: 400 },
    );
  }

  const { status, raw } = await callBackend("/auth/otp", {
    method: "POST",
    body: { mobile_number: mobile },
  });

  if (status >= 400) {
    return new NextResponse(raw, {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  let messageFa: string | null = null;
  let sandboxOtpCode: string | undefined;
  try {
    const backendResponse = JSON.parse(raw);
    messageFa = backendResponse?.messages?.fa ?? null;

    const backendOtpCode = backendResponse?.data?.code;
    const normalizedOtpCode = `${backendOtpCode ?? ""}`;
    if (
      process.env.SANDBOX_MODE === "1" &&
      /^\d{4,6}$/.test(normalizedOtpCode)
    ) {
      sandboxOtpCode = normalizedOtpCode;
    }
  } catch {
    // A non-JSON success body is unexpected but not worth failing the login over.
  }

  const expiresAt = Date.now() + OTP_CODE_TTL_MS;
  const response = NextResponse.json(
    envelope("successful", typeof messageFa === "string" ? messageFa : null, {
      masked_mobile: maskMobile(mobile),
      expires_at: new Date(expiresAt).toISOString(),
      ...(sandboxOtpCode ? { sandbox_otp_code: sandboxOtpCode } : {}),
    }),
  );
  setOtpChallenge(response, { mobile, expiresAt });
  return response;
}

export async function GET(request: NextRequest) {
  const challenge = challengeOf(request);
  if (!challenge)
    return NextResponse.json(envelope("failed", null, null), { status: 404 });
  return NextResponse.json(
    envelope("successful", null, {
      masked_mobile: maskMobile(challenge.mobile),
      expires_at: new Date(challenge.expiresAt).toISOString(),
    }),
  );
}

export async function DELETE(request: NextRequest) {
  if (!isSameOriginRequest(request)) return forbidden();
  const response = NextResponse.json(envelope("successful", null, null));
  clearOtpChallenge(response);
  return response;
}
