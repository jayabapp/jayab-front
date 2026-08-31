import { readServerAccessToken } from "@/api_services/common/server-token";
import { AuthService } from "@/api_services/auth/auth.service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const ServerFetchCheck = async () => {
  if (process.env.NODE_ENV === "production") notFound();
  const token = await readServerAccessToken();
  let result: unknown;
  let error: string | null = null;
  try {
    result = await AuthService.getProfile();
  } catch (e: any) {
    error = typeof e === "string" ? e : JSON.stringify(e);
  }
  return (
    <pre style={{ padding: 16, direction: "ltr", whiteSpace: "pre-wrap" }}>
      {JSON.stringify(
        { cookiePresent: !!token, error, result: result ?? null },
        null,
        2,
      )}
    </pre>
  );
};

export default ServerFetchCheck;
