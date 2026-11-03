<script setup lang="ts">
import { Building2, LogOut, X } from "@lucide/vue";
import LogoutAction from "@/components/common/LogoutAction.vue";
import { useHospitalWorkspaceStore } from "@/stores/hospitalWorkspace.store";
import type { StaffNavigationItem, StaffSectionId } from "./staffNavigation";

const props = defineProps<{
  activeSection: StaffSectionId;
  mobileOpen: boolean;
  mobileViewport: boolean;
  navigation: readonly StaffNavigationItem[];
}>();

const emit = defineEmits<{
  navigate: [section: StaffSectionId];
  close: [];
}>();

const workspace = useHospitalWorkspaceStore();

function selectHospital(event: Event) {
  if (!(event.currentTarget instanceof HTMLSelectElement)) {
    throw new TypeError(
      "Hospital selector event did not originate from a select.",
    );
  }
  workspace.selectHospital(event.currentTarget.value);
}

function retryAssignments() {
  const staffUserId = workspace.staffUserId;
  if (staffUserId !== null) void workspace.loadAssignments(staffUserId);
}
</script>

<template>
  <button
    v-if="props.mobileOpen"
    class="staff-scrim"
    type="button"
    aria-label="Close staff navigation"
    tabindex="-1"
    @click="emit('close')"
  />
  <aside
    id="staff-navigation"
    class="staff-sidebar"
    :class="{ 'staff-sidebar-open': props.mobileOpen }"
    :inert="props.mobileViewport && !props.mobileOpen ? true : undefined"
    aria-label="Hospital staff navigation"
  >
    <div class="staff-brand-row">
      <a
        class="staff-brand"
        href="#operations"
        @click="emit('navigate', 'operations')"
      >
        <span class="staff-brand-mark">
          <img :src="'/mediqueue-logo.png'" alt="" />
        </span>
        <span class="staff-brand-copy">
          <strong>MediQueue</strong>
          <small>HOSPITAL OPERATIONS</small>
        </span>
      </a>
      <button
        class="staff-sidebar-close"
        type="button"
        aria-label="Close navigation"
        @click="emit('close')"
      >
        <X :size="19" aria-hidden="true" />
      </button>
    </div>

    <section class="staff-assignment" aria-labelledby="staff-assignment-title">
      <p id="staff-assignment-title" class="staff-nav-heading">
        HOSPITAL ASSIGNMENT
      </p>
      <div class="staff-assignment-card">
        <Building2 :size="18" aria-hidden="true" />
        <span>
          <strong v-if="workspace.isLoading">Checking assignment</strong>
          <strong v-else-if="workspace.currentHospital">
            {{ workspace.currentHospital.name }}
          </strong>
          <strong v-else-if="workspace.error">Assignment unavailable</strong>
          <strong v-else-if="workspace.isLoaded">No hospital assignment</strong>
          <strong v-else>Assignment pending</strong>
          <small v-if="workspace.isLoading"> Loading assigned hospitals </small>
          <small v-else-if="workspace.currentHospital">
            Selected hospital
          </small>
          <small v-else-if="workspace.error">{{ workspace.error }}</small>
          <small v-else-if="workspace.isLoaded">
            No active hospital assignment is available for this account.
          </small>
          <small v-else>Backend integration pending</small>
        </span>
      </div>
      <label
        v-if="workspace.availableHospitals.length"
        class="staff-assignment-select-label"
        for="staff-hospital-select"
      >
        Select assigned hospital
        <select
          id="staff-hospital-select"
          class="staff-assignment-select"
          :value="workspace.selectedHospitalId ?? ''"
          :disabled="workspace.isLoading"
          @change="selectHospital"
        >
          <option value="" disabled>Choose an assigned hospital</option>
          <option
            v-for="hospital in workspace.availableHospitals"
            :key="hospital.id"
            :value="hospital.id"
          >
            {{ hospital.name }}
          </option>
        </select>
      </label>
      <button
        v-if="workspace.error && workspace.staffUserId !== null"
        class="staff-assignment-retry"
        type="button"
        :disabled="workspace.isLoading"
        @click="retryAssignments"
      >
        Retry assignment check
      </button>
    </section>

    <p class="staff-nav-heading">WORKSPACE</p>
    <nav class="staff-navigation" aria-label="Staff workspace">
      <a
        v-for="section in props.navigation"
        :key="section.id"
        class="staff-nav-link"
        :class="{ 'staff-nav-link-active': props.activeSection === section.id }"
        :aria-current="
          props.activeSection === section.id ? 'location' : undefined
        "
        :href="`#${section.id}`"
        @click="emit('navigate', section.id)"
      >
        <component :is="section.icon" :size="18" aria-hidden="true" />
        <span>{{ section.label }}</span>
      </a>
    </nav>

    <div class="staff-sidebar-note" role="status">
      <span class="staff-connection-mark" aria-hidden="true" />
      <span>
        <strong>Hospital services</strong>
        <small>Not connected</small>
      </span>
    </div>
    <LogoutAction
      button-class="staff-nav-link staff-logout"
      @logout="emit('close')"
    >
      <LogOut :size="18" aria-hidden="true" />
      <span>Log out</span>
    </LogoutAction>
  </aside>
</template>
