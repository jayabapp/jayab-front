import { captureToken, setAccessTokenCookie } from "@/utils/sessionCookie";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/utils/sessionCookie";
import { isProxyablePath } from "@/utils/proxyAllowlist";
import { promisify } from "node:util";
import { gzip } from "node:zlib";

export const dynamic = "force-dynamic";

const gzipAsync = promisify(gzip);

const COMPRESSIBLE_TYPE = /^(?:text\/|application\/(?:json|xml|javascript))/i;

const MIN_COMPRESS_BYTES = 1024;

const toBody = (b: Buffer): ArrayBuffer =>
  b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;

const buildResponse = async (
  raw: Buffer,
  status: number,
  contentType: string,
  compress: boolean,
) => {
  const headers = new Headers({
    "Content-Type": contentType,
    Vary: "Accept-Encoding",
  });
  if (!compress || raw.byteLength < MIN_COMPRESS_BYTES)
    return new NextResponse(toBody(raw), { status, headers });
  const encoded = await gzipAsync(raw);
  headers.set("Content-Encoding", "gzip");
  headers.set("Content-Length", String(encoded.byteLength));
  return new NextResponse(toBody(encoded), { status, headers });
};

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

  const compressible =
    !upstream.headers.get("content-encoding") &&
    COMPRESSIBLE_TYPE.test(responseContentType) &&
    /\bgzip\b/i.test(request.headers.get("accept-encoding") || "");

  if (!hasBody || !responseContentType.includes("application/json")) {
    if (!compressible) {
      return new NextResponse(upstream.body, {
        status: upstream.status,
        headers: { "Content-Type": responseContentType },
      });
    }
    return buildResponse(
      Buffer.from(await upstream.arrayBuffer()),
      upstream.status,
      responseContentType,
      true,
    );
  }

  const { body, token: mintedToken } = captureToken(await upstream.text());
  const response = await buildResponse(
    Buffer.from(body, "utf8"),
    upstream.status,
    responseContentType,
    compressible,
  );
  if (mintedToken) setAccessTokenCookie(response, mintedToken);
  return response;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
