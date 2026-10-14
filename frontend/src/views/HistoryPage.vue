<script setup>
import { computed, ref } from 'vue'
import { Activity, CalendarDays, ClipboardList, Download, ShieldCheck, Stethoscope } from '@lucide/vue'
import { medicalHistory } from '../data/patient'

const search = ref('')
const filteredHistory = computed(() => medicalHistory.filter((visit) => `${visit.date} ${visit.doctor} ${visit.department} ${visit.diagnosis}`.toLowerCase().includes(search.value.toLowerCase())))
function downloadSummary() {
  const rows = ['Date,Doctor,Department,Diagnosis,Treatment,Prescription', ...filteredHistory.value.map((visit) => [visit.date, visit.doctor, visit.department, visit.diagnosis, visit.treatment, visit.prescription].map((value) => `"${value}"`).join(','))]
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }))
  link.download = 'mediqueue-medical-history.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}
</script>

<template>
  <div class="section-page"><div class="page-heading"><div><span class="eyebrow">YOUR CARE RECORD</span><h1>Medical history</h1><p>A private, organized view of previous visits and treatments.</p></div><button class="button button-secondary" type="button" @click="downloadSummary"><Download :size="16" /> Export summary</button></div>
    <div class="history-summary"><article class="history-stat"><span><ClipboardList :size="17" /></span><strong>{{ medicalHistory.length }}</strong><small>Previous visits</small></article><article class="history-stat"><span><Stethoscope :size="17" /></span><strong>0</strong><small>Doctors</small></article><article class="history-stat"><span><ClipboardList :size="17" /></span><strong>0</strong><small>Treatments</small></article></div>
    <section class="panel history-panel"><div class="panel-header"><div><span class="eyebrow">VISIT RECORDS</span><h2>Previous visits</h2></div><label class="history-search"><Activity :size="16" /><input v-model="search" aria-label="Search medical history" placeholder="Search records" /></label></div>
      <div v-if="filteredHistory.length" class="history-table-wrap"><table class="history-table"><thead><tr><th>Visit date</th><th>Doctor & department</th><th>Diagnosis</th><th>Treatment</th><th>Prescription</th></tr></thead><tbody><tr v-for="visit in filteredHistory" :key="visit.date"><td class="history-date"><CalendarDays :size="15" /> {{ visit.date }}</td><td><strong>{{ visit.doctor }}</strong><small>{{ visit.department }}</small></td><td>{{ visit.diagnosis }}</td><td>{{ visit.treatment }}</td><td><span class="prescription-tag">{{ visit.prescription }}</span></td></tr></tbody></table></div>
      <div v-else class="inline-empty history-empty">No medical history available.</div>
      <div class="history-footer"><ShieldCheck :size="15" /> History records will appear here when connected to a care provider.</div>
    </section>
    <section class="history-timeline panel"><div><span class="eyebrow">CARE JOURNEY</span><h2>Your visits over time</h2></div><div class="empty-inline-state"><ClipboardList :size="19" /><span>No medical history available.</span></div></section>
  </div>
</template>

