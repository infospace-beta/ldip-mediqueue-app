import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/types/models";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";

vi.mock("@/services/auth.service", () => ({
  authService: { login: vi.fn() },
}));

const TEST_USER: User = {
  id: 1,
  username: "test@gmail.com",
  firstName: "Test",
  lastName: "User",
};

describe("auth store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("stores the user as an object, not a JSON string", async () => {
    vi.mocked(authService.login).mockResolvedValue({
      data: { user: TEST_USER, token: "fake-jwt-token" },
    } as Awaited<ReturnType<typeof authService.login>>);

    const auth = useAuthStore();
    const ok = await auth.login({ email: "test@gmail.com", password: "test" });

    expect(ok).toBe(true);
    expect(auth.user).toEqual(TEST_USER);
    expect(auth.user?.firstName).toBe("Test");
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.token).toBe("fake-jwt-token");
  });

  it("surfaces the API message and stays logged out on failure", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new AxiosError("Bad request", "400", undefined, null, {
        status: 400,
        data: { message: "Username or password is incorrect" },
      } as never),
    );

    const auth = useAuthStore();
    const ok = await auth.login({ email: "test@gmail.com", password: "nope" });

    expect(ok).toBe(false);
    expect(auth.error).toBe("Username or password is incorrect");
    expect(auth.isLoggedIn).toBe(false);
  });

  it("clears the session on logout", async () => {
    vi.mocked(authService.login).mockResolvedValue({
      data: { user: TEST_USER, token: "fake-jwt-token" },
    } as Awaited<ReturnType<typeof authService.login>>);

    const auth = useAuthStore();
    await auth.login({ email: "test@gmail.com", password: "test" });
    auth.logout();

    expect(auth.user).toBeNull();
    expect(auth.token).toBeNull();
    expect(auth.isLoggedIn).toBe(false);
  });
});
