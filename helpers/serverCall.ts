import { createBackendRequest } from "@/utils/backendRequest";
import { notFound, redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { readBackendText } from "@/utils/backendResponse";
import { REVALIDATE } from "./revalidate";

import queryBuilder from "./queryBuilder";

async function serverCall(
  url: string,
  params?: any,
  options?: {
    revalidate?: number;
    redirect404?: boolean;
    redirect410?: boolean;
    cache?: "no-store";
    signal?: AbortSignal;
    category?: "server" | "lookup";
  },
) {
  const scope = createBackendRequest(
    options?.category || "server",
    "GET",
    options?.signal,
  );
  let status: number | undefined;
  try {
    const origin = process.env.NEXT_PUBLIC_WEB_SITE;
    if (!origin) throw new Error("NEXT_PUBLIC_WEB_SITE is not configured");

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: origin,
    };

    const response = await fetch(
      `${url}${params ? `?${queryBuilder(params)}` : ""}`,
      {
        method: "GET",
        headers,
        signal: scope.signal,
        ...(options?.cache === "no-store"
          ? { cache: "no-store" as const }
          : {
              next: {
                revalidate: options?.revalidate ?? REVALIDATE.DEFAULT,
              },
            }),
      },
    );

    status = response.status;
    scope.headersReceived();
    if (!response.ok) {
      scope.log(status);
      await response.body?.cancel();
      if (options?.redirect404 && response.status === 404) notFound();
      if (options?.redirect410 && response.status === 410) redirect("/");
      throw new Error("Failed to fetch server data");
    }

    const data = JSON.parse(await readBackendText(response, scope));
    return data || null;
  } catch (error: any) {
    if (
      error?.digest === "NEXT_HTTP_ERROR_FALLBACK;404" ||
      isRedirectError(error)
    )
      throw error;
    scope.log(status, error instanceof SyntaxError ? "malformed" : "network");
    return { data: null };
  } finally {
    scope.close();
  }
}

export default serverCall;
