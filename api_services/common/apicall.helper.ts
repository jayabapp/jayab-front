import Notify from "@/components/shared/Toast";
import { baseUrl, baseUrlV } from "@/utils/urls";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { deleteCookie } from "cookies-next";

type Methods = "POST" | "PUT" | "DELETE" | "PATCH" | "GET";

interface SuccessResponse<K> {
  status: "successful" | "failed";
  messages: { fa: string | undefined };
  data: K;
}

// x-language en-US
/**
 * call route with axios and return data\
 * **T** is `body` type\
 * **K** is `return` type
 * @param method
 * @param url
 * @param body
 * @returns
 */

// Helper to detect if we're in a browser environment
const isBrowser = typeof window !== "undefined";

export async function apiCall<T, K>(
  method: Methods,
  url: string,
  body?: T,
  options?: {
    progressCallBack?: (e: any) => void | null;
    isSocketToken?: boolean;
    passedToken?: string;
    version?: string;
  },
): Promise<K | undefined> {
  try {
    /**
     * create axios config
     */
    const IS_FORM_DATA = !!body && body instanceof FormData;

    const config: AxiosRequestConfig = {
      method,
      url: !!options?.version ? baseUrlV(options?.version) + url : baseUrl + url,
      headers: headerItems(IS_FORM_DATA ? "file" : undefined, options?.isSocketToken, options?.passedToken),
      data: body,

      onUploadProgress: options?.progressCallBack,
    };
    if (method == "GET") {
      config.params = body;
    }
    const response = await axios(config);

    /**
     * return data if status is success
     */

    if (response.data?.meta) {
      const res: K & { status: "successful" | "failed"; messages: { fa: string | undefined } } = response.data;

      if (res?.status == "successful") {
        const message = res?.messages?.fa;
        if (message) {
          Notify({ type: "success", title: "", body: message });
        }
        return res;
      }
      return undefined;
    } else {
      const res: SuccessResponse<K> = response.data;

      if (res.status == "successful") {
        const message = res?.messages?.fa;
        if (message) {
          Notify({ type: "success", title: "", body: message });
        }
        return res.data;
      }
    }
    return undefined;
  } catch (error: any) {
    /**
     * Notify error
     * throw function
     * check auth
     */
    handleError(error, true);
    if (error?.response?.status == 401) {
      localStorage?.removeItem("access_token");
      localStorage.removeItem("socket_token");
      localStorage?.removeItem("isLogin");
      deleteCookie("isLogin");
      window?.location?.replace("/");
    }
    if (error?.response?.status == 410) {
      window?.location?.replace("/");
      return;
    }
    throw error?.response?.data || "Failed";
  }
}

/**
 * Create header items
 * @returns
 */
const headerItems = (type?: "file", isSocketToken?: boolean, passedToken?: string) => {
  const token: string = localStorage.getItem("access_token") || "";
  const socketToken: string = localStorage.getItem("socket_token") || "";
  let headers = {
    Accept: `application/json`,
    "Content-Type": `application/json`,
    // "x-language": language == "de" ? "de-lu" : "en-Us",
  } as AxiosRequestHeaders | { authorization?: string };
  if (type == "file") {
    headers = {};
  }
  if (!!isSocketToken && !!socketToken) {
    headers.authorization = `Bearer ${socketToken}`;
  } else if (token || passedToken) headers.authorization = `Bearer ${token || passedToken}`;

  return headers;
};

/**
 * find error message and notify
 * @param error
 */
async function handleError(error: any, showNotifications: boolean, shouldRedirect?: boolean) {
  // Determine error type and message
  let message = "";
  let title = "خطا";

  // Network error (no response)
  if (!error.response && (error.message === "Network Error" || error.code === "ECONNABORTED")) {
    message = "خطا در ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.";
  }
  // HTTP errors with status
  else if (error.response) {
    const status = error.response.status;

    if (status === 401) {
      message = "نشست شما منقضی شده است. لطفا دوباره وارد شوید.";
      title = "نشست منقضی";
    } else if (status === 500) {
      message = "خطای داخلی سرور. لطفا بعدا دوباره تلاش کنید.";
      title = "خطای سرور";
    } else {
      // Try to get message from response - handle both string and array
      const responseData = error?.response?.data;
      const errorMessage = responseData?.messages?.fa || responseData?.message;

      if (Array.isArray(errorMessage)) {
        message = errorMessage.join("، ");
      } else {
        message = errorMessage || error?.message || "خطایی رخ داده است";
      }
    }
  } else {
    message = error?.message || "خطایی رخ داده است";
  }

  // Handle redirect for 404/500 errors in SSR
  if (shouldRedirect && !isBrowser) {
    const status = error?.response?.status;
    if (status === 404 || status === 500) {
      const { notFound } = await import("next/navigation");
      notFound();
    }
  }

  // Only show notifications in browser and if enabled
  if (showNotifications && isBrowser) {
    const { default: Notify } = await import("@/components/shared/Toast");
    Notify({
      type: "error",
      title: title,
      body: message,
    });
  }
}
