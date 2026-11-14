import { IMAGE_UPLOAD_TIMEOUT_MS } from "@features/upload/lib/image-upload";

export type RequestCategory =
  | "proxy"
  | "auth"
  | "upload"
  | "server"
  | "lookup"
  | "validation"
  | "registration";

const TRANSPORT_MARGIN_MS = 15_000;

const configured = (name: string, fallback: number, minimum = 1) => {
  const value = Number(process.env[name]);
  return Number.isSafeInteger(value) && value >= minimum && value <= 1_800_000
    ? value
    : fallback;
};

export const backendTimeout = (category: RequestCategory) =>
  category === "upload"
    ? configured(
        "BACKEND_UPLOAD_TIMEOUT_MS",
        IMAGE_UPLOAD_TIMEOUT_MS + TRANSPORT_MARGIN_MS,
        IMAGE_UPLOAD_TIMEOUT_MS + TRANSPORT_MARGIN_MS,
      )
    : category === "registration"
      ? configured("BACKEND_REGISTRATION_TIMEOUT_MS", 75_000, 75_000)
      : category === "lookup"
        ? configured("BACKEND_LOOKUP_TIMEOUT_MS", 5_000)
        : configured("BACKEND_REQUEST_TIMEOUT_MS", 25_000);

export const backendCategory = (
  method: string,
  path: string[],
  contentType: string | null,
): RequestCategory => {
  const route = path.slice(1).join("/");
  if (method === "PUT" && route === "profile/register/owner")
    return "registration";
  if (
    method === "POST" &&
    ["attachments", "user/national-card/upload"].includes(route)
  )
    return "upload";
  if (/^multipart\/form-data(?:\s*;|$)/i.test(contentType || ""))
    return "upload";
  return "proxy";
};

export const createBackendRequest = (
  method: string,
  category: RequestCategory,
  caller?: AbortSignal | null,
  timeoutMs = backendTimeout(category),
) => {
  const controller = new AbortController();
  const started = performance.now();
  let timedOut = false;
  let logged = false;
  let closed = false;
  let phase = "headers";
  let timeoutPhase = "headers";
  let idle: ReturnType<typeof setTimeout> | undefined;
  const abort = () => controller.abort();
  const expire = () => {
    timeoutPhase = phase;
    timedOut = true;
    controller.abort();
  };
  let timer = setTimeout(expire, timeoutMs);
  if (caller?.aborted) abort();
  else caller?.addEventListener("abort", abort, { once: true });
  return {
    signal: controller.signal,
    status: () => (timedOut ? 504 : caller?.aborted ? 499 : 502),
    abort,
    close: () => {
      closed = true;
      clearTimeout(timer);
      clearTimeout(idle);
      caller?.removeEventListener("abort", abort);
    },
    headersReceived: () => {
      clearTimeout(timer);
      phase = "transfer";
      timer = setTimeout(
        expire,
        configured("BACKEND_TRANSFER_TIMEOUT_MS", 900_000, 195_000),
      );
    },
    read: async <T>(operation: () => Promise<T>): Promise<T> => {
      if (closed || controller.signal.aborted)
        throw new Error("Backend request aborted");
      phase = "body";
      idle = setTimeout(
        expire,
        configured("BACKEND_BODY_IDLE_TIMEOUT_MS", 30_000),
      );
      try {
        return await operation();
      } finally {
        clearTimeout(idle);
        idle = undefined;
        phase = "transfer";
      }
    },
    log: (status?: number, failure?: "network" | "response" | "malformed") => {
      if (logged) return;
      logged = true;
      const kind = timedOut
        ? "timeout"
        : caller?.aborted
          ? "cancelled"
          : failure || "response";
      if (kind === "cancelled") return;
      console.warn("[backend-request]", {
        category,
        method,
        status,
        kind,
        phase: timedOut ? timeoutPhase : phase,
        durationMs: Math.round(performance.now() - started),
      });
    },
  };
};
