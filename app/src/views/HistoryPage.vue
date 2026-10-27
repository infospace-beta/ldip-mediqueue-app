<script setup>
import { computed, ref } from 'vue'
import { Activity, CalendarDays, ClipboardList, Download, ShieldCheck } from '@lucide/vue'
import { medicalHistory } from '../data/patient'

const search = ref('')
const filteredHistory = computed(() => medicalHistory.filter((visit) => `${visit.date} ${visit.doctor} ${visit.department} ${visit.diagnosis}`.toLowerCase().includes(search.value.toLowerCase())))
function downloadSummary() {
  const rows = ['Date,Doctor,Department,Diagnosis,Treatment,Prescription', ...filteredHistory.value.map((visit) => [visit.date, visit.doctor, visit.department, visit.diagnosis, visit.treatment, visit.prescription].map((value) => `"${value}"`).join(','))]
  const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'mediqueue-medical-history.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>

<template>
  <div class="section-page history-page"><div class="page-heading"><div><span class="eyebrow">YOUR CARE RECORD</span><h1>Medical history</h1><p>Records shown here are limited to information available in this session.</p></div><button class="button button-secondary" type="button" @click="downloadSummary"><Download :size="16" aria-hidden="true" /> Export summary</button></div>
    <section class="panel history-panel"><div class="panel-header"><div><span class="eyebrow">VISIT RECORDS</span><h2>Previous visits</h2></div><label class="history-search"><Activity :size="16" /><input v-model="search" aria-label="Search medical history" placeholder="Search records" /></label></div>
      <div v-if="filteredHistory.length" class="history-table-wrap"><table class="history-table"><thead><tr><th>Visit date</th><th>Doctor & department</th><th>Diagnosis</th><th>Treatment</th><th>Prescription</th></tr></thead><tbody><tr v-for="visit in filteredHistory" :key="visit.date"><td class="history-date"><CalendarDays :size="15" /> {{ visit.date }}</td><td><strong>{{ visit.doctor }}</strong><small>{{ visit.department }}</small></td><td>{{ visit.diagnosis }}</td><td>{{ visit.treatment }}</td><td><span class="prescription-tag">{{ visit.prescription }}</span></td></tr></tbody></table></div>
      <div v-else class="history-empty"><ClipboardList :size="20" aria-hidden="true" /><div><strong>No medical history available</strong><p>{{ search ? 'No records match this search.' : 'Records are not connected to a live care provider.' }}</p></div></div>
      <div class="history-footer"><ShieldCheck :size="15" aria-hidden="true" /> History is limited to local session data; it is not retrieved from a medical records system.</div>
    </section>
  </div>
</template>
