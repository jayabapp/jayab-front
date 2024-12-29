import Notify from "@/components/shared/Toast";
import { baseUrl } from "@/utils/urls";

import axios, { AxiosRequestHeaders, AxiosResponse, AxiosRequestConfig } from "axios";

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
  type?: "file",
  passedToken?: string
): Promise<K | undefined> {
  try {
    /**
     * create axios config
     */
    const config: AxiosRequestConfig = {
      method,
      url: baseUrl + url,
      headers: headerItems(type, passedToken),
      data: body,
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
      localStorage?.removeItem("isLogin");
      window?.location?.replace("/auth");
    }
    throw error?.response?.data || "Failed";
  }
}

/**
 * Create header items
 * @returns
 */
const headerItems = (type?: "file", passedToken?: string) => {
  const token: string = localStorage.getItem("access_token") || "";
  let headers = {
    Accept: `application/json`,
    "Content-Type": `application/json`,
    // "x-language": language == "de" ? "de-lu" : "en-Us",
  } as AxiosRequestHeaders | { authorization?: string };
  if (type == "file") {
    headers = {};
  }

  if (passedToken || token) headers.authorization = `Bearer ${passedToken || token}`;

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
  Notify({ type: "error", title: "خطا", body: typeof message == "string" ? message : message[0] });
};
