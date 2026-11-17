<script setup>
import { computed, onMounted, ref } from "vue";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Download,
  ShieldCheck,
} from "@lucide/vue";
import { medicalHistory } from "../data/patient";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";

const auth = useAuthStore();
const search = ref("");
const isLoading = ref(true);
const errorMessage = ref("");
const filteredHistory = computed(() =>
  medicalHistory.filter((visit) =>
    `${visit.date} ${visit.doctor} ${visit.department} ${visit.diagnosis}`
      .toLowerCase()
      .includes(search.value.toLowerCase()),
  ),
);
async function loadHistory() {
  const patientId = auth.user?.id;
  if (!patientId) {
    errorMessage.value = "Your patient account could not be identified.";
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const records = await mediqueueService.getPatientClinicalRecords(patientId);
    medicalHistory.splice(
      0,
      medicalHistory.length,
      ...records.map((record) => ({
        id: record.id,
        date: new Date(record.recordedAt).toLocaleDateString(),
        doctor: record.authoredByName,
        department: `Visit #${record.queueTicketId}`,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        prescription: record.prescription || "None recorded",
      })),
    );
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unable to load medical history.";
  } finally {
    isLoading.value = false;
  }
}
function downloadSummary() {
  const rows = [
    "Date,Doctor,Department,Diagnosis,Treatment,Prescription",
    ...filteredHistory.value.map((visit) =>
      [
        visit.date,
        visit.doctor,
        visit.department,
        visit.diagnosis,
        visit.treatment,
        visit.prescription,
      ]
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(","),
    ),
  ];
  const url = URL.createObjectURL(
    new Blob([rows.join("\n")], { type: "text/csv" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "mediqueue-medical-history.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
onMounted(() => void loadHistory());
</script>

<template>
  <div class="section-page history-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">VISIT RECORDS</span>
        <h1>Medical history</h1>
        <p>
          Clinical records shared by your care team appear here.
        </p>
      </div>
      <button
        class="button button-secondary"
        type="button"
        :disabled="!filteredHistory.length"
        @click="downloadSummary"
      >
        <Download :size="16" aria-hidden="true" /> Export summary
      </button>
    </div>
    <section class="panel history-panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">CLINICAL RECORDS</span>
          <h2>Previous visits</h2>
        </div>
        <label class="history-search"
          ><Activity :size="16" /><input
            v-model="search"
            aria-label="Search medical history"
            placeholder="Search records"
        /></label>
      </div>
      <div v-if="filteredHistory.length" class="history-table-wrap">
        <table class="history-table">
          <thead>
            <tr>
              <th>Visit date</th>
              <th>Recorded by / visit</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="visit in filteredHistory" :key="visit.id">
              <td class="history-date">
                <CalendarDays :size="15" /> {{ visit.date }}
              </td>
              <td>
                <strong>{{ visit.doctor }}</strong
                ><small>{{ visit.department }}</small>
              </td>
              <td>{{ visit.diagnosis }}</td>
              <td>{{ visit.treatment }}</td>
              <td>
                <span class="prescription-tag">{{ visit.prescription }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="isLoading" class="history-empty" role="status">
        Loading your clinical records…
      </div>
      <div v-else class="history-empty">
        <ClipboardList :size="20" aria-hidden="true" />
        <div>
          <strong>No medical history available</strong>
          <p>
            {{
              search
                ? "No records match this search."
                : "No clinical records are available."
            }}
          </p>
        </div>
      </div>
      <div class="history-footer">
        <ShieldCheck :size="15" aria-hidden="true" /> These records are retrieved
        from the MediQueue clinical-record service.
      </div>
    </section>
    <p v-if="errorMessage" class="form-message form-error" role="alert">
      {{ errorMessage }}
      <button class="text-link" type="button" @click="loadHistory">Retry</button>
    </p>
  </div>
</template>
