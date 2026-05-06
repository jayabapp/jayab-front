import { isRedirectError } from "next/dist/client/components/redirect-error";
import { notFound, redirect } from "next/navigation";
import MinMaxRandom from "./MinMaxRandom";
import queryBuilder from "./queryBuilder";

async function serverCall(
  url: string,
  params?: any,
  options?: {
    redirect404?: boolean;
    redirect410?: boolean;
  },
) {
  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(`${url}${params ? `?${queryBuilder(params)}` : ""}`, {
      method: "GET",
      headers,
      next: { revalidate: MinMaxRandom(), tags: [url] },
    });

    if (!response.ok) {
      if (options?.redirect404 && (response.status === 404 || response.status === 500)) {
        notFound();
      }

      if (options?.redirect410 && response.status === 410) {
        redirect("/");
      }

      throw new Error("Failed to fetch server data");
    }

    const data = await response.json();
    return data || null;
  } catch (error: any) {
    if (error?.digest === "NEXT_HTTP_ERROR_FALLBACK;404" || isRedirectError(error)) {
      throw error;
    }

    console.log(error);
    return { data: null };
  }
}

export default serverCall;
