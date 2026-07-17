import axios, { AxiosError, isAxiosError } from "axios";
import { ApiError } from "./errors";
import type { ApiErrorBody, ApiErrorCode } from "./types";

export { ApiError } from "./errors";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api",
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
});

function looksLikeHtml(data: unknown): boolean {
  if (typeof data !== "string") return false;
  const trimmed = data.trimStart().toLowerCase();
  return trimmed.startsWith("<!doctype") || trimmed.startsWith("<html");
}

function parseApiErrorBody(data: unknown): ApiErrorBody["error"] | null {
  if (data === null || typeof data !== "object") return null;
  const body = data as Record<string, unknown>;
  const error = body.error;
  if (error === null || typeof error !== "object") return null;
  const payload = error as Record<string, unknown>;
  if (typeof payload.code !== "string" || typeof payload.message !== "string") {
    return null;
  }
  return {
    code: payload.code as ApiErrorCode,
    message: payload.message,
  };
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }
    if (!error.response) {
      return "Cannot reach the API. Check VITE_API_URL and that the backend is running.";
    }

    const parsed = parseApiErrorBody(error.response.data);
    if (parsed?.message) {
      return parsed.message;
    }

    if (looksLikeHtml(error.response.data)) {
      return "API returned a web page instead of JSON. Check VITE_API_URL points to your backend /api.";
    }

    if (typeof error.response.data === "string" && error.response.data.trim()) {
      return error.response.data.slice(0, 200);
    }

    return `Request failed (${error.response.status})`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

api.interceptors.response.use(
  (response) => {
    const contentType = String(response.headers["content-type"] ?? "");
    const isJson = contentType.includes("application/json");
    const isPdf = contentType.includes("application/pdf");
    const isBlob = typeof Blob !== "undefined" && response.data instanceof Blob;

    if (looksLikeHtml(response.data)) {
      return Promise.reject(
        new ApiError(
          "INTERNAL_ERROR",
          "API returned a web page instead of JSON. Check VITE_API_URL points to your backend /api.",
          response.status,
        ),
      );
    }

    if (
      response.config.responseType !== "blob" &&
      !isBlob &&
      !isPdf &&
      response.data !== "" &&
      response.data !== undefined &&
      response.data !== null &&
      !isJson &&
      typeof response.data === "string"
    ) {
      return Promise.reject(
        new ApiError(
          "INTERNAL_ERROR",
          "API returned a non-JSON response. Check VITE_API_URL points to your backend /api.",
          response.status,
        ),
      );
    }

    return response;
  },
  (error: AxiosError<unknown>) => {
    const parsed = parseApiErrorBody(error.response?.data);
    if (parsed) {
      return Promise.reject(
        new ApiError(parsed.code, parsed.message, error.response?.status),
      );
    }

    if (looksLikeHtml(error.response?.data)) {
      return Promise.reject(
        new ApiError(
          "INTERNAL_ERROR",
          "API returned a web page instead of JSON. Check VITE_API_URL points to your backend /api.",
          error.response?.status,
        ),
      );
    }

    return Promise.reject(error);
  },
);
