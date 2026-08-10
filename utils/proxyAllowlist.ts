import { apiRoutes } from "./urls";

const PARAM = "__PARAM__";

const SERVER_ONLY_ROUTES: Array<keyof typeof apiRoutes> = [
  "AU1",
  "AU2",
  "APP_SETTINGS",
  "SETTING_LLMS",
  "REDIRECT_CHECK",
  "SETTING_ROBOTS",
  "SETTING_SITEMAP",
  "ADMIN_EDIT_VALIDATE",
];

const ALLOWED_VERSIONS = new Set(["v1", "v2"]);

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toPattern = (template: string) => {
  const pathOnly = template.split("?")[0].replace(/\/+$/, "");
  return new RegExp(`^${escapeRegex(pathOnly).split(PARAM).join("[^/]+")}$`);
};

const buildPatterns = () => {
  const templates = new Set<string>();
  for (const [name, entry] of Object.entries(apiRoutes)) {
    if (SERVER_ONLY_ROUTES.includes(name as keyof typeof apiRoutes)) continue;
    const template = entry as string | ((...args: string[]) => string);
    templates.add(
      typeof template === "function" ? template(PARAM, PARAM) : template,
    );
  }
  return [...templates].map(toPattern);
};

const ALLOWED_PATHS = buildPatterns();

export const isProxyablePath = (segments: string[]) => {
  const [version, ...rest] = segments;
  if (!version || !ALLOWED_VERSIONS.has(version) || rest.length === 0)
    return false;
  if (rest.some((segment) => !segment || segment === "." || segment === ".."))
    return false;
  const path = `/${rest.join("/")}`;
  return ALLOWED_PATHS.some((pattern) => pattern.test(path));
};
