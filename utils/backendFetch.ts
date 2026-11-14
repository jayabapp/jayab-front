import { BackendResponseError, isJsonContentType } from "./backendResponse";
import { readBackendText, safeErrorBody } from "./backendResponse";
import { createBackendRequest } from "./backendRequest";
import { requiresMintedToken } from "./backendResponse";
import { captureToken } from "./sessionCookie";

export const callBackend = async (
  path: string,
  init: { method: string; body?: unknown; signal?: AbortSignal },
) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const websiteOrigin = process.env.NEXT_PUBLIC_WEB_SITE;
  if (!apiBaseUrl || !websiteOrigin)
    throw new Error("API environment variables are not configured");
  const scope = createBackendRequest("auth", init.method, init.signal);
  let status: number | undefined;
  try {
    const response = await fetch(new URL(`/api/v1${path}`, apiBaseUrl), {
      method: init.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: websiteOrigin,
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: scope.signal,
    });
    status = response.status;
    scope.headersReceived();
    if (!isJsonContentType(response.headers.get("content-type"))) {
      await response.body?.cancel();
      throw new BackendResponseError("Unexpected upstream media type");
    }
    const raw = await readBackendText(response, scope);
    const safe = captureToken(raw, true);
    if (!response.ok) {
      scope.log(status);
      return { status, raw: safe.body };
    }
    if (
      requiresMintedToken(["v1", ...path.split("/").filter(Boolean)]) &&
      !safe.token
    )
      throw new BackendResponseError("Authentication token missing");
    return { status, raw };
  } catch (error) {
    scope.log(
      status,
      error instanceof SyntaxError || error instanceof BackendResponseError
        ? "malformed"
        : "network",
    );
    return {
      status:
        status && status >= 400 && !scope.signal.aborted
          ? status
          : scope.status(),
      raw: safeErrorBody(),
    };
  } finally {
    scope.close();
  }
};

export const envelope = (
  status: "successful" | "failed",
  messageFa: string | null,
  data: unknown,
) => ({ status, messages: { fa: messageFa }, data });
