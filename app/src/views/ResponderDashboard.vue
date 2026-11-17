<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Activity, ShieldAlert, UsersRound } from "@lucide/vue";
import ResponderSidebar from "../components/Responder/ResponderSidebar.vue";
import ResponderTopbar from "../components/Responder/ResponderTopbar.vue";
import { useMobileNavigation } from "@/composables/useMobileNavigation";
import {
  mediqueueService,
  type EmergencyRecord,
} from "@/services/mediqueue.service";
import "../assets/responder.css";

const route = useRoute();
const searchQuery = ref("");

const summary = ref<{
  hospitalId: number | null;
  assignedCases: number;
  respondingCases: number;
} | null>(null);

const emergencyCases = ref<EmergencyRecord[]>([]);
const isLoading = ref(true);
const loadError = ref("");
const caseError = ref("");
const actionError = ref("");
const actionCaseId = ref<number | null>(null);

const filteredCases = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) return emergencyCases.value;

  return emergencyCases.value.filter((item) =>
    [
      String(item.id),
      item.title,
      item.description,
      item.severity,
      item.status,
    ].some((value) => value?.toLowerCase().includes(query)),
  );
});

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
  mobileNavigationRoot.value =
    element instanceof HTMLElement ? element : null;
}

async function loadDashboard() {
  isLoading.value = true;
  loadError.value = "";
  caseError.value = "";

  const [summaryResult, casesResult] = await Promise.allSettled([
    mediqueueService.getResponderSummary(),
    mediqueueService.getResponderEmergencyCases(),
  ]);

  if (summaryResult.status === "fulfilled") {
    summary.value = summaryResult.value;
  } else {
    loadError.value =
      summaryResult.reason instanceof Error
        ? summaryResult.reason.message
        : "Unable to load responder summary.";
  }

  if (casesResult.status === "fulfilled") {
    emergencyCases.value = casesResult.value;
  } else {
    caseError.value =
      casesResult.reason instanceof Error
        ? casesResult.reason.message
        : "Unable to load assigned emergency cases.";
  }

  isLoading.value = false;
}

async function startResponding(item: EmergencyRecord) {
  actionCaseId.value = item.id;
  actionError.value = "";

  try {
    await mediqueueService.updateEmergencyStatus(
      item.hospitalId,
      item.id,
      "RESPONDING",
    );
    await loadDashboard();
  } catch (error) {
    actionError.value =
      error instanceof Error
        ? error.message
        : "Unable to update the emergency case.";
  } finally {
    actionCaseId.value = null;
  }
}

async function resolveCase(item: EmergencyRecord) {
  actionCaseId.value = item.id;
  actionError.value = "";

  try {
    await mediqueueService.resolveEmergency(item.hospitalId, item.id);
    await loadDashboard();
  } catch (error) {
    actionError.value =
      error instanceof Error
        ? error.message
        : "Unable to resolve the emergency case.";
  } finally {
    actionCaseId.value = null;
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString();
}

function statusClass(status: string) {
  switch (status) {
    case "ASSIGNED":
      return "status-waiting";
    case "RESPONDING":
      return "status-in-progress";
    case "RESOLVED":
      return "status-completed";
    default:
      return "";
  }
}

function priorityClass(severity: string) {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return "priority-critical";
    case "HIGH":
      return "priority-high";
    case "MEDIUM":
      return "priority-medium";
    default:
      return "priority-low";
  }
}

onMounted(() => void loadDashboard());
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
            <span class="responder-welcome-mark">
              <Activity :size="20" />
            </span>

            <div class="responder-welcome-copy">
              <span class="responder-eyebrow">RESPONSE WORKSPACE</span>
              <h2>Responder workspace</h2>
              <p>
                Manage your assigned emergency cases and update their response
                status.
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

          <div v-if="isLoading" class="responder-panel" role="status">
            Loading responder dashboard…
          </div>

          <p v-if="loadError" class="responder-panel" role="alert">
            {{ loadError }}
            <button type="button" @click="loadDashboard">Retry</button>
          </p>

          <div v-if="summary" class="responder-dashboard-grid">
            <article class="responder-panel responder-summary-card">
              <ShieldAlert :size="20" aria-hidden="true" />
              <span class="responder-eyebrow">ASSIGNED CASES</span>
              <strong>{{ summary.assignedCases }}</strong>
            </article>

            <article class="responder-panel responder-summary-card">
              <Activity :size="20" aria-hidden="true" />
              <span class="responder-eyebrow">RESPONDING</span>
              <strong>{{ summary.respondingCases }}</strong>
            </article>

            <article class="responder-panel responder-summary-card">
              <UsersRound :size="20" aria-hidden="true" />
              <span class="responder-eyebrow">HOSPITAL</span>
              <strong>{{ summary.hospitalId ?? "Not assigned" }}</strong>
            </article>
          </div>

          <section class="responder-panel">
            <div class="responder-panel-heading">
              <div>
                <span class="responder-eyebrow">YOUR ASSIGNMENTS</span>
                <h2>Assigned emergency cases</h2>
                <p>
                  Only cases assigned to your responder account are displayed.
                </p>
              </div>

              <span class="responder-total">
                {{ filteredCases.length }} CASES
              </span>
            </div>

            <p v-if="caseError" role="alert">
              {{ caseError }}
              <button type="button" @click="loadDashboard">Retry</button>
            </p>

            <p v-if="actionError" role="alert">
              {{ actionError }}
            </p>

            <div class="responder-table-wrap">
              <table class="responder-table">
                <thead>
                  <tr>
                    <th>CASE</th>
                    <th>DESCRIPTION</th>
                    <th>SEVERITY</th>
                    <th>STATUS</th>
                    <th>REPORTED</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in filteredCases" :key="item.id">
                    <td>#{{ item.id }} · {{ item.title }}</td>
                    <td>{{ item.description }}</td>
                    <td>
                      <span
                        class="responder-priority-badge"
                        :class="priorityClass(item.severity)"
                      >
                        {{ item.severity }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="responder-status-badge"
                        :class="statusClass(item.status)"
                      >
                        <i></i>
                        {{ item.status }}
                      </span>
                    </td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td>
                      <button
                        v-if="item.status === 'ASSIGNED'"
                        class="responder-row-action"
                        type="button"
                        :disabled="actionCaseId === item.id"
                        @click="startResponding(item)"
                      >
                        {{
                          actionCaseId === item.id
                            ? "Updating…"
                            : "Start responding"
                        }}
                      </button>

                      <button
                        v-else-if="item.status === 'RESPONDING'"
                        class="responder-row-action"
                        type="button"
                        :disabled="actionCaseId === item.id"
                        @click="resolveCase(item)"
                      >
                        {{
                          actionCaseId === item.id
                            ? "Updating…"
                            : "Resolve case"
                        }}
                      </button>

                      <span v-else>Completed</span>
                    </td>
                  </tr>

                  <tr v-if="!isLoading && !caseError && filteredCases.length === 0">
                    <td colspan="6">
                      <div class="responder-empty-state">
                        <span class="responder-empty-icon">
                          <ShieldAlert :size="20" />
                        </span>
                        <strong>
                          {{
                            searchQuery
                              ? "No matching cases found"
                              : "No assigned emergency cases"
                          }}
                        </strong>
                        <p>
                          {{
                            searchQuery
                              ? "Try a different search term."
                              : "New cases assigned to you will appear here."
                          }}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <footer class="responder-footer">
        <span><i></i> Responder dashboard connected · Assigned cases</span>
        <span>MediQueue · Response portal</span>
      </footer>
    </div>
  </div>
</template>
