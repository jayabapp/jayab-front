import { notFound, redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { REVALIDATE } from "./revalidate";

import queryBuilder from "./queryBuilder";

const SERVER_REQUEST_TIMEOUT_MS = 15_000;

async function serverCall(
  url: string,
  params?: any,
  options?: {
    revalidate?: number;
    redirect404?: boolean;
    redirect410?: boolean;
  },
) {
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
        signal: AbortSignal.timeout(SERVER_REQUEST_TIMEOUT_MS),
        next: {
          revalidate: options?.revalidate ?? REVALIDATE.DEFAULT,
        },
      },
    );

    if (!response.ok) {
      if (
        options?.redirect404 &&
        (response.status === 404 || response.status === 500)
      )
        notFound();
      if (options?.redirect410 && response.status === 410) redirect("/");
      throw new Error("Failed to fetch server data");
    }

    const data = await response.json();
    return data || null;
  } catch (error: any) {
    if (
      error?.digest === "NEXT_HTTP_ERROR_FALLBACK;404" ||
      isRedirectError(error)
    )
      throw error;
    console.log(error);
    return { data: null };
  }
}

export default serverCall;
