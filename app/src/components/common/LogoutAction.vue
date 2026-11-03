<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";
import { useAuthStore } from "@/stores/auth.store";

const props = withDefaults(defineProps<{ buttonClass?: string }>(), {
  buttonClass: "",
});
const emit = defineEmits<{ logout: [] }>();

const auth = useAuthStore();
const router = useRouter();
const isConfirming = ref(false);

async function logout() {
  isConfirming.value = false;
  auth.logout();
  emit("logout");
  await router.push({ name: ROUTE_NAMES.landing });
}
</script>

<template>
  <button type="button" :class="props.buttonClass" @click="isConfirming = true">
    <slot>Log out</slot>
  </button>
  <ConfirmationModal
    :open="isConfirming"
    title="Log out of MediQueue?"
    message="Logging out ends this session and clears session-only patient and workspace details from this browser."
    confirm-label="Log out"
    cancel-label="Stay signed in"
    @confirm="logout"
    @cancel="isConfirming = false"
  />
</template>
