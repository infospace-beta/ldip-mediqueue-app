<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Clock3, MapPin, Plus, UsersRound } from '@lucide/vue'
import { queue } from '../data/patient'
import StatusBadge from './StatusBadge.vue'
import ConfirmationModal from './ConfirmationModal.vue'

const router = useRouter()
const confirmOpen = ref(false)
const queueProgress = computed(() => `${queue.progress}%`)
function leaveQueue() {
  queue.active = false
  queue.status = 'Left queue'
  confirmOpen.value = false
}
</script>

<template>
  <section class="panel queue-card">
    <div class="panel-header queue-panel-header">
      <div><span class="eyebrow">QUEUE STATUS</span><h2>Current queue</h2></div>
      <StatusBadge v-if="queue.active" :status="queue.status" />
    </div>
    <template v-if="queue.active">
      <div class="queue-hospital-row">
        <span class="hospital-emblem"><Plus :size="22" :stroke-width="3" /></span>
        <div class="queue-hospital"><strong>{{ queue.hospital }}</strong><span><MapPin :size="13" /> {{ queue.department }} Â· {{ queue.service }}</span></div>
      </div>
      <div v-if="queue.number > 0 || queue.position > 0" class="queue-number-band">
        <div v-if="queue.number > 0"><span class="data-label">YOUR NUMBER</span><strong class="queue-number">{{ queue.number }}</strong><small v-if="queue.joinedAt">Joined {{ queue.joinedAt }}</small></div>
        <div v-if="queue.position > 0" class="position-readout"><span class="data-label">POSITION</span><strong>#{{ String(queue.position).padStart(2, '0') }}</strong><small>in line</small></div>
      </div>
      <div v-if="queue.ahead > 0 || queue.progress > 0" class="queue-progress-block">
        <div class="progress-label"><span><UsersRound :size="15" /> {{ queue.ahead }} patients ahead</span><strong>{{ queueProgress }}</strong></div>
        <progress class="progress-track" :value="queue.progress" max="100" aria-label="Queue progress"></progress>
        <div class="progress-caption"><span>Queue started</span><span>You're getting closer</span></div>
      </div>
      <div class="queue-bottom-row">
        <div v-if="queue.wait > 0" class="wait-readout"><Clock3 :size="17" /><span><strong>~{{ queue.wait }} min</strong><small>Estimated wait</small></span></div>
        <div class="queue-actions"><button class="button button-secondary button-small" type="button" @click="confirmOpen = true">Leave queue</button></div>
      </div>
    </template>
    <div v-else class="empty-queue-state">
      <span class="empty-queue-icon"><Clock3 :size="23" /></span>
      <div class="empty-queue-copy">
        <strong>No active queue</strong>
        <p>Join a queue to prepare a request. Queue number and wait details will appear when a hospital service is connected.</p>
      </div>
      <div class="empty-queue-actions">
        <button class="button button-primary" type="button" @click="router.push('/patient/join-queue')">Join a queue <ArrowRight :size="16" /></button>
      </div>
    </div>
    <ConfirmationModal :open="confirmOpen" title="Leave this queue?" message="Your place in line will be released. You'll need to join again if you still need care." confirm-label="Leave queue" destructive @confirm="leaveQueue" @cancel="confirmOpen = false" />
  </section>
</template>
