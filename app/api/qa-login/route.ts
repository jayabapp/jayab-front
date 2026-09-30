import { NextRequest, NextResponse } from "next/server";
import {
  computeQaGateSessionToken,
  isGateConfigured,
  isLoginRateLimited,
  recordFailedLoginAttempt,
  setQaGateSessionCookie,
  timingSafeStringEqual,
} from "@/helpers/basicAuthGate";

export async function POST(request: NextRequest) {
  if (!isGateConfigured())
    return NextResponse.json({ ok: false, message: "GATE_NOT_CONFIGURED" }, { status: 503 });

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isLoginRateLimited(clientIp))
    return NextResponse.json({ ok: false, message: "RATE_LIMITED" }, { status: 429 });

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "INVALID_BODY" }, { status: 400 });
  }

  const userMatches = timingSafeStringEqual(body.username || "", process.env.BASIC_AUTH_USER || "");
  const passwordMatches = timingSafeStringEqual(
    body.password || "",
    process.env.BASIC_AUTH_PASSWORD || "",
  );

  if (!userMatches || !passwordMatches) {
    recordFailedLoginAttempt(clientIp);
    console.warn(`[qa-login] rejected ip=${clientIp}`);
    return NextResponse.json({ ok: false, message: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const token = await computeQaGateSessionToken(process.env.BASIC_AUTH_PASSWORD || "");
  const response = NextResponse.json({ ok: true });
  setQaGateSessionCookie(response, token);
  return response;
}
