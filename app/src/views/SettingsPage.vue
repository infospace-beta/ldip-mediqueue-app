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
  <div class="section-page settings-page"><div class="page-heading"><div><span class="eyebrow">MAKE IT YOURS</span><h1>Settings</h1><p>Choose notification preferences for this session.</p></div><button class="button button-primary" type="button" @click="saveSettings"><Check :size="16" aria-hidden="true" /> Apply preferences</button></div>
    <output v-if="saved" class="form-message service-notice" role="status">Preferences are applied in this session only and have not been saved to an account.</output>
    <section class="panel settings-panel"><div class="panel-header"><div><span class="eyebrow">UPDATES & REMINDERS</span><h2>Notification topics</h2></div><Bell :size="19" class="section-muted-icon" aria-hidden="true" /></div><p class="panel-subtitle">Choose which updates you would like to receive when notification services are connected.</p><label class="setting-row"><span class="setting-row-icon"><Clock3 :size="17" aria-hidden="true" /></span><span><strong>Queue updates</strong><small>Position changes and when it is nearly your turn</small></span><input v-model="preferences.queue" class="toggle-input" type="checkbox" aria-label="Queue updates" /></label><label class="setting-row"><span class="setting-row-icon setting-icon-blue"><Bell :size="17" aria-hidden="true" /></span><span><strong>Appointment reminders</strong><small>Upcoming visit reminders and changes</small></span><input v-model="preferences.appointments" class="toggle-input" type="checkbox" aria-label="Appointment reminders" /></label><label class="setting-row"><span class="setting-row-icon setting-icon-amber"><ShieldCheck :size="17" aria-hidden="true" /></span><span><strong>Hospital announcements</strong><small>Important updates from your selected hospitals</small></span><input v-model="preferences.hospital" class="toggle-input" type="checkbox" aria-label="Hospital announcements" /></label></section>
    <section class="panel settings-panel"><div class="panel-header"><div><span class="eyebrow">DELIVERY METHOD</span><h2>Notification delivery</h2></div><Smartphone :size="19" class="section-muted-icon" aria-hidden="true" /></div><p class="panel-subtitle">Delivery options are not connected to a notification service.</p><label class="setting-row"><span class="setting-row-icon setting-icon-blue"><Smartphone :size="17" aria-hidden="true" /></span><span><strong>Text message</strong><small>Send time-sensitive updates to your phone</small></span><input v-model="preferences.sms" class="toggle-input" type="checkbox" aria-label="Text message notifications" /></label><label class="setting-row"><span class="setting-row-icon"><Bell :size="17" aria-hidden="true" /></span><span><strong>Email</strong><small>Send visit summaries and reminders by email</small></span><input v-model="preferences.email" class="toggle-input" type="checkbox" aria-label="Email notifications" /></label></section>
    <p class="settings-security"><LockKeyhole :size="16" aria-hidden="true" /><span>Preferences are held in memory and will reset when this page is reloaded.</span></p>
  </div>
</template>


