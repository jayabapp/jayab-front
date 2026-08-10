import { captureToken, setAccessTokenCookie } from "@/utils/sessionCookie";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/utils/sessionCookie";
import { isProxyablePath } from "@/utils/proxyAllowlist";

export const dynamic = "force-dynamic";

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const websiteOrigin = process.env.NEXT_PUBLIC_WEB_SITE;
  if (!apiBaseUrl || !websiteOrigin) {
    return NextResponse.json(
      {
        status: "failed",
        message: "API environment variables are not configured",
      },
      { status: 500 },
    );
  }
  const { path } = await params;
  if (!isProxyablePath(path)) {
    return NextResponse.json(
      { status: "failed", messages: { fa: "این مسیر در دسترس نیست." } },
      { status: 403 },
    );
  }
  const targetUrl = new URL(`/api/${path.join("/")}`, apiBaseUrl);
  targetUrl.search = request.nextUrl.search;
  const headers = new Headers({
    Accept: request.headers.get("accept") || "application/json",
    Origin: websiteOrigin,
  });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseContentType =
    upstream.headers.get("content-type") || "application/json";
  if (!hasBody || !responseContentType.includes("application/json")) {
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: { "Content-Type": responseContentType },
    });
  }

  const { body, token: mintedToken } = captureToken(await upstream.text());
  const response = new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": responseContentType },
  });
  if (mintedToken) setAccessTokenCookie(response, mintedToken);
  return response;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
