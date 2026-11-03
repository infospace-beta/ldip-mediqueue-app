<template>
  <div
    class="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--app-error)] bg-[var(--app-error-surface)] py-12 text-center"
    role="alert"
  >
    <p class="font-medium text-[var(--app-error)]">{{ title }}</p>
    <p class="max-w-md text-sm text-[var(--app-error)]">
      {{ message }}
    </p>
    <BaseButton v-if="onRetry" variant="ghost" size="sm" @click="onRetry">
      Try again
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";

/**Pass a loader as `onRetry` to offer a retry; omit it for a terminal error */
withDefaults(
  defineProps<{
    title?: string;
    message: string;
    onRetry?: () => void;
  }>(),
  { title: "That did not work" },
);
</script>
