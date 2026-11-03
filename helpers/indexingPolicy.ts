const DEFAULT_NOINDEX_HOSTS = ["jayab.org", "www.jayab.org"];

const normalizeHostname = (hostname?: string | null) =>
  hostname?.trim().toLowerCase().split(":")[0] || "";

const noIndexHosts = new Set(
  (process.env.NOINDEX_HOSTS?.split(",") || DEFAULT_NOINDEX_HOSTS)
    .map(normalizeHostname)
    .filter(Boolean),
);

export const isNoIndexHostname = (hostname?: string | null) =>
  noIndexHosts.has(normalizeHostname(hostname));

export const getRequestHostname = (request: Request) => {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0];
  return normalizeHostname(
    forwardedHost || request.headers.get("host") || new URL(request.url).hostname,
  );
};

export const isNoIndexRequest = (request: Request) =>
  process.env.SITE_NOINDEX === "true" ||
  isNoIndexHostname(getRequestHostname(request));

export const isNoIndexDeployment = () => {
  if (process.env.SITE_NOINDEX === "true") return true;

  return [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_WEB_SITE,
    process.env.NEXT_PUBLIC_WEBSITE_URL,
  ].some((configuredSiteUrl) => {
    if (!configuredSiteUrl) return false;

    try {
      return isNoIndexHostname(new URL(configuredSiteUrl).hostname);
    } catch {
      return isNoIndexHostname(configuredSiteUrl);
    }
  });
};
