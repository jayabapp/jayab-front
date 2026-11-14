import { backendCategory, createBackendRequest } from "@/utils/backendRequest";
import { captureToken, setSocketTokenCookie } from "@/utils/sessionCookie";
import { readBackendText, isJsonContentType } from "@/utils/backendResponse";
import { safeErrorBody, upstreamHeaders } from "@/utils/backendResponse";
import { NextRequest, NextResponse } from "next/server";
import { setAccessTokenCookie } from "@/utils/sessionCookie";
import { ACCESS_TOKEN_COOKIE } from "@/utils/sessionCookie";
import { isProxyablePath } from "@/utils/proxyAllowlist";
import {
  constructStreamResponse,
  canStreamPublicJson,
  BackendResponseError,
  requiresMintedToken,
} from "@/utils/backendResponse";

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
  const scope = createBackendRequest(
    backendCategory(request.method, path, contentType),
    request.method,
    request.signal,
  );
  let status: number | undefined;
  let streaming = false;
  let responseHeaders = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
  });
  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      ...(hasBody && request.body ? { duplex: "half" as const } : {}),
      cache: "no-store",
      signal: scope.signal,
    });
    status = upstream.status;
    scope.headersReceived();

    const responseContentType = upstream.headers.get("content-type");

    responseHeaders = upstreamHeaders(upstream);
    responseHeaders.set(
      "Content-Type",
      isJsonContentType(responseContentType)
        ? responseContentType!
        : "application/json",
    );
    if ([204, 205, 304].includes(status)) {
      await upstream.body?.cancel();
      if (upstream.ok && requiresMintedToken(path))
        throw new BackendResponseError("Authentication token missing");
      return new NextResponse(null, { status, headers: responseHeaders });
    }
    if (
      upstream.body &&
      isJsonContentType(responseContentType) &&
      canStreamPublicJson(request.method, path, Boolean(token), status)
    ) {
      const response = await constructStreamResponse(
        upstream,
        scope,
        (body) => new NextResponse(body, { status, headers: responseHeaders }),
      );
      streaming = true;
      return response;
    }
    if (!isJsonContentType(responseContentType)) {
      await upstream.body?.cancel();
      throw new BackendResponseError("Unexpected upstream media type");
    }
    const {
      body,
      socketToken,
      token: mintedToken,
    } = captureToken(await readBackendText(upstream, scope), true);
    if (upstream.ok && requiresMintedToken(path) && !mintedToken)
      throw new BackendResponseError("Authentication token missing");
    const response = new NextResponse(body, {
      status,
      headers: responseHeaders,
    });
    if (!upstream.ok) {
      scope.log(status);
      return response;
    }
    if (mintedToken) setAccessTokenCookie(response, mintedToken);
    if (socketToken) setSocketTokenCookie(response, socketToken);
    return response;
  } catch (error) {
    scope.log(
      status,
      error instanceof SyntaxError || error instanceof BackendResponseError
        ? "malformed"
        : "network",
    );
    responseHeaders.set("Content-Type", "application/json");
    return new NextResponse(safeErrorBody(), {
      status:
        status && status >= 400 && !scope.signal.aborted
          ? status
          : scope.status(),
      headers: responseHeaders,
    });
  } finally {
    if (!streaming) scope.close();
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
