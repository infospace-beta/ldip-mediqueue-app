import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/services/http/client";
import { authService } from "@/services/auth.service";

vi.mock("@/services/http/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("authService Supabase exchange", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts the Supabase access token to the exchange endpoint", async () => {
    const response = {
      data: {
        accessToken: "mediqueue-jwt",
        tokenType: "Bearer",
        expiresIn: 3600,
      },
    };
    vi.mocked(api.post).mockResolvedValueOnce(response as never);

    await expect(
      authService.exchangeSupabaseToken("supabase-access-token"),
    ).resolves.toEqual(response);

    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/auth/supabase/exchange",
      { accessToken: "supabase-access-token" },
    );
  });

 it("requests the current authenticated profile", async () => {
  const response = { data: { id: 41, role: "PATIENT" } };

  vi.mocked(api.get).mockResolvedValueOnce(response as never);

  await expect(
    authService.getCurrentUser(),
  ).resolves.toEqual(response);

  expect(api.get).toHaveBeenCalledWith("/api/v1/auth/me");
});
});
