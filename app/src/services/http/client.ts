import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { fakeBackendAdapter } from "@/mocks/fake-backend";
import { STORAGE_KEYS } from "@/constants/storageKeys";

/**
 * The single HTTP entry point for the app.
 * Nothing outside src/services should import axios directly.
 */

const ROOT_URL = import.meta.env.VITE_API_URL;
const USE_FAKE_BACKEND = import.meta.env.VITE_MODE === "local";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: ROOT_URL,
  headers: {
    "Content-Type": "application/json",
  },
  /**In local mode the fake backend answers /login, /users and /contact and
   * passes everything else through */
  ...(USE_FAKE_BACKEND ? { adapter: fakeBackendAdapter } : {}),
});

/**Attach the bearer token, if we have one */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.token);

    if (token) {
      /**useLocalStorage serialises strings with quotes - strip them if present */
      const actualToken =
        token.startsWith('"') && token.endsWith('"')
          ? (JSON.parse(token) as string)
          : token;
      config.headers.set("Authorization", `Bearer ${actualToken}`);
    }

    return config;
  },
  (error: unknown) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

/**Handle Unauthorized and Forbidden centrally */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("Unauthorized (401). Logging out.");
        /**Imported lazily: the auth store imports this client, so a static
         * import here would be a cycle. Add refresh-token retry logic here. */
        try {
          const { useAuthStore } = await import("@/stores/auth.store");
          useAuthStore().logout();
        } catch (importError) {
          console.error("Failed to import authStore for logout:", importError);
        }
      }

      if (status === 403) {
        console.warn("Access forbidden (403).");
      }
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("Network error or no response received:", error.request);
    } else {
      console.error("Error setting up request:", error);
    }

    /**Reject so the calling service/store can handle it */
    return Promise.reject(error);
  },
);

/**
 * Wrapped methods - what services should use. The generic is the response body,
 * so `api.get<Post[]>("/posts")` gives a typed `data`.
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

/**Escape hatch for the rare call that needs the raw instance */
export { axiosInstance };
