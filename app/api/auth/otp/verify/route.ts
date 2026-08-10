import { clearOtpChallenge, readOtpChallenge } from "@/utils/otpChallenge";
import { captureToken, isSameOriginRequest } from "@/utils/sessionCookie";
import { NextRequest, NextResponse } from "next/server";
import { callBackend, envelope } from "@/utils/backendFetch";
import { setAccessTokenCookie } from "@/utils/sessionCookie";
import { OTP_CHALLENGE_COOKIE } from "@/utils/otpChallenge";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return NextResponse.json(envelope("failed", null, null), { status: 403 });
  const challenge = readOtpChallenge(
    request.cookies.get(OTP_CHALLENGE_COOKIE)?.value,
  );
  if (!challenge) {
    return NextResponse.json(
      envelope(
        "failed",
        "درخواست ورود منقضی شده است. لطفا دوباره تلاش کنید.",
        null,
      ),
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const code =
    typeof body?.code === "string" || typeof body?.code === "number"
      ? String(body.code)
      : "";
  if (!code)
    return NextResponse.json(
      envelope("failed", "کد وارد شده صحیح نمی باشد.", null),
      { status: 400 },
    );
  const { status, raw } = await callBackend("/auth/otp/verify", {
    method: "POST",
    body: {
      mobile_number: challenge.mobile,
      code,
      query_params: body?.query_params,
    },
  });
  if (status >= 400)
    return new NextResponse(raw, {
      status,
      headers: { "Content-Type": "application/json" },
    });
  const { body: safeBody, token } = captureToken(raw);
  const response = new NextResponse(safeBody, {
    status,
    headers: { "Content-Type": "application/json" },
  });
  if (token) setAccessTokenCookie(response, token);
  clearOtpChallenge(response);
  return response;
}
