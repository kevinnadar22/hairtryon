import { QueryClient } from "@tanstack/react-query";
import { createAPIClient } from "@/api/create-api-client";
import { requestFn } from "@/api/request-fn";
import Config from "@/app/config";

const queryClient = new QueryClient();

export const api = createAPIClient({
  requestFn,
  queryClient,
  baseUrl: Config.API_URL as string,
});

export { queryClient };
