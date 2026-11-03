import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { authService, type LoginCredentials } from "@/services/auth.service";
import { useHospitalWorkspaceStore } from "@/stores/hospitalWorkspace.store";
import { resetPatientSession } from "@/data/patient";
import { resetResponderSession } from "@/components/Responder/data.js";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { apiMessage } from "@/utils/errors";
import { isUserRole, type User } from "@/types/models";

export const useAuthStore = defineStore("auth", () => {
  /**STATE
   * `user` and `token` are persisted, so a refresh keeps the session.
   * useLocalStorage handles serialisation - never stringify before assigning.
   */
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

  /**GETTERS */
  const isLoggedIn = computed(
    () => user.value !== null && isUserRole(user.value.role),
  );

  /**ACTIONS */
  /**Authenticate and persist the session. Returns true on success. */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await authService.login(credentials);
      if (!data.user || !isUserRole(data.user.role)) {
        user.value = null;
        token.value = null;
        error.value = "This account has an unsupported role.";
        return false;
      }
      user.value = data.user ?? null;
      token.value = data.token ?? null;
      return true;
    } catch (err) {
      error.value = apiMessage(err, "Login failed.");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**Clear the session. Navigation is the caller's job. */
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
    isLoggedIn,
    login,
    logout,
  };
});
