<template>
  <div
    class="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 py-12 text-center dark:border-red-900/50 dark:bg-red-950/30"
    role="alert"
  >
    <p class="font-medium text-red-700 dark:text-red-300">{{ title }}</p>
    <p class="max-w-md text-sm text-red-700/80 dark:text-red-300/80">
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
