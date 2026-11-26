<script setup>
import { onMounted, ref } from "vue";
import {
  Bell,
  Check,
  Clock3,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "@lucide/vue";
import { mediqueueService } from "@/services/mediqueue.service";

const preferences = ref({
  queue: false,
  appointments: false,
  hospital: false,
  sms: false,
  email: false,
});

const isLoading = ref(true);
const isSaving = ref(false);
const saved = ref(false);
const errorMessage = ref("");

async function loadSettings() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const result =
      await mediqueueService.getPatientNotificationPreferences();

    preferences.value = {
      queue: result.queueUpdates,
      appointments: result.appointmentReminders,
      hospital: result.hospitalAnnouncements,
      sms: result.smsNotifications,
      email: result.emailNotifications,
    };
  } catch (error) {
    errorMessage.value =
      "Unable to load your notification preferences. Please refresh the page and try again.";
  } finally {
    isLoading.value = false;
  }
}

async function saveSettings() {
  isSaving.value = true;
  saved.value = false;
  errorMessage.value = "";

  try {
    const result =
      await mediqueueService.updatePatientNotificationPreferences({
        queueUpdates: preferences.value.queue,
        appointmentReminders: preferences.value.appointments,
        hospitalAnnouncements: preferences.value.hospital,
        smsNotifications: preferences.value.sms,
        emailNotifications: preferences.value.email,
      });

    preferences.value = {
      queue: result.queueUpdates,
      appointments: result.appointmentReminders,
      hospital: result.hospitalAnnouncements,
      sms: result.smsNotifications,
      email: result.emailNotifications,
    };

    saved.value = true;
  } catch (error) {
    errorMessage.value =
      "Unable to save your preferences. Please try again.";
  } finally {
    isSaving.value = false;
  }
}

onMounted(loadSettings);
</script>

<template>
  <div class="section-page settings-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">NOTIFICATION PREFERENCES</span>
        <h1>Settings</h1>
        <p>
          Choose which queue and visit updates you would want to receive.
          Your preferences are saved to your MediQueue account.
        </p>
      </div>
      <button class="button button-primary" type="button" @click="saveSettings" :disabled="isLoading || isSaving">
        <Check :size="16" aria-hidden="true" /> {{ isSaving ? "Saving..." : "Apply preferences" }}
      </button>
    </div>
    <output v-if="errorMessage" class="form-message service-notice" role="alert">
      {{ errorMessage }}
    </output>
    <output v-if="saved" class="form-message service-notice" role="status"
      >Your notification preferences have been saved to your account.</output
    >
    <section class="panel settings-panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">UPDATES & REMINDERS</span>
          <h2>Notification topics</h2>
        </div>
        <Bell :size="19" class="section-muted-icon" aria-hidden="true" />
      </div>
      <p class="panel-subtitle">
        Choose which updates you would like to receive when notification
        services are connected.
      </p>
      <label class="setting-row"
        ><span class="setting-row-icon"
          ><Clock3 :size="17" aria-hidden="true" /></span
        ><span
          ><strong>Queue updates</strong
          ><small>Position changes and when it is nearly your turn</small></span
        ><input
          v-model="preferences.queue"
          class="toggle-input"
          type="checkbox"
          aria-label="Queue updates" /></label
      ><label class="setting-row"
        ><span class="setting-row-icon setting-icon-blue"
          ><Bell :size="17" aria-hidden="true" /></span
        ><span
          ><strong>Appointment reminders</strong
          ><small>Upcoming visit reminders and changes</small></span
        ><input
          v-model="preferences.appointments"
          class="toggle-input"
          type="checkbox"
          aria-label="Appointment reminders" /></label
      ><label class="setting-row"
        ><span class="setting-row-icon setting-icon-amber"
          ><ShieldCheck :size="17" aria-hidden="true" /></span
        ><span
          ><strong>Hospital announcements</strong
          ><small>Important updates from your selected hospitals</small></span
        ><input
          v-model="preferences.hospital"
          class="toggle-input"
          type="checkbox"
          aria-label="Hospital announcements"
      /></label>
    </section>
    <section class="panel settings-panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">DELIVERY METHOD</span>
          <h2>Notification delivery</h2>
        </div>
        <Smartphone :size="19" class="section-muted-icon" aria-hidden="true" />
      </div>
      <p class="panel-subtitle">
        Choose your preferred delivery channels. Actual message delivery will be available when notification services are connected.
      </p>
      <label class="setting-row"
        ><span class="setting-row-icon setting-icon-blue"
          ><Smartphone :size="17" aria-hidden="true" /></span
        ><span
          ><strong>Text message</strong
          ><small>Send time-sensitive updates to your phone</small></span
        ><input
          v-model="preferences.sms"
          class="toggle-input"
          type="checkbox"
          aria-label="Text message notifications" /></label
      ><label class="setting-row"
        ><span class="setting-row-icon"
          ><Bell :size="17" aria-hidden="true" /></span
        ><span
          ><strong>Email</strong
          ><small>Send visit summaries and reminders by email</small></span
        ><input
          v-model="preferences.email"
          class="toggle-input"
          type="checkbox"
          aria-label="Email notifications"
      /></label>
    </section>
    <p class="settings-security">
      <LockKeyhole :size="16" aria-hidden="true" /><span
        >Your preferences are securely stored with your MediQueue account.</span
      >
    </p>
  </div>
</template>
