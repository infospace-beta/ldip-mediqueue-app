<script setup>
import { ref } from 'vue'
import { Check, Edit3, Mail, Phone, ShieldCheck, UserRound } from '@lucide/vue'
import { patient } from '../data/patient'

const editing = ref(false)
const saved = ref(false)
const draft = ref({ ...patient })
function startEditing() {
  Object.assign(draft.value, patient)
  editing.value = true
}
function cancelEditing() {
  Object.assign(draft.value, patient)
  editing.value = false
}
function saveProfile() {
  Object.assign(patient, draft.value)
  editing.value = false
  saved.value = true
  window.setTimeout(() => { saved.value = false }, 3500)
}
</script>

<template>
  <div class="section-page profile-page"><div class="page-heading"><div><span class="eyebrow">YOUR INFORMATION</span><h1>My profile</h1><p>Review personal details available in this session.</p></div><button v-if="!editing" class="button button-primary" type="button" @click="startEditing"><Edit3 :size="16" aria-hidden="true" /> Edit profile</button><div v-else class="profile-edit-actions"><button class="button button-secondary" type="button" @click="cancelEditing">Cancel</button><button class="button button-primary" type="button" @click="saveProfile"><Check :size="16" aria-hidden="true" /> Save changes</button></div></div>
    <output v-if="saved" class="form-message service-notice" role="status"><Check :size="16" aria-hidden="true" /> Changes are held in this session only and have not been saved to an account.</output>
    <section class="panel profile-identity"><span class="avatar avatar-large">{{ patient.name ? patient.name.slice(0, 1).toUpperCase() : 'P' }}</span><div><span class="eyebrow">PATIENT ID Â· {{ patient.id || 'â€”' }}</span><h2>{{ patient.name || 'Patient' }}</h2><p><ShieldCheck :size="15" /> Patient profile</p></div><span class="identity-pill">{{ patient.id ? 'Active patient' : 'Awaiting details' }}</span></section>
    <form class="profile-form-grid" @submit.prevent="saveProfile">
      <section class="panel profile-fields-panel"><div class="panel-header"><div><span class="eyebrow">PERSONAL DETAILS</span><h2>About you</h2></div><UserRound :size="19" class="section-muted-icon" aria-hidden="true" /></div><div class="profile-fields"><label><span>Full name</span><input v-model="draft.name" :readonly="!editing" /></label><label><span>Patient ID</span><input :value="patient.id" readonly /></label><label><span>Date of birth</span><input v-model="draft.birthDate" type="date" :readonly="!editing" /></label><label><span>Gender</span><select v-model="draft.gender" :disabled="!editing"><option value="">Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label></div></section>
      <section class="panel profile-fields-panel"><div class="panel-header"><div><span class="eyebrow">HOW TO REACH YOU</span><h2>Contact details</h2></div><Phone :size="19" class="section-muted-icon" aria-hidden="true" /></div><div class="profile-fields"><label><span>Email address</span><span class="input-with-icon"><Mail :size="15" aria-hidden="true" /><input v-model="draft.email" type="email" :readonly="!editing" /></span></label><label><span>Phone number</span><span class="input-with-icon"><Phone :size="15" aria-hidden="true" /><input v-model="draft.phone" type="tel" :readonly="!editing" /></span></label><label class="field-wide"><span>Emergency contact</span><input v-model="draft.emergencyContact" :readonly="!editing" /></label></div></section>
    </form>
    <p class="profile-privacy"><ShieldCheck :size="15" aria-hidden="true" /> Profile details are stored only in this browser session and are not connected to an account.</p>
  </div>
</template>
