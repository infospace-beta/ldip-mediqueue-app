<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { Activity, ShieldAlert, UsersRound } from "@lucide/vue";
import ResponderSidebar from "../components/Responder/ResponderSidebar.vue";
import ResponderTopbar from "../components/Responder/ResponderTopbar.vue";
import ResponderDataTable from "../components/Responder/ResponderDataTable.vue";
import { useMobileNavigation } from "@/composables/useMobileNavigation";
import {
  assignedPatients,
  emergencyRequests,
  type ResponderRecord,
} from "../components/Responder/data.js";
import "../assets/responder.css";

const route = useRoute();
const searchQuery = ref("");
const {
  isMobile: mobileViewport,
  isOpen: mobileNavigationOpen,
  root: mobileNavigationRoot,
  toggle: toggleMobileNavigation,
  close: closeMobileNavigation,
} = useMobileNavigation({
  breakpoint: 930,
  trigger: ".responder-menu-button",
  firstNavigationItem: ".responder-nav .responder-nav-link",
});

function setNavigationRoot(element: unknown) {
  mobileNavigationRoot.value = element instanceof HTMLElement ? element : null;
}

const filteredEmergencyRequests = computed(() =>
  filterLocalRecords(emergencyRequests.value),
);
const filteredAssignedPatients = computed(() =>
  filterLocalRecords(assignedPatients.value),
);

function filterLocalRecords(records: ResponderRecord[]) {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return records;
  return records.filter((record) =>
    Object.values(record).some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(query),
    ),
  );
}
</script>

<template>
  <div :ref="setNavigationRoot" class="responder-app">
    <ResponderSidebar
      :open="mobileNavigationOpen"
      :mobile-viewport="mobileViewport"
      @close="closeMobileNavigation"
    />
    <div class="responder-main">
      <ResponderTopbar
        :title="String(route.meta.title || 'Responder Dashboard')"
        :searchable="route.meta.section === 'dashboard'"
        :mobile-navigation-open="mobileNavigationOpen"
        @search="searchQuery = $event"
        @toggle-menu="toggleMobileNavigation"
      />
      <main id="responder-main-content" class="responder-content">
        <RouterView v-if="route.meta.section !== 'dashboard'" />
        <div v-else class="responder-dashboard-content">
          <section class="responder-welcome">
            <span class="responder-welcome-mark"><Activity :size="20" /></span>
            <div class="responder-welcome-copy">
              <span class="responder-eyebrow">RESPONSE WORKSPACE</span>
              <h2>Responder workspace</h2>
              <p>
                This workspace is designed to organize assigned emergency
                requests and responder follow-up. Those records and live service
                status are not connected.
              </p>
            </div>
            <img
              class="responder-welcome-image"
              src="../assets/images/mat-napo-Ygyp2kXy2I0-unsplash.jpg"
              alt="Emergency responders assisting a patient beside an ambulance"
              width="176"
              height="112"
              decoding="async"
            />
          </section>
          <div class="responder-dashboard-grid">
            <div class="responder-main-column">
              <ResponderDataTable
                title="Emergency requests"
                subtitle="Records in this browser session only; live responder data is unavailable."
                :columns="[
                  { key: 'requestId', label: 'Request ID' },
                  { key: 'patient', label: 'Patient' },
                  { key: 'emergencyType', label: 'Emergency type' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'location', label: 'Location' },
                  { key: 'status', label: 'Status' },
                ]"
                :rows="filteredEmergencyRequests"
                :empty-title="
                  searchQuery
                    ? 'No matching session records'
                    : 'Emergency data unavailable'
                "
                :empty-description="
                  searchQuery
                    ? 'No local session record matches this search. Live responder data is not connected.'
                    : 'The responder service is not connected, so emergency requests cannot be loaded.'
                "
                :icon="ShieldAlert"
              />
              <ResponderDataTable
                title="Assigned patients"
                subtitle="Records in this browser session only; live responder data is unavailable."
                :columns="[
                  { key: 'patientId', label: 'Patient ID' },
                  { key: 'patient', label: 'Patient' },
                  { key: 'emergencyType', label: 'Emergency type' },
                  { key: 'location', label: 'Location' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'status', label: 'Status' },
                ]"
                :rows="filteredAssignedPatients"
                :empty-title="
                  searchQuery
                    ? 'No matching session records'
                    : 'Patient data unavailable'
                "
                :empty-description="
                  searchQuery
                    ? 'No local session record matches this search. Live responder data is not connected.'
                    : 'The responder service is not connected, so assigned patient records cannot be loaded.'
                "
                :icon="UsersRound"
              />
            </div>
          </div>
        </div>
      </main>
      <footer class="responder-footer">
        <span><i></i> Responder data unavailable · Service not connected</span
        ><span>MediQueue · Response portal</span>
      </footer>
    </div>
  </div>
</template>
