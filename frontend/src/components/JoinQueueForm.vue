<script setup>
import { computed, ref } from 'vue'
import { Check, ChevronDown, Clock3, MapPin, Search, ShieldPlus } from '@lucide/vue'
import LoadingSpinner from './LoadingSpinner.vue'

const hospital = ref('')
const department = ref('')
const service = ref('')
const visitType = ref('')
const queueType = ref('Normal')
const loading = ref(false)
const submitted = ref(false)
const formError = ref('')
const services = computed(() => {
  if (!department.value) return []
  return department.value === 'Emergency' ? ['Emergency assessment', 'Urgent care'] : ['Consultation', 'Follow-up', 'Screening']
})

function submitQueue() {
  if (!hospital.value.trim() || !department.value || !service.value || !visitType.value) {
    formError.value = 'Enter a hospital and select a department, service, and visit type.'
    return
  }

  formError.value = ''
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    submitted.value = true
  }, 450)
}
</script>

<template>
  <div class="join-layout">
    <section class="panel join-form-panel">
      <div class="panel-header"><div><span class="eyebrow">START YOUR VISIT</span><h2>Join a hospital queue</h2><p class="panel-subtitle">Choose your visit details. Live hospital availability will load when connected.</p></div><span class="step-count">01 <span>/ 01</span></span></div>
      <form class="join-form" @submit.prevent="submitQueue">
        <label class="field-label" for="hospital-search">Hospital</label>
        <div class="hospital-search-wrap"><Search :size="17" /><input id="hospital-search" v-model="hospital" placeholder="Enter hospital name" autocomplete="off" /><MapPin :size="16" class="search-locate" /></div>
        <p class="form-helper">No hospital directory connected yet. Enter a hospital name to prepare your request.</p>
        <div class="field-grid">
          <label><span class="field-label">Department</span><span class="select-wrap"><select v-model="department" @change="service = ''"><option value="">Select department</option><option>Emergency</option><option>General practice</option><option>Cardiology</option><option>Pediatrics</option><option>Women's health</option></select><ChevronDown :size="16" /></span></label>
          <label><span class="field-label">Service</span><span class="select-wrap"><select v-model="service" :disabled="!department"><option value="">Select service</option><option v-for="option in services" :key="option" :value="option">{{ option }}</option></select><ChevronDown :size="16" /></span></label>
          <label><span class="field-label">Visit type</span><span class="select-wrap"><select v-model="visitType"><option value="">Select visit type</option><option>Walk-in</option><option>Follow-up</option><option>Referral</option></select><ChevronDown :size="16" /></span></label>
        </div>
        <fieldset class="urgency-field"><legend class="field-label">Queue type</legend><div class="urgency-options"><button type="button" class="urgency-option" :class="{ selected: queueType === 'Normal' }" :aria-pressed="queueType === 'Normal'" @click="queueType = 'Normal'"><span class="urgency-symbol"><Check :size="15" /></span><span><strong>Normal</strong><small>Standard queue</small></span></button><button type="button" class="urgency-option urgency-emergency" :class="{ selected: queueType === 'Emergency' }" :aria-pressed="queueType === 'Emergency'" @click="queueType = 'Emergency'"><span class="urgency-symbol"><ShieldPlus :size="15" /></span><span><strong>Emergency</strong><small>Urgent attention</small></span></button></div></fieldset>
        <p v-if="formError" class="form-message form-error" role="alert">{{ formError }}</p>
        <output v-if="submitted" class="form-message form-success">Request prepared. Queue details will appear after connecting to the hospital service.</output>
        <button class="button button-primary button-join" type="submit" :disabled="loading"><LoadingSpinner v-if="loading" /><span v-else>Join Queue</span><ChevronDown v-if="!loading" class="button-arrow" :size="17" /></button>
        <p class="form-note"><ShieldPlus :size="15" /> If this is a life-threatening emergency, contact local emergency services.</p>
      </form>
    </section>
    <aside class="join-side-column">
      <section class="panel care-info-panel"><span class="care-info-icon"><Clock3 :size="20" /></span><span class="eyebrow">QUEUE OVERVIEW</span><h3>Queue details</h3><p>No live queue data is connected. Your request will remain a prototype until a hospital service is available.</p><div class="info-rule"></div><div class="care-info-row"><span>Queue number</span><strong>0</strong></div><div class="care-info-row"><span>Estimated wait</span><strong>0 min</strong></div></section>
      <section class="panel nearby-tip"><MapPin :size="17" /><span>Hospital selection will connect to the live directory when the backend is ready.</span></section>
    </aside>
  </div>
</template>