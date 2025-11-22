import Config from "@/app/config";
import {
  requestFn as defaultRequestFn,
  type OperationSchema,
  type RequestFnInfo,
  type RequestFnOptions,
  type RequestFnResponse,
} from "@openapi-qraft/react";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const r = await fetch(`${Config.API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      return r.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function mutableSchema(schema: OperationSchema): OperationSchema {
  return {
    ...schema,
    mediaType: schema.mediaType ? [...schema.mediaType] : undefined,
  };
}

export async function requestFn<TData, TError>(
  schema: OperationSchema,
  requestInfo: RequestFnInfo,
  options?: RequestFnOptions
): Promise<RequestFnResponse<TData, TError>> {
  const s = mutableSchema(schema);

  const response = await defaultRequestFn<TData, TError>(
    s,
    { ...requestInfo, credentials: "include" },
    options
  );

  if ("response" in response && response.response?.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const s2 = mutableSchema(schema);

      return defaultRequestFn<TData, TError>(
        s2,
        { ...requestInfo, credentials: "include" },
        options
      );
    }
  }

  return response;
}
