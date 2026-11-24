
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { authService, type LoginCredentials } from "@/services/auth.service";
import { useHospitalWorkspaceStore } from "@/stores/hospitalWorkspace.store";
import { resetPatientSession } from "@/data/patient";
import { resetResponderSession } from "@/components/Responder/data.js";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { apiMessage } from "@/utils/errors";
import {
  isUserRole,
  type User,
  type UserRole,
} from "@/types/models";

function mapBackendRole(
  role: string | null | undefined,
): UserRole | null {
  if (typeof role !== "string" || !role.trim()) return null;

  switch (role.toUpperCase()) {
    case "PATIENT":
      return "patient";
    case "RESPONDER":
      return "responder";
    case "DOCTOR":
      return "doctor";
    case "RECEPTIONIST":
    case "MEDICAL_STAFF":
      return "staff";
    case "HOSPITAL_ADMIN":
case "SYSTEM_ADMIN":
  return "admin";
    default:
      return null;
  }
}

function mapProfileToUser(
  profile: Awaited<ReturnType<typeof authService.getCurrentUser>>["data"],
): User | null {
  const role = mapBackendRole(profile.role);
  if (!role) return null;

  const fullName = profile.fullName?.trim() || profile.username;
  const nameParts = fullName.split(/\s+/);

  return {
    id: profile.id,
    username: profile.username,
    firstName: nameParts.shift() || profile.username,
    lastName: nameParts.join(" "),
    role,
    email: profile.email,
    backendRole: profile.role,
    hospitalId: profile.hospitalId,
  };
}

export const useAuthStore = defineStore("auth", () => {
  const user = useLocalStorage<User | null>(STORAGE_KEYS.user, null, {
    serializer: {
      read: (value) => (value ? (JSON.parse(value) as User) : null),
      write: (value) => JSON.stringify(value),
    },
  });

  const token = useLocalStorage<string | null>(STORAGE_KEYS.token, null);
  const returnUrl = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitializing = ref(false);
  let initializationPromise: Promise<boolean> | null = null;

  const isLoggedIn = computed(
    () => Boolean(token.value) &&
      user.value !== null &&
      isUserRole(user.value.role),
  );

  async function login(
    credentials: LoginCredentials,
  ): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await authService.login(credentials);

      if (!data.accessToken) {
        logout();
        error.value = "The server did not return an access token.";
        return false;
      }

      token.value = data.accessToken;

      const { data: profile } = await authService.getCurrentUser();
      const mappedUser = mapProfileToUser(profile);

      if (!mappedUser) {
        logout();
        error.value =
          "This account has an unsupported role.";
        return false;
      }

      user.value = mappedUser;
      return true;
    } catch (err) {
      logout();
      error.value = apiMessage(err, "Login failed.");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshBackendProfile(): Promise<boolean> {
    if (!token.value) return false;

    try {
      const { data: profile } = await authService.getCurrentUser();
      const mappedUser = mapProfileToUser(profile);

      if (!mappedUser) {
        logout();
        error.value =
          "This account has an unsupported role.";
        return false;
      }

      user.value = mappedUser;
      error.value = null;
      return true;
    } catch (err) {
      error.value = apiMessage(
        err,
        "Unable to refresh your account profile.",
      );
      console.error("Error refreshing current user:", err);
      return false;
    }
  }

  async function initializeSession(): Promise<boolean> {
    if (initializationPromise) return initializationPromise;

    if (!token.value) {
      user.value = null;
      return false;
    }

    isInitializing.value = true;

    initializationPromise = (async () => {
      try {
        const valid = await refreshBackendProfile();

        if (!valid) {
          logout();
        }

        return valid;
      } finally {
        isInitializing.value = false;
        initializationPromise = null;
      }
    })();

    return initializationPromise;
  }

  function logout(): void {
    user.value = null;
    token.value = null;
    error.value = null;

    useHospitalWorkspaceStore().clearWorkspace();
    resetPatientSession();
    resetResponderSession();
  }

  return {
    user,
    token,
    returnUrl,
    isLoading,
    error,
    isInitializing,
    isLoggedIn,
    login,
    refreshBackendProfile,
    initializeSession,
    logout,
  };
});
