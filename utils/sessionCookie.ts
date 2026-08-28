import type { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const SOCKET_TOKEN_COOKIE = "socket_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

const MAX_AGE = 60 * 24 * 60 * 60;

export const setAccessTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE, token, {
    ...cookieOptions,
    maxAge: MAX_AGE,
  });
};

export const clearAccessTokenCookie = (response: NextResponse) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
};

export const setSocketTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set(SOCKET_TOKEN_COOKIE, token, {
    ...cookieOptions,
    maxAge: MAX_AGE,
  });
};

export const clearSocketTokenCookie = (response: NextResponse) => {
  response.cookies.set(SOCKET_TOKEN_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
};

const TOKEN_KEYS = ["access_token", "auth_token"] as const;

export const captureToken = (raw: string) => {
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      body: raw,
      token: undefined as string | undefined,
      socketToken: undefined as string | undefined,
    };
  }

  const payload =
    parsed?.data && typeof parsed.data === "object" ? parsed.data : parsed;
  if (!payload || typeof payload !== "object")
    return {
      body: raw,
      token: undefined as string | undefined,
      socketToken: undefined as string | undefined,
    };
  const key = TOKEN_KEYS.find(
    (name) => typeof payload[name] === "string" && !!payload[name],
  );
  const socketToken =
    typeof payload.socket_token === "string" ? payload.socket_token : undefined;
  delete payload.socket_token;
  if (!key)
    return {
      body: JSON.stringify(parsed),
      token: undefined as string | undefined,
      socketToken,
    };
  const token: string = payload[key];
  delete payload.access_token;
  delete payload.auth_token;
  payload.needs_registration = key === "auth_token";
  return {
    body: JSON.stringify(parsed),
    token: token as string | undefined,
    socketToken,
  };
};

export const isSameOriginRequest = (request: Request) => {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin" || fetchSite === "none";
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return (
    origin === process.env.NEXT_PUBLIC_WEB_SITE ||
    origin === new URL(request.url).origin
  );
};
