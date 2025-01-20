import MinMaxRandom from "./MinMaxRandom";
import queryBuilder from "./queryBuilder";

async function serverCall(url: string, params?: any) {
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
      next: { revalidate: MinMaxRandom() },
      ...config1,
    });

    if (!response?.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch server data");
    }

    const data = await response?.json();
    return data || null;
  } catch (error) {
    console.log("----------------------------------");
    console.log(error);
    return { data: null };
  }
}

export default serverCall;
