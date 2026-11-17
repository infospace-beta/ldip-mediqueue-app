<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Plus,
  RefreshCw,
  UsersRound,
} from "@lucide/vue";
import { clearPatientQueue, queue, setPatientQueue } from "../data/patient";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";
import StatusBadge from "./StatusBadge.vue";
import ConfirmationModal from "./ConfirmationModal.vue";

const router = useRouter();
const auth = useAuthStore();
const confirmOpen = ref(false);
const cancelledNotice = ref(false);
const isLoading = ref(false);
const isCancelling = ref(false);
const errorMessage = ref("");
const queueProgress = computed(() => `${queue.progress}%`);

async function refreshStatus() {
  const patientId = auth.user?.id;
  if (!patientId) {
    errorMessage.value = "Your patient account could not be identified.";
    return;
  }
  isLoading.value = true;
  errorMessage.value = "";
  try {
    if (queue.ticketId) {
      const ticket = await mediqueueService.getQueueTicket(queue.ticketId);
      setPatientQueue(ticket, queue.hospital, queue.hospitalId);
      return;
    }

    const tickets = await mediqueueService.getPatientVisits(patientId);
    const activeTicket = tickets.find(
      (ticket) => ticket.status === "WAITING" || ticket.status === "CALLED",
    );
    if (activeTicket) setPatientQueue(activeTicket);
    else clearPatientQueue();
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Unable to refresh queue status.";
  } finally {
    isLoading.value = false;
  }
}

async function leaveQueue() {
  if (!queue.ticketId) {
    errorMessage.value = "No active queue ticket is available to cancel.";
    return;
  }
  isCancelling.value = true;
  errorMessage.value = "";
  try {
    await mediqueueService.cancelQueueTicket(queue.ticketId);
    clearPatientQueue("CANCELLED");
    confirmOpen.value = false;
    cancelledNotice.value = true;
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Unable to cancel this queue ticket.";
  } finally {
    isCancelling.value = false;
  }
}

onMounted(() => void refreshStatus());
defineExpose({ refreshStatus });
</script>

<template>
  <section class="panel queue-card">
    <div class="panel-header queue-panel-header">
      <div>
        <span class="eyebrow">QUEUE STATUS</span>
        <h2>Current queue</h2>
      </div>
      <div class="queue-header-actions">
        <StatusBadge
          v-if="queue.active"
          :status="queue.status === 'WAITING' ? 'Waiting' : 'Called'"
        />
        <button
          class="button button-secondary button-small"
          type="button"
          :disabled="isLoading"
          @click="refreshStatus"
        >
          <RefreshCw :size="15" aria-hidden="true" />
          {{ isLoading ? "Refreshing…" : "Refresh" }}
        </button>
      </div>
    </div>
    <p v-if="errorMessage" class="form-message form-error" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="cancelledNotice" class="form-message service-notice" role="status">
      Your queue ticket was cancelled.
    </p>
    <p v-if="isLoading && !queue.active" class="supporting-copy" role="status">
      Loading your queue status…
    </p>
    <template v-else-if="queue.active">
      <div class="queue-hospital-row">
        <span class="hospital-emblem"
          ><Plus :size="22" :stroke-width="3"
        /></span>
        <div class="queue-hospital">
          <strong>{{ queue.hospital || "Hospital details unavailable" }}</strong>
          <span><MapPin :size="13" /> {{ queue.department }}</span>
        </div>
      </div>
      <div v-if="queue.ticketId || queue.position > 0" class="queue-number-band">
        <div v-if="queue.ticketId">
          <span class="data-label">TICKET</span>
          <strong class="queue-number">#{{ queue.ticketId }}</strong>
          <small v-if="queue.joinedAt">Joined {{ queue.joinedAt }}</small>
        </div>
        <div v-if="queue.position > 0" class="position-readout">
          <span class="data-label">POSITION</span>
          <strong>#{{ String(queue.position).padStart(2, "0") }}</strong>
          <small>in line</small>
        </div>
      </div>
      <div v-if="queue.ahead > 0 || queue.progress > 0" class="queue-progress-block">
        <div class="progress-label">
          <span><UsersRound :size="15" /> {{ queue.ahead }} patients ahead</span>
          <strong>{{ queueProgress }}</strong>
        </div>
        <progress
          class="progress-track"
          :value="queue.progress"
          max="100"
          aria-label="Queue progress"
        ></progress>
        <div class="progress-caption">
          <span>Queue started</span><span>Estimated progress</span>
        </div>
      </div>
      <p v-if="queue.wait > 0" class="wait-readout">
        <Clock3 :size="17" />
        <span><strong>~{{ queue.wait }} min</strong><small>Estimated wait</small></span>
      </p>
      <div v-if="queue.status === 'WAITING'" class="queue-bottom-row">
        <div class="queue-actions">
          <button
            class="button button-secondary button-small"
            type="button"
            :disabled="isCancelling"
            @click="confirmOpen = true"
          >
            {{ isCancelling ? "Cancelling…" : "Leave queue" }}
          </button>
        </div>
      </div>
    </template>
    <div v-else-if="!isLoading" class="empty-queue-state">
      <span class="empty-queue-icon"><Clock3 :size="23" /></span>
      <div class="empty-queue-copy">
        <strong>No active queue</strong>
        <p>No active queue ticket was returned for your account.</p>
      </div>
      <div class="empty-queue-actions">
        <button
          class="button button-primary"
          type="button"
          @click="router.push('/patient/join-queue')"
        >
          Join a queue <ArrowRight :size="16" aria-hidden="true" />
        </button>
      </div>
    </div>
    <ConfirmationModal
      :open="confirmOpen"
      title="Cancel this queue ticket?"
      message="This will cancel your active ticket in the hospital queue."
      confirm-label="Cancel ticket"
      cancel-label="Keep ticket"
      destructive
      @confirm="leaveQueue"
      @cancel="confirmOpen = false"
    />
  </section>
</template>
