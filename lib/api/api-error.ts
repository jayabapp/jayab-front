import axios from "axios";

export type ApiErrorDetails = {
  code?: string;
  details?: unknown;
  messages?: { fa?: string };
};

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, options?: { status?: number; code?: string; details?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

export const isRequestCancelled = (error: unknown) => axios.isCancel(error);

export const normalizeApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError<ApiErrorDetails>(error)) {
    const data = error.response?.data;
    return new ApiError(data?.messages?.fa || error.message || "خطایی در ارتباط با سرور رخ داده است", {
      status: error.response?.status,
      code: data?.code || error.code,
      details: data?.details || data,
    });
  }

  if (error instanceof Error) return new ApiError(error.message);
  return new ApiError("خطایی ناشناخته رخ داده است", { details: error });
};
