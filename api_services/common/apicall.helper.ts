import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { baseUrl, baseUrlV } from "@/utils/urls";
import { endSession } from "@/helpers/session";
import { notify } from "@/components/shared/Toast/notify";

type Methods = "POST" | "PUT" | "DELETE" | "PATCH" | "GET";

interface SuccessResponse<K> {
  data: K;
  status: "successful" | "failed";
  messages: { fa: string | undefined };
}

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
    localRoute?: boolean;
  },
): Promise<K | undefined> {
  try {
    const IS_FORM_DATA = !!body && body instanceof FormData;
    const config: AxiosRequestConfig = {
      method,
      url: options?.localRoute
        ? url
        : isBrowser
          ? `/api/backend/${options?.version || "v1"}${url}`
          : !!options?.version
            ? baseUrlV(options.version) + url
            : baseUrl + url,
      headers: headerItems(
        IS_FORM_DATA ? "file" : undefined,
        options?.isSocketToken,
        options?.passedToken,
      ),
      data: body,
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
    handleError(error, true);
    if (error?.response?.status == 401 && isBrowser) {
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
  isSocketToken?: boolean,
  passedToken?: string,
) => {
  let headers = {
    Accept: `application/json`,
    "Content-Type": `application/json`,
  } as AxiosRequestHeaders | { authorization?: string };
  if (type == "file") headers = {};
  const socketToken: string = isBrowser
    ? localStorage.getItem("socket_token") || ""
    : "";
  if (!!isSocketToken && !!socketToken)
    headers.authorization = `Bearer ${socketToken}`;
  else if (passedToken) headers.authorization = `Bearer ${passedToken}`;
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
