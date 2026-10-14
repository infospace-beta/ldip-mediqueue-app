```vue
<template>
  <span class="inline-flex items-center gap-2">
    <img
      src="/mediqueue-logo.png"
      alt=""
      :class="['w-auto object-contain', SIZES[size]]"
      width="200"
      height="200"
      decoding="async"
    />

    <span
      v-if="withWordmark"
      :class="['font-bold tracking-tight text-[#102f3b]', TEXT[size]]"
    >
      {{ name }}
    </span>
  </span>
</template>

<script setup lang="ts">
type LogoSize = "sm" | "md" | "lg";

withDefaults(
  defineProps<{
    name?: string;
    size?: LogoSize;
    withWordmark?: boolean;
  }>(),
  {
    name: "MediQueue",
    size: "md",
    withWordmark: true,
  },
);

const SIZES: Record<LogoSize, string> = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
};

const TEXT: Record<LogoSize, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
};
</script>
```