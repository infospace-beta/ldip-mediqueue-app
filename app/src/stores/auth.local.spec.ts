import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

const demoAccounts = [
  ["test@gmail.com", "test", "patient"],
  ["joekaranja@gmail.com", "joe123", "patient"],
  ["responder@gmail.com", "responder123", "responder"],
  ["doctor@gmail.com", "doctor123", "doctor"],
  ["staff@gmail.com", "staff123", "staff"],
  ["admin@gmail.com", "admin123", "admin"],
] as const;

let useAuthStore: typeof import("@/stores/auth.store").useAuthStore;

beforeAll(async () => {
  vi.stubEnv("VITE_API_URL", "http://localhost:3000");
  vi.stubEnv("VITE_MODE", "local");
  ({ useAuthStore } = await import("@/stores/auth.store"));
});

afterAll(() => {
  vi.unstubAllEnvs();
});

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

describe("local demo authentication", () => {
  it.each(demoAccounts)(
    "authenticates %s through the local HTTP client",
    async (email, password, role) => {
      const auth = useAuthStore();
      const loggedIn = await auth.login({ email, password });

      expect(loggedIn).toBe(true);
      expect(auth.user?.username).toBe(email);
      expect(auth.user?.role).toBe(role);
      expect(auth.user).not.toHaveProperty("password");
      expect(auth.token).toBe("fake-jwt-token");
    },
  );

  it("rejects invalid credentials without creating a session", async () => {
    const auth = useAuthStore();
    const loggedIn = await auth.login({
      email: "test@gmail.com",
      password: "wrong",
    });

    expect(loggedIn).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.token).toBeNull();
    expect(auth.error).toBe("Username or password is incorrect");
  });
});
