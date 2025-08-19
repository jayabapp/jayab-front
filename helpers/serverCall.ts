import { notFound } from "next/navigation";
import MinMaxRandom from "./MinMaxRandom";
import queryBuilder from "./queryBuilder";

async function serverCall(
  url: string,
  params?: any,
  options?: {
    redirect404?: boolean;
  }
) {
  try {
    let headers: {
      Accept: string;
      "Content-Type": string;
    } = {
      Accept: `application/json`,

      "Content-Type": `application/json`,
    };

    let config1 = {
      method: "GET",

      headers: headers,
    };
    const response = await fetch(`${url}${!!params ? `?${queryBuilder(params)}` : ""}`, {
      // next: { revalidate: revalidate ? revalidate : 300 },
      next: { revalidate: MinMaxRandom(), tags: [url] },
      ...config1,
    });

    if (!response?.ok) {
      // This will activate the closest `error.js` Error Boundary
      if (!!options?.redirect404 && (response?.status == 404 || response?.status == 500)) {
        notFound();
      } else {
        throw new Error("Failed to fetch server data");
      }
    }

    const data = await response?.json();
    return data || null;
  } catch (error: any) {
    if (error?.digest == "NEXT_HTTP_ERROR_FALLBACK;404") {
      throw error;
    }
    console.log("----------------------------------");
    console.log(error);
    return { data: null };
  }
}

export default serverCall;
