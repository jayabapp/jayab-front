import Notify from "@/components/shared/Toast";
import { baseUrl, baseUrlV } from "@/utils/urls";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

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
    handleError(error);
    if (error?.response?.status == 401) {
      localStorage?.removeItem("access_token");
      localStorage.removeItem("socket_token");
      localStorage?.removeItem("isLogin");
      window?.location?.replace("/");
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
const handleError = (error: any) => {
  const message =
    error?.response?.data?.messages?.en ||
    error?.response?.data?.messages?.fa ||
    error?.response?.data?.message ||
    error?.message;
  Notify({
    type: "error",
    title: "خطا",
    body: typeof message == "string" ? message : message[0],
  });
};
