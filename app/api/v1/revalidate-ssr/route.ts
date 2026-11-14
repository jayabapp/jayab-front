import { NextRequest, NextResponse } from "next/server";
import { createBackendRequest } from "@/utils/backendRequest";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { readBackendText } from "@/utils/backendResponse";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

const hits = new Map<string, { count: number; resetAt: number }>();

const isRateLimited = (key: string) => {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (hits.size > 1000)
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
};

const readToken = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer "))
    return { token: authHeader.slice(7).trim(), viaQuery: false };
  if (request.method === "POST") {
    const body = await request.json().catch(() => null);
    if (typeof body?.token === "string" && body.token)
      return { token: body.token, viaQuery: false };
  }
  const queryToken = request.nextUrl.searchParams.get("token");
  if (queryToken) return { token: queryToken, viaQuery: true };
  return { token: "", viaQuery: false };
};

const harden = (response: NextResponse) => {
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
};

async function handler(request: NextRequest) {
  const clientKey =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(clientKey))
    return harden(
      NextResponse.json({ data: { revalidate: false } }, { status: 429 }),
    );
  const { token, viaQuery } = await readToken(request);
  if (!token)
    return harden(
      NextResponse.json({ data: { revalidate: false } }, { status: 401 }),
    );
  if (viaQuery) {
    console.warn(
      "[revalidate-ssr] token received via query string (deprecated) — migrate the caller to an Authorization header",
    );
  }

  const scope = createBackendRequest("validation", "GET", request.signal);
  let upstreamStatus: number | undefined;
  try {
    const response = await fetch(`${baseUrl}${apiRoutes.ADMIN_EDIT_VALIDATE}`, {
      method: "GET",
      headers: {
        Accept: `application/json`,
        "Content-Type": `application/json`,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: scope.signal,
    });
    upstreamStatus = response.status;
    scope.headersReceived();

    if (response.status == 401) {
      scope.log(upstreamStatus);
      await response.body?.cancel();
      return harden(
        NextResponse.json({ data: { revalidate: false } }, { status: 401 }),
      );
    }
    if (!response.ok) {
      scope.log(upstreamStatus);
      await response.body?.cancel();
      return harden(
        NextResponse.json(
          { data: { revalidate: false } },
          { status: response.status },
        ),
      );
    }
    const json = JSON.parse(await readBackendText(response, scope));
    const data = json.data;
    if (!!data?.can_edit) {
      revalidatePath("/", "layout");
      return harden(
        NextResponse.json({ data: { revalidated: true } }, { status: 200 }),
      );
    }
    return harden(
      NextResponse.json({ data: { revalidate: false } }, { status: 401 }),
    );
  } catch (error) {
    scope.log(
      upstreamStatus,
      error instanceof SyntaxError ? "malformed" : "network",
    );
    return harden(
      NextResponse.json(
        { error: "revalidation failed" },
        {
          status: scope.signal.aborted
            ? scope.status()
            : upstreamStatus
              ? 502
              : scope.status(),
        },
      ),
    );
  } finally {
    scope.close();
  }
}

export const GET = handler;
export const POST = handler;
