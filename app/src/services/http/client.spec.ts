import { beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosError, type AxiosAdapter } from "axios";
import { axiosInstance } from "@/services/http/client";
import { STORAGE_KEYS } from "@/constants/storageKeys";

const authStoreMock = vi.hoisted(() => ({
  token: "renewed-backend-jwt" as string | null,
  renewBackendSession: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("@/stores/auth.store", () => ({
  useAuthStore: () => authStoreMock,
}));

describe("HTTP client authorization header", () => {
  beforeEach(() => {
    localStorage.clear();
    authStoreMock.token = "renewed-backend-jwt";
    authStoreMock.renewBackendSession.mockReset().mockResolvedValue(true);
    authStoreMock.logout.mockReset().mockResolvedValue(undefined);
  });

  it("preserves an explicitly supplied Bearer token", async () => {
    localStorage.setItem(STORAGE_KEYS.token, JSON.stringify("stored-jwt"));
    let authorization: unknown;
    const adapter: AxiosAdapter = async (config) => {
      authorization = config.headers.get("Authorization");
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    await axiosInstance.get("/api/v1/users/me", {
      adapter,
      headers: { Authorization: "Bearer current-jwt" },
    });

    expect(authorization).toBe("Bearer current-jwt");
  });

  it("continues attaching the stored token when no explicit header is supplied", async () => {
    localStorage.setItem(STORAGE_KEYS.token, JSON.stringify("stored-jwt"));
    let authorization: unknown;
    const adapter: AxiosAdapter = async (config) => {
      authorization = config.headers.get("Authorization");
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    await axiosInstance.get("/users", { adapter });

    expect(authorization).toBe("Bearer stored-jwt");
  });

  it("does not attach the stored backend token to the Supabase exchange request", async () => {
    localStorage.setItem(STORAGE_KEYS.token, "stored-backend-jwt");
    let authorization: unknown;
    const adapter: AxiosAdapter = async (config) => {
      authorization = config.headers.get("Authorization");
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    await axiosInstance.post("/api/v1/auth/supabase/exchange", {}, { adapter });

    expect(authorization).toBeUndefined();
  });

  it("renews and retries an API request once after a 401", async () => {
    let attempts = 0;
    let retriedAuthorization: unknown;
    const adapter: AxiosAdapter = async (config) => {
      attempts += 1;
      if (attempts === 1) {
        throw new AxiosError(
          "Unauthorized",
          "ERR_BAD_REQUEST",
          config,
          undefined,
          {
            data: {},
            status: 401,
            statusText: "Unauthorized",
            headers: {},
            config,
          },
        );
      }

      retriedAuthorization = config.headers.get("Authorization");
      return {
        data: { ok: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const response = await axiosInstance.get("/api/v1/hospitals", { adapter });

    expect(response.data).toEqual({ ok: true });
    expect(attempts).toBe(2);
    expect(retriedAuthorization).toBe("Bearer renewed-backend-jwt");
    expect(authStoreMock.renewBackendSession).toHaveBeenCalledTimes(1);
    expect(authStoreMock.logout).not.toHaveBeenCalled();
  });

  it("logs out after a retried request still receives 401 without retrying again", async () => {
    let attempts = 0;
    const adapter: AxiosAdapter = async (config) => {
      attempts += 1;
      throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, undefined, {
        data: {},
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
      });
    };

    await expect(
      axiosInstance.get("/api/v1/hospitals", { adapter }),
    ).rejects.toMatchObject({ response: { status: 401 } });

    expect(attempts).toBe(2);
    expect(authStoreMock.renewBackendSession).toHaveBeenCalledTimes(1);
    expect(authStoreMock.logout).toHaveBeenCalledTimes(1);
  });

  it("does not recursively renew or log out for auth lifecycle endpoints", async () => {
    const adapter: AxiosAdapter = async (config) => {
      throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, undefined, {
        data: {},
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
      });
    };

    await expect(
      axiosInstance.get("/api/v1/users/me", { adapter }),
    ).rejects.toMatchObject({ response: { status: 401 } });

    expect(authStoreMock.renewBackendSession).not.toHaveBeenCalled();
    expect(authStoreMock.logout).not.toHaveBeenCalled();
  });
});
