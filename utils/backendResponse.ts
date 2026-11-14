import type { createBackendRequest } from "./backendRequest";

export class BackendResponseError extends Error {}

export const isJsonContentType = (value: string | null) =>
  /^application\/(?:json|[a-z0-9!#$&^_.+-]+\+json)(?:\s*;|$)/i.test(
    (value || "").trim(),
  );

export const safeErrorBody = () =>
  JSON.stringify({
    status: "failed",
    messages: { fa: "Backend request failed" },
    data: null,
  });

export const requiresMintedToken = (path: string[]) =>
  /^(?:auth\/otp\/verify|user\/auth\/(?:login|register)|business\/login)$/.test(
    path.slice(1).join("/"),
  );

export const canStreamPublicJson = (
  method: string,
  path: string[],
  authenticated: boolean,
  status: number,
) =>
  method === "GET" &&
  !authenticated &&
  status === 200 &&
  /^v1\/user\/properties(?:\/map|\/price-histogram)?$/.test(path.join("/"));

export const upstreamHeaders = (upstream: Response) => {
  const headers = new Headers({ "Cache-Control": "no-store" });
  for (const name of ["content-type", "retry-after", "content-language"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return headers;
};

export const streamBackendBody = (
  body: ReadableStream<Uint8Array>,
  scope: ReturnType<typeof createBackendRequest>,
  status?: number,
  reportHttpError = true,
) => {
  const reader = body.getReader();
  let finished = false;
  let abort: () => void;
  const close = () => {
    finished = true;
    scope.signal.removeEventListener("abort", abort);
    scope.close();
  };
  let cancellation: Promise<void> | undefined;
  const cancelReader = () =>
    (cancellation ||= (async () => {
      try {
        await reader.cancel();
      } catch {
        /* Already failed/aborted. */
      } finally {
        try {
          reader.releaseLock();
        } catch {
          /* Outstanding read is terminating. */
        }
      }
    })());
  return new ReadableStream<Uint8Array>({
    start(controller) {
      abort = () => {
        if (finished) return;
        scope.log(status, "network");
        close();
        void cancelReader();
        controller.error(new Error("Upstream response aborted"));
      };
      scope.signal.addEventListener("abort", abort, { once: true });
      if (scope.signal.aborted) abort();
    },
    async pull(controller) {
      try {
        const chunk = await scope.read(() => reader.read());
        if (finished) return;
        if (chunk.done) {
          if (reportHttpError && status && status >= 400) scope.log(status);
          close();
          reader.releaseLock();
          controller.close();
        } else controller.enqueue(chunk.value);
      } catch {
        if (finished) return;
        scope.log(status, "network");
        close();
        void cancelReader();
        controller.error(new Error("Upstream response failed"));
      }
    },
    async cancel() {
      close();
      scope.abort();
      await cancelReader();
    },
  });
};

export const readBackendText = (
  upstream: Response,
  scope: ReturnType<typeof createBackendRequest>,
) =>
  upstream.body
    ? new Response(
        streamBackendBody(upstream.body, scope, upstream.status, false),
      ).text()
    : Promise.resolve("");

export const constructStreamResponse = async <T>(
  upstream: Response,
  scope: ReturnType<typeof createBackendRequest>,
  construct: (body: ReadableStream<Uint8Array>) => T,
) => {
  let body: ReadableStream<Uint8Array> | undefined;
  try {
    body = streamBackendBody(upstream.body!, scope, upstream.status);
    return construct(body);
  } catch (error) {
    scope.abort();
    if (body) await body.cancel().catch(() => {});
    else await upstream.body?.cancel().catch(() => {});
    scope.close();
    throw error;
  }
};
