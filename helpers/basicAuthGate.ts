import { NextRequest, NextResponse } from "next/server";
import { getRequestHostname } from "./indexingPolicy";

// Originally HTTP Basic Auth (a native browser credential prompt, no page).
// Replaced with a real login page + session cookie per product decision —
// same env vars (BASIC_AUTH_HOSTS/USER/PASSWORD), same rollback story
// (clear either credential var, restart, no rebuild), different mechanism:
// an unauthenticated request is redirected to /qa-login instead of
// challenged with a 401. Filename kept to avoid re-touching every doc that
// references it.
const DEFAULT_GATE_HOSTS = ["jayab.org", "www.jayab.org"];

// Bypassed so the load balancer / uptime monitor never sees this deployment
// as unhealthy just because it also requires credentials. Reveals nothing
// beyond process liveness.
export const BASIC_AUTH_HEALTHCHECK_PATH = "/api/healthz";

export const QA_LOGIN_PATH = "/qa-login";
export const QA_LOGIN_API_PATH = "/api/qa-login";
export const QA_GATE_COOKIE = "qa_gate_session";
const QA_GATE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

// Framework/static assets carry no page content and must always be
// reachable — redirecting them to /qa-login (as this gate does for pages)
// serves the login page's HTML in place of a JS/CSS file, which breaks
// parsing on the client ("Unexpected token '<'") and leaves the login page
// itself unstyled and unhydrated, unable to log in.
const GATE_EXEMPT_PATH = /^\/(_next\/static|_next\/image|static|assets\/|favicon|manifest\.json|sw\.js|workbox)/;

const normalizeHostname = (hostname: string) => hostname.trim().toLowerCase();

const gateHosts = new Set(
  (process.env.BASIC_AUTH_HOSTS?.split(",") || DEFAULT_GATE_HOSTS)
    .map(normalizeHostname)
    .filter(Boolean),
);

export const isGateHost = (hostname: string) => gateHosts.has(normalizeHostname(hostname));

// Both must be set. Clearing either one is the rollback switch: they are
// server-only env vars (never NEXT_PUBLIC_*), read per-request, so turning
// the gate off only needs a restart, not a rebuild of Front.
export const isGateConfigured = () =>
  Boolean(process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASSWORD);

// A plain `===` short-circuits on the first differing character, which leaks
// how many leading characters of a guess were correct through response
// timing. XOR-accumulate over the full length instead of returning early.
export function timingSafeStringEqual(a: string, b: string) {
  const length = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

// The session cookie is a deterministic digest of the current gate password
// (Web Crypto, so this also runs on the Edge runtime — no Node `crypto`).
// It needs no server-side session store: verifying it just means
// recomputing the same digest from today's env var and comparing. A bonus
// of that: rotating BASIC_AUTH_PASSWORD instantly invalidates every
// previously issued cookie, with no separate revocation step.
export async function computeQaGateSessionToken(password: string) {
  const data = new TextEncoder().encode(`qa-gate-session:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

async function hasValidSessionCookie(request: NextRequest) {
  const cookieValue = request.cookies.get(QA_GATE_COOKIE)?.value;
  if (!cookieValue) return false;
  const expected = await computeQaGateSessionToken(process.env.BASIC_AUTH_PASSWORD || "");
  return timingSafeStringEqual(cookieValue, expected);
}

export function setQaGateSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(QA_GATE_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: QA_GATE_COOKIE_MAX_AGE,
  });
}

function redirectToLogin(request: NextRequest) {
  const target = new URL(QA_LOGIN_PATH, request.url);
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (next && next !== QA_LOGIN_PATH) target.searchParams.set("next", next);
  const response = NextResponse.redirect(target, 307);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

// Best-effort, single-instance guard against casual credential guessing. It
// resets on restart and is not shared across instances or regions, so it is
// not a substitute for a real limiter at the CDN/ingress layer if this
// deployment is ever scaled beyond one instance — it just slows down naive
// scripted attempts against a single process.
const FAILED_ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const FAILED_ATTEMPT_LIMIT = 20;
const failedAttemptsByIp = new Map<string, number[]>();

export function isLoginRateLimited(key: string) {
  const now = Date.now();
  const recent = (failedAttemptsByIp.get(key) || []).filter(
    (timestamp) => now - timestamp < FAILED_ATTEMPT_WINDOW_MS,
  );
  failedAttemptsByIp.set(key, recent);
  return recent.length >= FAILED_ATTEMPT_LIMIT;
}

export function recordFailedLoginAttempt(key: string) {
  const recent = failedAttemptsByIp.get(key) || [];
  recent.push(Date.now());
  failedAttemptsByIp.set(key, recent);
}

/**
 * Returns a redirect to the login page when the request must be blocked, or
 * `null` when it should proceed. Never logs the password, only the client
 * IP, host and path of a rejected attempt.
 */
export async function enforceBasicAuthGate(request: NextRequest): Promise<NextResponse | null> {
  const hostname = getRequestHostname(request);
  if (!isGateHost(hostname) || !isGateConfigured()) return null;

  const { pathname } = request.nextUrl;
  if (
    pathname === BASIC_AUTH_HEALTHCHECK_PATH ||
    pathname === QA_LOGIN_PATH ||
    pathname === QA_LOGIN_API_PATH ||
    GATE_EXEMPT_PATH.test(pathname)
  )
    return null;

  if (await hasValidSessionCookie(request)) return null;

  return redirectToLogin(request);
}
