import axios, { AxiosError, isAxiosError } from "axios";
import type { ApiErrorBody, ApiErrorCode } from "./types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api",
});

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;
    if (data?.error?.message) {
      return data.error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const body = error.response?.data;
    if (body?.error?.code && body.error.message) {
      return Promise.reject(
        new ApiError(body.error.code, body.error.message, error.response?.status),
      );
    }
    return Promise.reject(error);
  },
);
