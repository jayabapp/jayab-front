import { NextRequest, NextResponse } from "next/server";
import { clearAccessTokenCookie } from "@/utils/sessionCookie";
import { isSameOriginRequest } from "@/utils/sessionCookie";

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return NextResponse.json({ status: "failed" }, { status: 403 });
  const response = NextResponse.json({ status: "successful" });
  clearAccessTokenCookie(response);
  return response;
}
