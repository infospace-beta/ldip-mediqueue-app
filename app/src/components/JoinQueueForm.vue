<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  MapPin,
  ShieldPlus,
} from "@lucide/vue";
import { setPatientQueue } from "../data/patient";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";

const router = useRouter();
const auth = useAuthStore();
const hospitals = ref([]);
const departments = ref([]);
const selectedHospitalId = ref(null);
const selectedDepartmentId = ref(null);
const isLoadingHospitals = ref(false);
const isLoadingDepartments = ref(false);
const isSubmitting = ref(false);
const loadError = ref("");
const formError = ref("");
const submittedTicket = ref(null);

const selectedHospital = computed(() =>
  hospitals.value.find((item) => item.id === selectedHospitalId.value),
);

async function loadHospitals() {
  isLoadingHospitals.value = true;
  loadError.value = "";
  try {
    hospitals.value = await mediqueueService.getHospitals();
  } catch (error) {
    loadError.value =
      error instanceof Error ? error.message : "Unable to load hospitals.";
  } finally {
    isLoadingHospitals.value = false;
  }
}

async function selectHospital() {
  selectedDepartmentId.value = null;
  departments.value = [];
  formError.value = "";
  if (!selectedHospitalId.value) return;

  isLoadingDepartments.value = true;
  try {
    departments.value = await mediqueueService.getDepartments(
      selectedHospitalId.value,
    );
  } catch (error) {
    loadError.value =
      error instanceof Error ? error.message : "Unable to load departments.";
  } finally {
    isLoadingDepartments.value = false;
  }
}

async function submitQueue() {
  formError.value = "";
  submittedTicket.value = null;
  if (!selectedDepartmentId.value) {
    formError.value = "Select a hospital and department to join its queue.";
    return;
  }
  if (!auth.user?.id) {
    formError.value = "Your patient account could not be identified.";
    return;
  }

  isSubmitting.value = true;
  try {
    const ticket = await mediqueueService.joinQueue(
      selectedDepartmentId.value,
    );
    setPatientQueue(
      ticket,
      selectedHospital.value?.name ?? "",
      selectedHospitalId.value,
    );
    submittedTicket.value = ticket;
  } catch (error) {
    formError.value =
      error instanceof Error ? error.message : "Unable to join this queue.";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => void loadHospitals());
</script>

<template>
  <div class="join-layout">
    <section class="panel join-form-panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">JOIN A QUEUE</span>
          <h2>Choose a hospital department</h2>
          <p class="panel-subtitle">
            Your account will be added to the selected department's queue.
          </p>
        </div>
        <span class="step-count">01 <span>/ 01</span></span>
      </div>
      <form class="join-form" @submit.prevent="submitQueue">
        <p v-if="loadError" class="form-message form-error" role="alert">
          {{ loadError }}
          <button type="button" class="text-link" @click="loadHospitals">
            Retry
          </button>
        </p>
        <label class="field-group">
          <span class="field-label">Hospital</span>
          <span class="select-wrap">
            <select
              v-model.number="selectedHospitalId"
              :disabled="isLoadingHospitals || hospitals.length === 0"
              @change="selectHospital"
            >
              <option :value="null">
                {{ isLoadingHospitals ? "Loading hospitals…" : "Select hospital" }}
              </option>
              <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital.id">
                {{ hospital.name }}
                <template v-if="hospital.town"> — {{ hospital.town }}</template>
              </option>
            </select>
            <ChevronDown :size="16" aria-hidden="true" />
          </span>
        </label>
        <label class="field-group">
          <span class="field-label">Department</span>
          <span class="select-wrap">
            <select
              v-model.number="selectedDepartmentId"
              :disabled="!selectedHospitalId || isLoadingDepartments || departments.length === 0"
            >
              <option :value="null">
                {{
                  isLoadingDepartments
                    ? "Loading departments…"
                    : selectedHospitalId
                      ? "Select department"
                      : "Select a hospital first"
                }}
              </option>
              <option v-for="department in departments" :key="department.id" :value="department.id">
                {{ department.name }}
              </option>
            </select>
            <ChevronDown :size="16" aria-hidden="true" />
          </span>
        </label>
        <p v-if="selectedHospitalId && !isLoadingDepartments && !departments.length" class="form-helper">
          No active departments were returned for this hospital.
        </p>
        <p v-if="formError" class="form-message form-error" role="alert">
          {{ formError }}
        </p>
        <output v-if="submittedTicket" class="form-message service-notice" role="status">
          Queue ticket #{{ submittedTicket.id }} was created successfully.
        </output>
        <button class="button button-primary button-join" type="submit" :disabled="isSubmitting || !departments.length">
          <span>{{ isSubmitting ? "Joining queue…" : "Join queue" }}</span>
          <ArrowRight class="button-arrow" :size="18" aria-hidden="true" />
        </button>
        <button v-if="submittedTicket" class="button button-secondary" type="button" @click="router.push('/patient/queue')">
          View queue status
        </button>
        <p class="form-note">
          <ShieldPlus :size="17" aria-hidden="true" />
          <span>
            This adds a routine queue ticket only. If you have an emergency,
            contact local emergency services directly.
          </span>
        </p>
      </form>
    </section>
    <aside class="join-side-column">
      <section class="panel care-info-panel">
        <span class="care-info-icon"><Clock3 :size="20" aria-hidden="true" /></span>
        <span class="eyebrow">LIVE QUEUE</span>
        <h3>Queue details</h3>
        <p>Ticket position and estimated wait are supplied by the hospital queue service.</p>
        <div class="info-rule"></div>
        <div class="availability-note">
          <span class="availability-indicator"></span>
          <span>{{ submittedTicket ? "Your ticket is active." : "Choose a department to join its queue." }}</span>
        </div>
      </section>
      <section class="panel nearby-tip">
        <MapPin :size="18" aria-hidden="true" />
        <span>Only active hospitals and departments provided by MediQueue are selectable.</span>
      </section>
    </aside>
  </div>
</template>
