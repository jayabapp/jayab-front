import { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { readServerAccessToken } from "./server-token";
import { baseUrl, baseUrlV } from "@/utils/urls";
import { endSession } from "@/helpers/session";
import { notify } from "@/components/shared/Toast/notify";

import axios from "axios";

type Methods = "POST" | "PUT" | "DELETE" | "PATCH" | "GET";

export type ApiCallOptions = {
  headers?: Record<string, string>;
  version?: string;
  passedToken?: string;
  localRoute?: boolean;
  signal?: AbortSignal;
  serverAuth?: boolean;
  showErrorNotification?: boolean;
  progressCallBack?: (e: unknown) => void | null;
};

interface SuccessResponse<K> {
  data: K;
  status: "successful" | "failed";
  messages: { fa: string | undefined };
}

const isBrowser = typeof window !== "undefined";
let unauthorizedRedirectStarted = false;

export async function apiCall<T, K>(
  method: Methods,
  url: string,
  body?: T,
  options?: ApiCallOptions,
): Promise<K | undefined> {
  try {
    const IS_FORM_DATA = !!body && body instanceof FormData;
    const token =
      options?.passedToken ??
      (isBrowser || options?.serverAuth === false
        ? undefined
        : await readServerAccessToken());
    const config: AxiosRequestConfig = {
      method,
      url: options?.localRoute
        ? url
        : isBrowser
          ? `/api/backend/${options?.version || "v1"}${url}`
          : !!options?.version
            ? baseUrlV(options.version) + url
            : baseUrl + url,
      headers: {
        ...headerItems(IS_FORM_DATA ? "file" : undefined, token),
        ...options?.headers,
      },
      data: body,
      signal: options?.signal,
      onUploadProgress: options?.progressCallBack,
    };
    if (method == "GET") {
      config.params = body;
    }
    const response = await axios(config);

    if (response.data?.meta) {
      const res: K & {
        status: "successful" | "failed";
        messages: { fa: string | undefined };
      } = response.data;
      if (res?.status == "successful") {
        const message = res?.messages?.fa;
        if (message) void notify({ type: "success", title: "", body: message });
        return res;
      }
      return undefined;
    } else {
      const res: SuccessResponse<K> = response.data;
      if (res.status == "successful") {
        const message = res?.messages?.fa;
        if (message) void notify({ type: "success", title: "", body: message });
        return res.data;
      }
    }
    return undefined;
  } catch (error: any) {
    if (axios.isCancel(error)) throw error;
    handleError(error, options?.showErrorNotification !== false);
    if (error?.response?.status == 401 && isBrowser && !unauthorizedRedirectStarted) {
      unauthorizedRedirectStarted = true;
      await endSession();
      window?.location?.replace("/");
    }
    if (error?.response?.status == 410) {
      window?.location?.replace("/");
      return;
    }
    throw error?.response?.data || "Failed";
  }
}

const headerItems = (
  type?: "file",
  passedToken?: string,
) => {
  let headers = {
    Accept: `application/json`,
    "Content-Type": `application/json`,
  } as AxiosRequestHeaders | { authorization?: string };
  if (type == "file") headers = {};
  if (passedToken) headers.authorization = `Bearer ${passedToken}`;
  return headers;
};

async function handleError(
  error: any,
  showNotifications: boolean,
  shouldRedirect?: boolean,
) {
  let message = "";
  let title = "خطا";
  if (
    !error.response &&
    (error.message === "Network Error" || error.code === "ECONNABORTED")
  )
    message = "خطا در ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.";
  else if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      message = "نشست شما منقضی شده است. لطفا دوباره وارد شوید.";
      title = "نشست منقضی";
    } else if (status === 500) {
      message = "خطای داخلی سرور. لطفا بعدا دوباره تلاش کنید.";
      title = "خطای سرور";
    } else {
      const responseData = error?.response?.data;
      const errorMessage = responseData?.messages?.fa || responseData?.message;
      if (Array.isArray(errorMessage)) message = errorMessage.join("، ");
      else message = errorMessage || error?.message || "خطایی رخ داده است";
    }
  } else {
    message = error?.message || "خطایی رخ داده است";
  }

  if (shouldRedirect && !isBrowser) {
    const status = error?.response?.status;
    if (status === 404 || status === 500) {
      const { notFound } = await import("next/navigation");
      notFound();
    }
  }

  if (showNotifications && isBrowser) {
    await notify({
      type: "error",
      title: title,
      body: message,
    });
  }
}
