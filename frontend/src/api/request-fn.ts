import Config from "@/app/config";
import { requestFn as defaultRequestFn } from "@openapi-qraft/react";
import type {
  RequestFnInfo,
  RequestFnOptions,
  RequestFnResponse,
} from "@openapi-qraft/react";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;



async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${Config.API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function requestFn<TData, TError>(
  schema: { url: string; method: string; mediaType?: readonly string[] },
  requestInfo: RequestFnInfo,
  options?: RequestFnOptions
): Promise<RequestFnResponse<TData, TError>> {
  const response = await defaultRequestFn<TData, TError>(
    schema,
    {
      ...requestInfo,
      credentials: "include",
    },
    options
  );
  if ("response" in response && response.response?.status === 401) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return defaultRequestFn<TData, TError>(
        schema,
        {
          ...requestInfo,
          credentials: "include",
        },
        options
      );
    }
  }

  return response;
}
