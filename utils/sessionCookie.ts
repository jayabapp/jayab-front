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
const RESERVED_TOKEN_KEYS = [...TOKEN_KEYS, "socket_token"];

export const captureToken = (raw: string, strict = false) => {
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    if (strict) throw new SyntaxError("Malformed upstream JSON");
    return {
      body: raw,
      token: undefined as string | undefined,
      socketToken: undefined as string | undefined,
    };
  }

  if (
    strict &&
    (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
  )
    throw new SyntaxError("Unsupported authentication envelope");
  const payload =
    parsed?.data && typeof parsed.data === "object" ? parsed.data : parsed;
  if (!payload || typeof payload !== "object")
    return {
      body: raw,
      token: undefined as string | undefined,
      socketToken: undefined as string | undefined,
    };
  if (strict) {
    if (
      Array.isArray(payload) &&
      RESERVED_TOKEN_KEYS.some((name) => parsed[name] !== undefined)
    )
      throw new SyntaxError("Unsupported authentication envelope");
    const pending = [parsed];
    while (pending.length) {
      const current = pending.pop();
      if (!current || typeof current !== "object") continue;
      for (const [name, value] of Object.entries(current)) {
        if (RESERVED_TOKEN_KEYS.includes(name)) {
          if (
            (current !== parsed && current !== payload) ||
            typeof value !== "string" ||
            !value
          )
            throw new SyntaxError("Unsupported authentication envelope");
        } else if (value && typeof value === "object") pending.push(value);
      }
    }
    for (const name of RESERVED_TOKEN_KEYS) {
      if (parsed !== payload && parsed[name] !== undefined) {
        if (payload[name] !== undefined && payload[name] !== parsed[name])
          throw new SyntaxError("Conflicting authentication envelope");
        payload[name] = parsed[name];
        delete parsed[name];
      }
    }
    if (
      payload.access_token &&
      payload.auth_token &&
      payload.access_token !== payload.auth_token
    )
      throw new SyntaxError("Conflicting authentication envelope");
  }
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
