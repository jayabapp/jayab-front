import { NextRequest, NextResponse } from "next/server";
import { clearAccessTokenCookie } from "@/utils/sessionCookie";
import { clearSocketTokenCookie } from "@/utils/sessionCookie";
import { isSameOriginRequest } from "@/utils/sessionCookie";
import { clearOtpChallenge } from "@/utils/otpChallenge";

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return NextResponse.json({ status: "failed" }, { status: 403 });
  const response = NextResponse.json({ status: "successful" });
  clearAccessTokenCookie(response);
  clearSocketTokenCookie(response);
  clearOtpChallenge(response);
  response.cookies.set("isLogin", "", { path: "/", maxAge: 0 });
  response.cookies.set("is_admin_sso", "", { path: "/", maxAge: 0 });
  return response;
}
