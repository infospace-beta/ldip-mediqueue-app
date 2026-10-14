<script setup lang="ts">
import EmergencyAlert from '../components/EmergencyAlert.vue'
import EmergencyCard from '../components/EmergencyCard.vue'
import EmergencyTimeline from '../components/EmergencyTimeline.vue'
import Button from '../components/Button.vue'
import { emergencyRequests } from '../data/mockData'
</script>

<template>
  <div class="page-shell__content">
    <EmergencyAlert title="New Critical Emergency Request" detail="North entrance · Immediate response required" />

    <section class="emergency-grid">
      <div class="emergency-column">
        <div v-if="emergencyRequests.length === 0" class="empty-state empty-state--large">
          <p>No active emergency requests.</p>
        </div>

        <div v-else v-for="request in emergencyRequests" :key="request.id" class="emergency-stack">
          <EmergencyCard :emergency="request" />
        </div>
      </div>

      <aside class="panel">
        <div class="panel__header">
          <div>
            <p class="eyebrow">Emergency actions</p>
            <h3>Escalation & response</h3>
          </div>
        </div>

        <div class="inline-actions inline-actions--stacked">
          <Button variant="success">Accept</Button>
          <Button variant="secondary">Assign Responder</Button>
          <Button variant="danger">Escalate Emergency</Button>
          <Button variant="ghost">Notify Trauma Lead</Button>
        </div>

        <div class="alert-callout">
          <strong>Escalate Emergency</strong>
          <p>Notify trauma lead and reassign the nearest response team.</p>
          <ul>
            <li>Charge Nurse</li>
            <li>Trauma Lead</li>
            <li>Hospital Command</li>
          </ul>
        </div>

        <div class="timeline-panel">
          <p class="eyebrow">Timeline</p>
          <EmergencyTimeline v-if="emergencyRequests.length" :timeline="emergencyRequests[0].timeline" />
          <div v-else class="empty-state empty-state--small">
            <p>No emergency timeline available.</p>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>
