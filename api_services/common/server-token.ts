import { ACCESS_TOKEN_COOKIE } from "@/utils/sessionCookie";

const isFrameworkError = (error: any) =>
  typeof error?.digest === "string" &&
  (error.digest.startsWith("DYNAMIC_SERVER_USAGE") ||
    error.digest.startsWith("BAILOUT_TO_CLIENT_SIDE_RENDERING") ||
    error.digest.startsWith("NEXT_"));

export const readServerAccessToken = async (): Promise<string | undefined> => {
  if (typeof window !== "undefined") return undefined;
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return store.get(ACCESS_TOKEN_COOKIE)?.value || undefined;
  } catch (error) {
    if (isFrameworkError(error)) throw error;
    return undefined;
  }
};
