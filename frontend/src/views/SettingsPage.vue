<script setup>
import { ref } from 'vue'
import { Bell, Check, Clock3, LockKeyhole, ShieldCheck, Smartphone } from '@lucide/vue'

const preferences = ref({ queue: false, appointments: false, hospital: false, sms: false, email: false })
const saved = ref(false)
function saveSettings() {
  saved.value = true
  window.setTimeout(() => { saved.value = false }, 3500)
}
</script>

<template>
  <div class="section-page"><div class="page-heading"><div><span class="eyebrow">MAKE IT YOURS</span><h1>Settings</h1><p>Choose how MediQueue keeps you informed.</p></div><button class="button button-primary" type="button" @click="saveSettings"><Check :size="16" /> Save preferences</button></div>
    <output v-if="saved" class="form-message form-success">Your notification preferences have been saved.</output>
    <section class="panel settings-panel"><div class="panel-header"><div><span class="eyebrow">UPDATES & REMINDERS</span><h2>Notifications</h2></div><Bell :size="19" class="section-muted-icon" /></div><p class="panel-subtitle">Select the updates you’d like to receive.</p><label class="setting-row"><span class="setting-row-icon"><Clock3 :size="17" /></span><span><strong>Queue updates</strong><small>Position changes and when it’s nearly your turn</small></span><input v-model="preferences.queue" class="toggle-input" type="checkbox" aria-label="Queue updates" /></label><label class="setting-row"><span class="setting-row-icon setting-icon-blue"><Bell :size="17" /></span><span><strong>Appointment reminders</strong><small>Upcoming visit reminders and changes</small></span><input v-model="preferences.appointments" class="toggle-input" type="checkbox" aria-label="Appointment reminders" /></label><label class="setting-row"><span class="setting-row-icon setting-icon-amber"><ShieldCheck :size="17" /></span><span><strong>Hospital announcements</strong><small>Important updates from your selected hospitals</small></span><input v-model="preferences.hospital" class="toggle-input" type="checkbox" aria-label="Hospital announcements" /></label></section>
    <section class="panel settings-panel"><div class="panel-header"><div><span class="eyebrow">DELIVERY METHOD</span><h2>Where to reach you</h2></div><Smartphone :size="19" class="section-muted-icon" /></div><label class="setting-row"><span class="setting-row-icon setting-icon-blue"><Smartphone :size="17" /></span><span><strong>Text message</strong><small>Send time-sensitive updates to your phone</small></span><input v-model="preferences.sms" class="toggle-input" type="checkbox" aria-label="Text message notifications" /></label><label class="setting-row"><span class="setting-row-icon"><Bell :size="17" /></span><span><strong>Email</strong><small>Send visit summaries and reminders by email</small></span><input v-model="preferences.email" class="toggle-input" type="checkbox" aria-label="Email notifications" /></label></section>
    <section class="settings-security"><LockKeyhole :size="16" /><span>Notification preferences are ready to connect to your account settings.</span></section>
  </div>
</template>

