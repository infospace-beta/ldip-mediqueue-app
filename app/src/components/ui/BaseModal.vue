<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      @click.self="close()"
    >
      <div
        class="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-gray-900"
      >
        <header
          v-if="title || $slots.header"
          class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
        >
          <slot name="header">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
          </slot>
          <button aria-label="Close" class="px-2 text-xl" @click="close()">
            &times;
          </button>
        </header>

        <div class="p-5">
          <slot />
        </div>

        <footer
          v-if="$slots.footer"
          class="border-t border-gray-200 px-5 py-4 dark:border-gray-800"
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

/**Controlled with v-model: `<BaseModal v-model="isOpen">` */
defineProps<{ modelValue: boolean; title?: string }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const close = () => emit("update:modelValue", false);

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") close();
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>
