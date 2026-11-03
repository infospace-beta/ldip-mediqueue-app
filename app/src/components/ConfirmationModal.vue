<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { CircleAlert, Info } from "@lucide/vue";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
  }>(),
  {
    title: "Are you sure?",
    message: "Please confirm this action.",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    destructive: false,
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const id = useId();
const titleId = `confirmation-title-${id}`;
const messageId = `confirmation-message-${id}`;
const dialog = ref<HTMLElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
let previouslyFocusedElement: HTMLElement | null = null;

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previouslyFocusedElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      await nextTick();
      cancelButton.value?.focus();
    } else if (previouslyFocusedElement) {
      const elementToRestore = previouslyFocusedElement;
      previouslyFocusedElement = null;
      await nextTick();
      elementToRestore.focus();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => previouslyFocusedElement?.focus());

function onDialogKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("cancel");
    return;
  }

  if (event.key !== "Tab" || !dialog.value) return;

  const focusableElements = dialog.value.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  const first = focusableElements.item(0);
  const last = focusableElements.item(focusableElements.length - 1);

  if (
    event.shiftKey &&
    (document.activeElement === first ||
      !dialog.value.contains(document.activeElement))
  ) {
    event.preventDefault();
    last?.focus();
  } else if (
    !event.shiftKey &&
    (document.activeElement === last ||
      !dialog.value.contains(document.activeElement))
  ) {
    event.preventDefault();
    first?.focus();
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="confirmation">
      <div
        v-if="props.open"
        class="confirmation-backdrop fixed inset-0 z-[100] grid place-items-center bg-[#102f3b]/55 p-4 backdrop-blur-sm"
        @click.self="emit('cancel')"
      >
        <section
          ref="dialog"
          class="confirmation-dialog w-full max-w-md rounded-xl border border-[#dce9e7] bg-white p-6 text-[#102f3b] shadow-2xl"
          :role="props.destructive ? 'alertdialog' : 'dialog'"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="messageId"
          tabindex="-1"
          @keydown="onDialogKeydown"
        >
          <div
            class="mb-4 grid h-11 w-11 place-items-center rounded-full"
            :class="
              props.destructive
                ? 'bg-[#fce9e8] text-[#a3312c]'
                : 'bg-[#e3f3ee] text-[#087f6b]'
            "
            aria-hidden="true"
          >
            <CircleAlert v-if="props.destructive" :size="21" />
            <Info v-else :size="21" />
          </div>
          <h2 :id="titleId" class="text-xl font-semibold tracking-tight">
            {{ props.title }}
          </h2>
          <p :id="messageId" class="mt-3 leading-6 text-[#536c72]">
            {{ props.message }}
          </p>
          <div class="mt-7 flex flex-wrap justify-end gap-3">
            <button
              ref="cancelButton"
              type="button"
              class="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#b8d2cc] px-4 py-2 text-sm font-semibold text-[#102f3b] transition-colors hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
              @click="emit('cancel')"
            >
              {{ props.cancelLabel }}
            </button>
            <button
              type="button"
              class="inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
              :class="
                props.destructive
                  ? 'bg-[#a3312c] hover:bg-[#842823]'
                  : 'bg-[#087f6b] hover:bg-[#066c5c]'
              "
              @click="emit('confirm')"
            >
              {{ props.confirmLabel }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirmation-enter-active,
.confirmation-leave-active {
  transition:
    opacity 160ms ease,
    backdrop-filter 160ms ease;
}

.confirmation-dialog {
  transition: transform 160ms ease;
}

.confirmation-enter-from,
.confirmation-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}

.confirmation-enter-from .confirmation-dialog,
.confirmation-leave-to .confirmation-dialog {
  transform: translateY(6px) scale(0.99);
}

@media (prefers-reduced-motion: reduce) {
  .confirmation-enter-active,
  .confirmation-leave-active,
  .confirmation-dialog {
    transition: none;
  }
}
</style>
