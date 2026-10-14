<script setup>
import { computed, ref } from 'vue'
import { ArrowRight, HeartPulse, ShieldCheck, Siren } from '@lucide/vue'
import { emergencyRequests } from '../data/patient'
import StatusBadge from '../components/StatusBadge.vue'

const requestPrepared = ref(false)
const requestCount = computed(() => emergencyRequests.length)
function prepareRequest() {
  requestPrepared.value = true
}
</script>

<template>
  <div class="section-page">
    <div class="page-heading"><div><span class="eyebrow">URGENT CARE</span><h1>Emergency Assistance</h1><p>Emergency Requests: {{ requestCount }}</p></div><StatusBadge status="Waiting" /></div>
    <section class="emergency-banner"><span class="emergency-banner-icon"><HeartPulse :size="25" /></span><div><span class="eyebrow">EMERGENCY STATUS</span><h2>No active request</h2><p>Your emergency request status will appear here when connected.</p></div><StatusBadge status="Waiting" /></section>
    <div class="emergency-content-grid">
      <section class="panel emergency-contact-panel"><div class="panel-header"><div><span class="eyebrow">EMERGENCY ASSISTANCE</span><h2>Request help</h2></div><span class="contact-shield"><ShieldCheck :size="19" /></span></div><p class="panel-subtitle">This prototype does not contact emergency services. Connect the emergency API before using this feature for care.</p><button class="emergency-call-button" type="button" @click="prepareRequest"><span><Siren :size="20" /></span><span><strong>Request Emergency Assistance</strong><small>Emergency requests: {{ requestCount }}</small></span><ArrowRight :size="17" /></button><output v-if="requestPrepared" class="form-message form-success">Emergency request control is ready. No request has been sent.</output><p class="emergency-disclaimer"><Siren :size="15" /> If you are in immediate danger, contact local emergency services directly.</p></section>
      <section class="panel emergency-location-panel"><span class="eyebrow">REQUEST SUMMARY</span><h2>Emergency status</h2><p><ShieldCheck :size="15" /> No active request</p><div class="emergency-summary-list"><div><span>Emergency Requests</span><strong>{{ requestCount }}</strong></div><div><span>Request status</span><StatusBadge status="Waiting" /></div><div><span>Hospital</span><strong>—</strong></div><div><span>Department</span><strong>—</strong></div></div><RouterLink class="button button-secondary button-full" to="/patient/join-queue">Join a queue <ArrowRight :size="16" /></RouterLink></section>
    </div>
    <section class="panel emergency-status-panel"><div class="status-pulse"><span></span><span></span><ShieldCheck :size="19" /></div><div><strong>No active emergency request</strong><p>Request status will update when the emergency service is connected.</p></div><StatusBadge status="Waiting" /></section>
  </div>
</template>