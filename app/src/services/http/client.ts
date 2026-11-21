
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { STORAGE_KEYS } from "@/constants/storageKeys";

/**
 * The single HTTP entry point for the app.
 * Nothing outside src/services should import axios directly.
 */

const ROOT_URL = import.meta.env.VITE_API_URL;

type RetryableRequestConfig = AxiosRequestConfig & {
  _mediQueueRetry?: boolean;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: ROOT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Read a token from localStorage and remove JSON string quotes
 * when useLocalStorage has serialized the value.
 */
function getStoredToken(): string | null {
  const token = localStorage.getItem(STORAGE_KEYS.token);

  if (!token) return null;

  if (token.startsWith('"') && token.endsWith('"')) {
    try {
      return JSON.parse(token) as string;
    } catch {
      return token;
    }
  }

  return token;
}

/**
 * Attach the stored backend token when the request does not
 * already have an Authorization header.
 *
 * The Supabase exchange endpoint must remain unauthenticated
 * with respect to the old backend token.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url ?? "";
    const isSupabaseExchange = url.includes(
      "/api/v1/auth/supabase/exchange",
    );

    const hasExplicitAuthorization =
      config.headers.has("Authorization");

    if (!isSupabaseExchange && !hasExplicitAuthorization) {
      const token = getStoredToken();

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
  (error: unknown) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

/**
 * Auth lifecycle endpoints must not trigger automatic renewal.
 * In particular, /users/me is used to retrieve the current profile.
 */
function isAuthLifecycleEndpoint(url: string): boolean {
  return (
    url.includes("/api/v1/auth/") ||
    url.endsWith("/api/v1/users/me")
  );
}

/**
 * Handle unauthorized requests:
 * 1. Attempt one backend-session renewal.
 * 2. Retry the original request once with the renewed token.
 * 3. Log out if the retry also receives 401.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.response) {
      if (axios.isAxiosError(error) && error.request) {
        console.error(
          "Network error or no response received:",
          error.request,
        );
      } else {
        console.error("Error setting up request:", error);
      }

      return Promise.reject(error);
    }

    const status = error.response.status;
    const originalRequest = error.config as
      | (typeof error.config & RetryableRequestConfig)
      | undefined;

    if (status === 403) {
      console.warn("Access forbidden (403).");
      return Promise.reject(error);
    }

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    if (isAuthLifecycleEndpoint(requestUrl)) {
      return Promise.reject(error);
    }

    try {
      const { useAuthStore } = await import("@/stores/auth.store");
      const authStore = useAuthStore();

      // The request has already been retried. Do not retry again.
      if (originalRequest._mediQueueRetry) {
        console.warn("Unauthorized after session renewal. Logging out.");
        await authStore.logout();
        return Promise.reject(error);
      }

      originalRequest._mediQueueRetry = true;

      const renewed = await (
        authStore as typeof authStore & {
          renewBackendSession: () => Promise<boolean>;
        }
      ).renewBackendSession();

      if (!renewed || !authStore.token) {
        console.warn("Backend session renewal failed. Logging out.");
        await authStore.logout();
        return Promise.reject(error);
      }

      // Use the newly renewed MediQueue backend JWT.
      originalRequest.headers.set(
        "Authorization",
        `Bearer ${authStore.token}`,
      );

      return axiosInstance.request(originalRequest);
    } catch (renewalError) {
      console.error("Failed to renew backend session:", renewalError);
      return Promise.reject(error);
    }
  },
);

/**
 * Wrapped methods - what services should use.
 * The generic is the response body, so api.get<Post[]>("/posts")
 * gives a typed response.
 */
const api = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.get<T>(url, config),

  post: <T, B = unknown>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.post<T>(url, data, config),

  patch: <T, B = unknown>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.patch<T>(url, data, config),

  put: <T, B = unknown>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.put<T>(url, data, config),

  delete: <T = void>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.delete<T>(url, config),
};

export default api;

/** Escape hatch for the rare call that needs the raw instance. */
export { axiosInstance };
