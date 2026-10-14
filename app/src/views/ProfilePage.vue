<script setup>
import { ref } from 'vue'
import { Check, Edit3, Mail, Phone, ShieldCheck, UserRound } from '@lucide/vue'
import { patient } from '../data/patient'

const editing = ref(false)
const saved = ref(false)
function saveProfile() {
  editing.value = false
  saved.value = true
  window.setTimeout(() => { saved.value = false }, 3500)
}
</script>

<template>
  <div class="section-page"><div class="page-heading"><div><span class="eyebrow">YOUR INFORMATION</span><h1>My profile</h1><p>Keep your contact and personal details up to date.</p></div><button v-if="!editing" class="button button-primary" type="button" @click="editing = true"><Edit3 :size="16" /> Edit profile</button><div v-else class="profile-edit-actions"><button class="button button-secondary" type="button" @click="editing = false">Cancel</button><button class="button button-primary" type="button" @click="saveProfile"><Check :size="16" /> Save changes</button></div></div>
    <output v-if="saved" class="form-message form-success"><Check :size="16" /> Your profile has been updated.</output>
    <section class="panel profile-identity"><span class="avatar avatar-large">{{ patient.name ? patient.name.slice(0, 1).toUpperCase() : 'P' }}</span><div><span class="eyebrow">PATIENT ID Â· {{ patient.id || 'â€”' }}</span><h2>{{ patient.name || 'Patient' }}</h2><p><ShieldCheck :size="15" /> Patient profile</p></div><span class="identity-pill">{{ patient.id ? 'Active patient' : 'Awaiting details' }}</span></section>
    <form class="profile-form-grid" @submit.prevent="saveProfile">
      <section class="panel profile-fields-panel"><div class="panel-header"><div><span class="eyebrow">PERSONAL DETAILS</span><h2>About you</h2></div><UserRound :size="19" class="section-muted-icon" /></div><div class="profile-fields"><label><span>Full name</span><input v-model="patient.name" :readonly="!editing" /></label><label><span>Patient ID</span><input :value="patient.id" readonly /></label><label><span>Date of birth</span><input v-model="patient.birthDate" type="date" :readonly="!editing" /></label><label><span>Gender</span><select v-model="patient.gender" :disabled="!editing"><option value="">Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label></div></section>
      <section class="panel profile-fields-panel"><div class="panel-header"><div><span class="eyebrow">HOW TO REACH YOU</span><h2>Contact details</h2></div><Phone :size="19" class="section-muted-icon" /></div><div class="profile-fields"><label><span>Email address</span><span class="input-with-icon"><Mail :size="15" /><input v-model="patient.email" type="email" :readonly="!editing" /></span></label><label><span>Phone number</span><span class="input-with-icon"><Phone :size="15" /><input v-model="patient.phone" type="tel" :readonly="!editing" /></span></label><label class="field-wide"><span>Emergency contact</span><input v-model="patient.emergencyContact" :readonly="!editing" /></label></div></section>
    </form>
    <p class="profile-privacy"><ShieldCheck :size="15" /> Profile fields are blank until patient data is connected.</p>
  </div>
</template>

