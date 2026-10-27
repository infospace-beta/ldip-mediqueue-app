<script setup lang="ts">
import type { Component, PropType } from 'vue'
import { computed } from 'vue'
import { ClipboardList } from '@lucide/vue'
import ResponderEmptyState from './ResponderEmptyState.vue'
import PriorityBadge from './PriorityBadge.vue'
import StatusBadge from './StatusBadge.vue'

interface ResponderColumn {
  key: string
  label: string
}

interface ResponderRecord {
  id?: string | number
  requestId?: string | number
  patientId?: string | number
  [key: string]: string | number | null | undefined
}

const props = defineProps({
  title: String,
  subtitle: String,
  columns: { type: Array as PropType<ResponderColumn[]>, default: () => [] },
  rows: { type: Array as PropType<ResponderRecord[]>, default: () => [] },
  emptyTitle: String,
  emptyDescription: String,
  icon: { type: [Object, Function] as PropType<Component | null>, default: null },
})
const totalInSession = computed(() => props.rows.length)
</script>

<template>
  <section class="responder-panel responder-table-panel">
    <div class="responder-panel-heading"><div><span class="responder-eyebrow">WORKSPACE</span><h2>{{ title }}</h2><p>{{ subtitle }}</p></div><span v-if="totalInSession" class="responder-total">{{ totalInSession }} IN SESSION</span></div>
    <section class="responder-table-wrap" role="region" tabindex="0" :aria-label="`${title} table`">
      <table class="responder-table">
        <thead><tr><th v-for="column in props.columns" :key="column.key">{{ column.label }}</th></tr></thead>
        <tbody>
          <tr v-for="row in props.rows" :key="row.id || row.requestId || row.patientId">
            <td v-for="column in props.columns" :key="column.key">
              <PriorityBadge v-if="column.key === 'priority' && row[column.key]" :priority="String(row[column.key])" />
              <StatusBadge v-else-if="column.key === 'status' && row[column.key]" :status="String(row[column.key])" />
              <span v-else>{{ row[column.key] ?? '—' }}</span>
            </td>
          </tr>
          <tr v-if="props.rows.length === 0"><td :colspan="props.columns.length"><ResponderEmptyState :icon="props.icon || ClipboardList" :title="props.emptyTitle" :description="props.emptyDescription" /></td></tr>
        </tbody>
      </table>
    </section>
  </section>
</template>
