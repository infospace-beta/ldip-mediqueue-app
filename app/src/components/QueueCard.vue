<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, CheckCircle2, Clock3, MapPin, Plus, UsersRound } from '@lucide/vue'
import { queue, updateQueuePosition } from '../data/patient'
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
      <div><span class="eyebrow">LIVE QUEUE</span><h2>My queue</h2></div>
      <StatusBadge :status="queue.status" />
    </div>
    <template v-if="queue.active">
      <div class="queue-hospital-row">
        <span class="hospital-emblem"><Plus :size="22" :stroke-width="3" /></span>
        <div class="queue-hospital"><strong>{{ queue.hospital }}</strong><span><MapPin :size="13" /> {{ queue.department }} Â· {{ queue.service }}</span></div>
        <button class="icon-button refresh-queue" type="button" aria-label="Update queue position" title="Update queue position" @click="updateQueuePosition"><ArrowRight :size="17" /></button>
      </div>
      <div class="queue-number-band">
        <div><span class="data-label">YOUR NUMBER</span><strong class="queue-number">{{ queue.number }}</strong><small>Joined {{ queue.joinedAt }}</small></div>
        <div class="position-readout"><span class="data-label">POSITION</span><strong>#{{ String(queue.position).padStart(2, '0') }}</strong><small>in line</small></div>
      </div>
      <div class="queue-progress-block">
        <div class="progress-label"><span><UsersRound :size="15" /> {{ queue.ahead }} patients ahead</span><strong>{{ queueProgress }}</strong></div>
        <progress class="progress-track" :value="queue.progress" max="100" aria-label="Queue progress"></progress>
        <div class="progress-caption"><span>Queue started</span><span>You're getting closer</span></div>
      </div>
      <div class="queue-bottom-row">
        <div class="wait-readout"><Clock3 :size="17" /><span><strong>~{{ queue.wait }} min</strong><small>Estimated wait</small></span></div>
        <div class="queue-actions"><button class="button button-secondary button-small" type="button" @click="confirmOpen = true">Leave queue</button><button class="button button-primary button-small" type="button" @click="router.push('/patient/queue')">View queue <ArrowRight :size="15" /></button></div>
      </div>
    </template>
    <div v-else class="empty-queue-state">
      <span class="empty-queue-icon"><CheckCircle2 :size="24" /></span><strong>No active queue</strong>
      <div class="zero-queue-values"><span>Queue Number <strong>0</strong></span><span>Current Position <strong>0</strong></span><span>Patients Ahead <strong>0</strong></span><span>Estimated Wait <strong>0 minutes</strong></span></div>
      <StatusBadge status="Waiting" />
      <div class="empty-queue-actions"><button class="button button-primary" type="button" @click="router.push('/patient/join-queue')">Join Queue <ArrowRight :size="16" /></button><button class="button button-secondary" type="button" @click="router.push('/patient/queue')">View Queue</button></div>
    </div>
    <ConfirmationModal :open="confirmOpen" title="Leave this queue?" message="Your place in line will be released. You'll need to join again if you still need care." confirm-label="Leave queue" destructive @confirm="leaveQueue" @cancel="confirmOpen = false" />
  </section>
</template>

