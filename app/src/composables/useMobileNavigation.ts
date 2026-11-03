import { nextTick, onMounted, onUnmounted, ref } from "vue";

interface MobileNavigationOptions {
  breakpoint: number;
  trigger: string;
  firstNavigationItem: string;
}

export function useMobileNavigation({
  breakpoint,
  trigger: triggerSelector,
  firstNavigationItem,
}: MobileNavigationOptions) {
  const isOpen = ref(false);
  const isMobile = ref(
    typeof window !== "undefined" && window.innerWidth <= breakpoint,
  );
  const root = ref<HTMLElement | null>(null);

  function updateViewport() {
    isMobile.value = window.innerWidth <= breakpoint;
    if (!isMobile.value) isOpen.value = false;
  }

  async function open() {
    if (!isMobile.value) return;
    isOpen.value = true;
    await nextTick();
    root.value
      ?.querySelector<HTMLElement>(firstNavigationItem)
      ?.focus();
  }

  async function close() {
    const shouldRestoreFocus = isOpen.value && isMobile.value;
    isOpen.value = false;
    await nextTick();
    if (shouldRestoreFocus) {
      root.value?.querySelector<HTMLElement>(triggerSelector)?.focus();
    }
  }

  function toggle() {
    return isOpen.value ? close() : open();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && isOpen.value) void close();
  }

  onMounted(() => {
    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateViewport);
    window.removeEventListener("keydown", handleKeydown);
  });

  return {
    isMobile,
    isOpen,
    root,
    toggle,
    close,
    sidebarInert: () => isMobile.value && !isOpen.value,
  };
}
