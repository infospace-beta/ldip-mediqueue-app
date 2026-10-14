<script setup>
import { ArrowLeft, Clock3, RefreshCw, ShieldCheck } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { updateQueuePosition } from '../data/patient'
import QueueCard from '../components/QueueCard.vue'

const router = useRouter()
</script>

<template>
  <div class="section-page"><div class="page-heading"><div><span class="eyebrow">REAL-TIME CARE</span><h1>My queue</h1><p>Queue values stay at zero until queue data is connected.</p></div><button class="button button-secondary" type="button" @click="updateQueuePosition"><RefreshCw :size="16" /> Refresh status</button></div>
    <div class="queue-page-grid"><div><QueueCard /><div class="queue-details-grid"><section class="panel queue-detail-card"><span class="detail-icon"><Clock3 :size="18" /></span><span class="eyebrow">ESTIMATED WAIT</span><strong>0 minutes</strong><p>Estimated wait will appear when live queue information is available.</p></section><section class="panel queue-detail-card"><span class="detail-icon detail-icon-green"><ShieldCheck :size="18" /></span><span class="eyebrow">QUEUE STATUS</span><strong>No active queue</strong><p>Queue type and visit details are not set.</p></section></div></div><aside class="panel queue-guidance"><span class="eyebrow">MY QUEUE</span><h2>Queue summary</h2><p>No queue information is available yet.</p><div class="guidance-line"><span class="guidance-step">1</span><span><strong>Queue number</strong><small>0</small></span></div><div class="guidance-line"><span class="guidance-step">2</span><span><strong>Current position</strong><small>0 · 0 patients ahead</small></span></div><div class="guidance-line"><span class="guidance-step">3</span><span><strong>Estimated wait</strong><small>0 minutes</small></span></div><button class="button button-primary guidance-cta" type="button" @click="router.push('/patient/join-queue')">Join Queue <ArrowLeft :size="15" /></button></aside></div>
  </div>
</template>