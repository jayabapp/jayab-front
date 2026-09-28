import { NextRequest, NextResponse } from "next/server";
import { getRequestHostname } from "./indexingPolicy";

const DEFAULT_GATE_HOSTS = ["jayab.org", "www.jayab.org"];
const REALM = "Jayab QA";

// Bypassed unauthenticated so the load balancer / uptime monitor never sees
// this deployment as unhealthy just because it also requires credentials.
// Reveals nothing beyond process liveness.
export const BASIC_AUTH_HEALTHCHECK_PATH = "/api/healthz";

const normalizeHostname = (hostname: string) => hostname.trim().toLowerCase();

const gateHosts = new Set(
  (process.env.BASIC_AUTH_HOSTS?.split(",") || DEFAULT_GATE_HOSTS)
    .map(normalizeHostname)
    .filter(Boolean),
);

const isGateHost = (hostname: string) => gateHosts.has(normalizeHostname(hostname));

// Both must be set. Clearing either one is the rollback switch: they are
// server-only env vars (never NEXT_PUBLIC_*), read per-request, so turning
// the gate off only needs a restart, not a rebuild of Front.
const isGateConfigured = () =>
  Boolean(process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASSWORD);

// A plain `===` short-circuits on the first differing character, which leaks
// how many leading characters of a guess were correct through response
// timing. XOR-accumulate over the full length instead of returning early.
function timingSafeStringEqual(a: string, b: string) {
  const length = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function decodeBasicAuthHeader(header: string | null) {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return null;
    return {
      user: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

function unauthorizedResponse() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

// Best-effort, single-instance guard against casual credential guessing. It
// resets on restart and is not shared across instances or regions, so it is
// not a substitute for a real limiter at the CDN/ingress layer if this
// deployment is ever scaled beyond one instance — it just slows down naive
// scripted attempts against a single process.
const FAILED_ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const FAILED_ATTEMPT_LIMIT = 20;
const failedAttemptsByIp = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (failedAttemptsByIp.get(key) || []).filter(
    (timestamp) => now - timestamp < FAILED_ATTEMPT_WINDOW_MS,
  );
  failedAttemptsByIp.set(key, recent);
  return recent.length >= FAILED_ATTEMPT_LIMIT;
}

function recordFailedAttempt(key: string) {
  const recent = failedAttemptsByIp.get(key) || [];
  recent.push(Date.now());
  failedAttemptsByIp.set(key, recent);
}

/**
 * Returns a 401 challenge when the request must be blocked, or `null` when
 * it should proceed. Never logs the password, only the client IP, host and
 * path of a rejected attempt.
 */
export function enforceBasicAuthGate(request: NextRequest): NextResponse | null {
  const hostname = getRequestHostname(request);
  if (!isGateHost(hostname) || !isGateConfigured()) return null;
  if (request.nextUrl.pathname === BASIC_AUTH_HEALTHCHECK_PATH) return null;

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(clientIp)) {
    console.warn(`[basic-auth-gate] rate limited ip=${clientIp} host=${hostname}`);
    return unauthorizedResponse();
  }

  const credentials = decodeBasicAuthHeader(request.headers.get("authorization"));
  const userMatches = timingSafeStringEqual(credentials?.user || "", process.env.BASIC_AUTH_USER || "");
  const passwordMatches = timingSafeStringEqual(
    credentials?.password || "",
    process.env.BASIC_AUTH_PASSWORD || "",
  );

  if (!credentials || !userMatches || !passwordMatches) {
    recordFailedAttempt(clientIp);
    console.warn(
      `[basic-auth-gate] rejected ip=${clientIp} host=${hostname} path=${request.nextUrl.pathname}`,
    );
    return unauthorizedResponse();
  }

  return null;
}
