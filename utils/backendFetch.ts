export const callBackend = async (
  path: string,
  init: { method: string; body?: unknown },
) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const websiteOrigin = process.env.NEXT_PUBLIC_WEB_SITE;
  if (!apiBaseUrl || !websiteOrigin)
    throw new Error("API environment variables are not configured");
  const response = await fetch(new URL(`/api/v1${path}`, apiBaseUrl), {
    method: init.method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: websiteOrigin,
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  return { status: response.status, raw: await response.text() };
};

export const envelope = (
  status: "successful" | "failed",
  messageFa: string | null,
  data: unknown,
) => ({ status, messages: { fa: messageFa }, data });
