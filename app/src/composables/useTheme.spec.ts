import { beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "mediqueue-theme";

function mockSystemTheme(initiallyDark: boolean) {
  let onChange: ((event: MediaQueryListEvent) => void) | undefined;
  const addEventListener = vi.fn(
    (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      onChange = listener;
    },
  );
  const mediaQuery = {
    matches: initiallyDark,
    addEventListener,
    addListener: vi.fn(),
  };

  vi.stubGlobal("matchMedia", vi.fn(() => mediaQuery));

  return {
    addEventListener,
    change(matches: boolean) {
      mediaQuery.matches = matches;
      onChange?.({ matches } as MediaQueryListEvent);
    },
  };
}

async function loadTheme() {
  vi.resetModules();
  return import("@/composables/useTheme");
}

describe("useTheme", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    mockSystemTheme(false);
  });

  it("defaults to the system preference", async () => {
    const { useTheme } = await loadTheme();
    const theme = useTheme();

    expect(theme.preference.value).toBe("system");
    expect(theme.resolvedTheme.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("applies and persists an explicit light selection", async () => {
    const { useTheme } = await loadTheme();
    const theme = useTheme();

    theme.setTheme("light");

    expect(theme.preference.value).toBe("light");
    expect(theme.resolvedTheme.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("applies and persists an explicit dark selection", async () => {
    const { useTheme } = await loadTheme();
    const theme = useTheme();

    theme.setTheme("dark");

    expect(theme.preference.value).toBe("dark");
    expect(theme.resolvedTheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("resolves system preference from the operating system", async () => {
    mockSystemTheme(true);
    const { useTheme } = await loadTheme();

    expect(useTheme().preference.value).toBe("system");
    expect(useTheme().resolvedTheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("loads and applies a persisted preference", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const { useTheme } = await loadTheme();

    expect(useTheme().preference.value).toBe("dark");
    expect(useTheme().resolvedTheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("responds to system changes only while system preference is selected", async () => {
    const system = mockSystemTheme(false);
    const { useTheme } = await loadTheme();
    const theme = useTheme();

    expect(system.addEventListener).toHaveBeenCalledTimes(1);
    system.change(true);
    expect(theme.resolvedTheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    theme.setTheme("light");
    system.change(false);
    expect(theme.resolvedTheme.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("falls back to system preference for an invalid stored value", async () => {
    localStorage.setItem(STORAGE_KEY, "sepia");
    mockSystemTheme(true);
    const { useTheme } = await loadTheme();

    expect(useTheme().preference.value).toBe("system");
    expect(useTheme().resolvedTheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("continues to work when local storage is unavailable", async () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => {
        throw new Error("Storage unavailable");
      }),
      setItem: vi.fn(() => {
        throw new Error("Storage unavailable");
      }),
    });
    const { useTheme } = await loadTheme();
    const theme = useTheme();

    expect(theme.preference.value).toBe("system");
    expect(() => theme.setTheme("dark")).not.toThrow();
    expect(theme.resolvedTheme.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
