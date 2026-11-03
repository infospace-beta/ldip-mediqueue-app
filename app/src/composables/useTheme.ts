import { computed, readonly, ref } from "vue";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<ThemePreference, "system">;

const STORAGE_KEY = "mediqueue-theme";
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

function readStoredPreference(): ThemePreference {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY) ?? null;
    return isThemePreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function getSystemPreference(): MediaQueryList | null {
  try {
    return typeof window === "undefined"
      ? null
      : (window.matchMedia?.(SYSTEM_DARK_QUERY) ?? null);
  } catch {
    return null;
  }
}

const mediaQuery = getSystemPreference();
const preference = ref<ThemePreference>(readStoredPreference());
const systemIsDark = ref(mediaQuery?.matches ?? false);

const resolvedTheme = computed<ResolvedTheme>(() =>
  preference.value === "system"
    ? systemIsDark.value
      ? "dark"
      : "light"
    : preference.value,
);

function applyTheme(): void {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = resolvedTheme.value;
  }
}

function handleSystemChange(event: MediaQueryListEvent): void {
  systemIsDark.value = event.matches;
  if (preference.value === "system") applyTheme();
}

if (mediaQuery) {
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleSystemChange);
  } else {
    mediaQuery.addListener(handleSystemChange);
  }
}

applyTheme();

function setTheme(theme: ThemePreference): void {
  preference.value = theme;
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, theme);
  } catch {
    // Theme changes still apply when storage is unavailable.
  }
  applyTheme();
}

export function useTheme() {
  return {
    preference: readonly(preference),
    resolvedTheme: readonly(resolvedTheme),
    setTheme,
  };
}
