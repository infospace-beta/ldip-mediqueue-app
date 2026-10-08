<template>
  <div class="page">
    <header>
      <h1 class="text-2xl font-semibold tracking-tight">
        Welcome back, {{ user?.firstName ?? "friend" }}
      </h1>
      <p class="mt-1 text-sm muted">
        Signed in with a JWT held by the auth store.
      </p>
    </header>

    <div class="mt-8 grid gap-5 sm:grid-cols-3">
      <BaseCard>
        <p class="text-sm muted">Users</p>
        <p class="mt-1 text-3xl font-semibold">{{ usersStore.users.length }}</p>
        <p class="mt-1 text-xs muted">from the guarded endpoint</p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm muted">Signed in as</p>
        <p class="mt-1 truncate text-lg font-semibold">
          {{ user?.username ?? "-" }}
        </p>
        <p class="mt-1 text-xs muted">persisted in localStorage</p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm muted">Backend</p>
        <p class="mt-1 text-lg font-semibold capitalize">{{ mode }}</p>
        <p class="mt-1 text-xs muted">VITE_MODE</p>
      </BaseCard>
    </div>

    <BaseCard class="mt-6" title="Users from the secure API endpoint">
      <StateLoading v-if="usersStore.isLoading" label="Loading users..." />
      <StateError
        v-else-if="usersStore.error"
        :message="usersStore.error"
        :on-retry="loadUsers"
      />
      <StateEmpty v-else-if="!usersStore.users.length" title="No users" />
      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800">
        <li
          v-for="item in usersStore.users"
          :key="item.id"
          class="flex items-center justify-between py-3"
        >
          <span class="font-medium">
            {{ item.firstName }} {{ item.lastName }}
          </span>
          <span class="text-sm muted">{{ item.username }}</span>
        </li>
      </ul>

      <template #footer>
        <div class="flex flex-wrap gap-2">
          <BaseButton
            size="sm"
            @click="router.push({ name: ROUTE_NAMES.apiTest })"
          >
            API test
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="sm"
            @click="router.push({ name: ROUTE_NAMES.posts })"
          >
            Posts
          </BaseButton>
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import StateLoading from "@/components/ui/StateLoading.vue";
import StateEmpty from "@/components/ui/StateEmpty.vue";
import StateError from "@/components/ui/StateError.vue";
import { useAuthStore, useUsersStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

const user = computed(() => authStore.user);
const mode = import.meta.env.VITE_MODE;

const loadUsers = () => {
  usersStore.getAll().catch(() => {
    /**the store already recorded the message in usersStore.error */
  });
};

onMounted(loadUsers);
</script>
