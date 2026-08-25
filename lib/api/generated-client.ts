import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiCall } from "../../api_services/common/apicall.helper";

type ApiMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

const normalizeGeneratedUrl = (url: string) => {
  const match = url.match(/^\/api\/(v?\d+)(\/.*)$/);
  if (!match) return { route: url, version: undefined };
  return { route: match[2], version: match[1] };
};

export const generatedApiClient = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const mergedConfig = { ...config, ...options };
  const method = (mergedConfig.method || "GET").toUpperCase() as ApiMethod;
  const { route, version } = normalizeGeneratedUrl(mergedConfig.url || "");
  const body = method === "GET" ? mergedConfig.params : mergedConfig.data;

  const result = await apiCall<unknown, T>(method, route, body, {
    signal: mergedConfig.signal as AbortSignal | undefined,
    version,
  });

  return result as T;
};

export type ErrorType<TError> = AxiosError<TError>;
export type BodyType<TBody> = TBody;
