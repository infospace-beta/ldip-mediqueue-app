<script setup>
import { onMounted, ref } from "vue";
import {
  ArrowRight,
  HeartPulse,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Siren,
} from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";

const auth = useAuthStore();
const hospitals = ref([]);
const cases = ref([]);
const hospitalId = ref(null);
const title = ref("");
const description = ref("");
const severity = ref("MEDIUM");
const isLoading = ref(true);
const isSubmitting = ref(false);
const errorMessage = ref("");
const notice = ref("");
const hospitalDirectoryFailed = ref(false);

async function loadEmergencyInformation() {
  const patientId = auth.user?.id;
  if (!patientId) {
    errorMessage.value = "Your patient account could not be identified.";
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  errorMessage.value = "";
  const [hospitalResult, caseResult] = await Promise.allSettled([
    mediqueueService.getHospitals(),
    mediqueueService.getPatientEmergencyCases(patientId),
  ]);
  hospitalDirectoryFailed.value = hospitalResult.status === "rejected";
  if (hospitalResult.status === "fulfilled") {
    hospitals.value = hospitalResult.value;
  } else {
    hospitals.value = [];
  }
  if (caseResult.status === "fulfilled") {
    cases.value = caseResult.value;
  }
  const errors = [];
  if (hospitalResult.status === "rejected") errors.push("hospital directory");
  if (caseResult.status === "rejected") errors.push("emergency history");
  if (errors.length) errorMessage.value = `Unable to load ${errors.join(" and ")}.`;
  isLoading.value = false;
}

async function reportEmergency() {
  errorMessage.value = "";
  notice.value = "";
  if (!hospitalId.value || !title.value.trim() || !description.value.trim()) {
    errorMessage.value = "Select a hospital and enter a title and description.";
    return;
  }
  isSubmitting.value = true;
  try {
    const created = await mediqueueService.reportEmergency(hospitalId.value, {
      title: title.value.trim(),
      description: description.value.trim(),
      severity: severity.value,
    });
    notice.value = `Emergency case #${created.id} was reported to the selected hospital.`;
    title.value = "";
    description.value = "";
    await loadEmergencyInformation();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unable to report this case.";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => void loadEmergencyInformation());
</script>

<template>
  <div class="section-page emergency-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">EMERGENCY INFORMATION</span>
        <h1>Emergency assistance</h1>
        <p>Report an emergency case to a MediQueue hospital team.</p>
      </div>
    </div>

    <section class="emergency-alert" aria-labelledby="emergency-alert-heading">
      <span class="emergency-alert-icon"><ShieldAlert :size="23" aria-hidden="true" /></span>
      <div>
        <h2 id="emergency-alert-heading">Need immediate help?</h2>
        <p>
          If you may be in immediate danger or need urgent medical care, contact
          your local emergency services directly. MediQueue is not an emergency
          dispatch service.
        </p>
      </div>
    </section>

    <p v-if="errorMessage" class="form-message form-error" role="alert">
      {{ errorMessage }}
      <button class="text-link" type="button" @click="loadEmergencyInformation">
        Retry
      </button>
    </p>
    <p
      v-if="!isLoading && !hospitalDirectoryFailed && hospitals.length === 0"
      class="form-message directory-empty"
      role="status"
    >
      No active hospitals are currently available for emergency reports.
    </p>
    <output v-if="notice" class="form-message service-notice" role="status">
      {{ notice }}
    </output>

    <div class="emergency-content-grid">
      <section class="panel emergency-contact-panel" aria-labelledby="emergency-service-heading">
        <div class="panel-header">
          <div>
            <span class="eyebrow">HOSPITAL CASE REPORT</span>
            <h2 id="emergency-service-heading">Report an emergency</h2>
          </div>
          <span class="contact-shield"><HeartPulse :size="20" aria-hidden="true" /></span>
        </div>
        <form
          class="emergency-report-form patient-form-grid"
          @submit.prevent="reportEmergency"
        >
          <label class="patient-form-field" for="emergency-hospital">
            <span>Hospital</span>
            <select
              id="emergency-hospital"
              v-model.number="hospitalId"
              required
              :disabled="isLoading || hospitals.length === 0"
            >
              <option :value="null">Select hospital</option>
              <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital.id">
                {{ hospital.name }}
              </option>
            </select>
          </label>
          <label class="patient-form-field" for="emergency-title">
            <span>Case title</span>
            <input id="emergency-title" v-model="title" maxlength="150" required />
          </label>
          <label class="patient-form-field patient-form-span-all" for="emergency-description">
            <span>Description</span>
            <textarea
              id="emergency-description"
              v-model="description"
              maxlength="2000"
              rows="4"
              required
            ></textarea>
          </label>
          <label class="patient-form-field" for="emergency-severity">
            <span>Severity</span>
            <select id="emergency-severity" v-model="severity">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </label>
          <button
            class="button button-primary patient-form-span-all"
            type="submit"
            :disabled="isSubmitting || isLoading || hospitals.length === 0"
          >
            {{ isSubmitting ? "Submitting…" : "Submit case report" }}
          </button>
        </form>
        <p class="emergency-service-status" role="note">
          <ShieldCheck :size="17" aria-hidden="true" />
          This submits a case to the selected hospital; it does not dispatch an ambulance.
        </p>
        <p class="emergency-disclaimer">
          <Siren :size="16" aria-hidden="true" />
          <span>For immediate danger, contact local emergency services.</span>
        </p>
      </section>

      <aside class="panel emergency-queue-note">
        <span class="emergency-note-icon"><MapPin :size="18" aria-hidden="true" /></span>
        <span class="eyebrow">YOUR REPORTS</span>
        <h2>Emergency case history</h2>
        <p v-if="isLoading" role="status">Loading your reports…</p>
        <ul v-else-if="cases.length" class="emergency-case-list">
          <li v-for="item in cases" :key="item.id">
            <strong>#{{ item.id }} · {{ item.title }}</strong>
            <span>{{ item.status }} · {{ item.severity }}</span>
            <small>{{ new Date(item.createdAt).toLocaleString() }}</small>
          </li>
        </ul>
        <p v-else>No emergency cases were found for your account.</p>
        <RouterLink class="button button-secondary" to="/patient/join-queue">
          Routine care queue <ArrowRight :size="16" aria-hidden="true" />
        </RouterLink>
      </aside>
    </div>
  </div>
</template>
