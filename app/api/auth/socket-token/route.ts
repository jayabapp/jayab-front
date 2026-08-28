import {
  isSameOriginRequest,
  SOCKET_TOKEN_COOKIE,
} from "@/utils/sessionCookie";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = (request: NextRequest) => {
  if (!isSameOriginRequest(request))
    return NextResponse.json({ status: "failed" }, { status: 403 });
  const token = request.cookies.get(SOCKET_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ status: "failed" }, { status: 401 });
  return NextResponse.json(
    { status: "successful", data: { token } },
    { headers: { "Cache-Control": "no-store" } },
  );
};
