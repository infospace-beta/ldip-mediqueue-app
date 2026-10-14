<script setup>  
import { ClipboardList } from '@lucide/vue'
import ResponderEmptyState from './ResponderEmptyState.vue'
import PriorityBadge from './PriorityBadge.vue'
import StatusBadge from './StatusBadge.vue'

defineProps({ title: String, subtitle: String, columns: Array, rows: { type: Array, default: () => [] }, emptyTitle: String, emptyDescription: String, icon: Object })
defineEmits(['select-row'])
</script>

<template>
  <section class="responder-panel responder-table-panel">
    <div class="responder-panel-heading"><div><span class="responder-eyebrow">WORKSPACE</span><h2>{{ title }}</h2><p>{{ subtitle }}</p></div><span class="responder-total">0 TOTAL</span></div>
    <section class="responder-table-wrap" :aria-label="`${title} table`">
      <table class="responder-table">
        <thead><tr><th v-for="column in columns" :key="column.key">{{ column.label }}</th></tr></thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id || row.requestId || row.patientId">
            <td v-for="column in columns" :key="column.key">
              <PriorityBadge v-if="column.key === 'priority' && row[column.key]" :priority="row[column.key]" />
              <StatusBadge v-else-if="column.key === 'status' && row[column.key]" :status="row[column.key]" />
              <button v-else-if="column.key === 'action'" class="responder-row-action" type="button" @click="$emit('select-row', row)">View</button>
              <span v-else>{{ row[column.key] || '—' }}</span>
            </td>
          </tr>
          <tr v-if="rows.length === 0"><td :colspan="columns.length"><ResponderEmptyState :icon="icon || ClipboardList" :title="emptyTitle" :description="emptyDescription" /></td></tr>
        </tbody>
      </table>
    </section>
  </section>
</template>