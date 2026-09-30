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
//
// Listed as exact paths / directory prefixes rather than a loose regex
// prefix match (e.g. a bare `favicon` or `static` prefix) on purpose: an
// unanchored prefix would also exempt any future page route that happens to
// start with the same characters (`/favicon-leak`, `/static-report`, ...),
// silently bypassing the gate for it.
const GATE_EXEMPT_DIR_PREFIXES = ["/_next/static/", "/_next/image", "/static/", "/assets/"];
const GATE_EXEMPT_EXACT_PATHS = new Set([
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/manifest.json",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/firebase-messaging-sw.js",
  "/next.svg",
  "/vercel.svg",
]);

const isGateExemptPath = (pathname: string) =>
  GATE_EXEMPT_EXACT_PATHS.has(pathname) ||
  GATE_EXEMPT_DIR_PREFIXES.some((prefix) => pathname.startsWith(prefix));

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

// `X-Forwarded-For` is attacker-controlled input: a client can send any
// value it wants, and if the FIRST entry is trusted naively, an attacker
// defeats the rate limiter below by sending a fresh fake leading IP on every
// request. A reverse proxy that appends the real client IP (the common
// nginx `proxy_add_x_forwarded_for` behaviour) puts the trustworthy value
// LAST, not first. `X-Real-IP` is normally set by the proxy itself via
// `proxy_set_header`, which overwrites rather than appends, so a
// client-supplied copy of that header is discarded before it reaches this
// process; Cloudflare's `CF-Connecting-IP` is rewritten at the edge the same
// way. Prefer both over `X-Forwarded-For` when present.
export function getTrustedClientIp(request: NextRequest) {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor.split(",").map((hop) => hop.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return "unknown";
}

// Best-effort, single-instance guard against casual credential guessing. It
// resets on restart and is not shared across instances or regions, so it is
// not a substitute for a real limiter at the CDN/ingress layer if this
// deployment is ever scaled beyond one instance — it just slows down naive
// scripted attempts against a single process.
const FAILED_ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const FAILED_ATTEMPT_LIMIT = 20;
// Caps memory use if an attacker floods distinct (real or spoofed) IPs
// instead of retrying the same one — the limiter is best-effort, so simply
// dropping all tracked history when this fills is an acceptable reset.
const MAX_TRACKED_IPS = 5000;
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
  if (failedAttemptsByIp.size >= MAX_TRACKED_IPS) failedAttemptsByIp.clear();
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
    isGateExemptPath(pathname)
  )
    return null;

  if (await hasValidSessionCookie(request)) return null;

  return redirectToLogin(request);
}
