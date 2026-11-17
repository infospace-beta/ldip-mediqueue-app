import { ref } from "vue";
import { defineStore } from "pinia";
import { usersService } from "@/services/users.service";
import { apiMessage } from "@/utils/errors";
import type { User } from "@/types/models";

export const useUsersStore = defineStore("users", () => {
  /**STATE */
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**ACTIONS */
  async function getAll(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      users.value = await usersService.getAll();
    } catch (err) {
      error.value = apiMessage(err, "Failed to load users.");
      console.error("Error loading users:", err);
      throw new Error(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  return { users, isLoading, error, getAll };
});
