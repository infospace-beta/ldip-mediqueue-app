<script setup lang="ts">
import { Monitor, Moon, Sun } from "@lucide/vue";
import { useTheme, type ThemePreference } from "@/composables/useTheme";

const { preference, setTheme } = useTheme();

const options: {
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];
</script>

<template>
  <div class="theme-switcher" role="group" aria-label="Theme preference">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="theme-switcher-button"
      :aria-label="`${option.label} theme`"
      :aria-pressed="preference === option.value"
      @click="setTheme(option.value)"
    >
      <component :is="option.icon" :size="16" aria-hidden="true" />
      <span class="theme-switcher-label">{{ option.label }}</span>
    </button>
  </div>
</template>
