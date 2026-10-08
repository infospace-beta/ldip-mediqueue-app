<template>
  <div class="page">
    <header>
      <h1 class="text-2xl font-semibold tracking-tight">API test</h1>
      <p class="mt-1 text-sm muted">
        Calls the guarded /users endpoint so the interceptors, token header and
        error handling can be exercised by hand.
      </p>
    </header>

    <BaseCard class="mt-8">
      <div class="flex flex-wrap items-center gap-3">
        <BaseButton :loading="usersStore.isLoading" @click="loadData()">
          Send request
        </BaseButton>
        <BaseBadge v-if="usersStore.error" tone="danger">failed</BaseBadge>
        <BaseBadge v-else-if="usersStore.users.length" tone="success">
          {{ usersStore.users.length }} users
        </BaseBadge>
      </div>

      <StateError
        v-if="usersStore.error"
        class="mt-5"
        :message="usersStore.error"
        :on-retry="loadData"
      />
      <pre
        v-else-if="usersStore.users.length"
        class="mt-5 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100"
        >{{ JSON.stringify(usersStore.users, null, 2) }}</pre>
      <p v-else class="mt-5 text-sm muted">Nothing requested yet.</p>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import StateError from "@/components/ui/StateError.vue";
import { useUsersStore } from "@/stores";

const usersStore = useUsersStore();

const loadData = async () => {
  try {
    await usersStore.getAll();
  } catch {
    /**the store already recorded the message in usersStore.error */
  }
};
</script>
