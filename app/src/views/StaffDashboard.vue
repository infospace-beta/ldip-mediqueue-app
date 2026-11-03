<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Activity, Menu, X } from "@lucide/vue";
import ThemeSwitcher from "@/components/common/ThemeSwitcher.vue";
import StaffSidebar from "@/components/Staff/StaffSidebar.vue";
import {
  staffNavigation,
  type StaffSectionId,
} from "@/components/Staff/staffNavigation";
import { useMobileNavigation } from "@/composables/useMobileNavigation";
import { useAuthStore } from "@/stores/auth.store";
import { useHospitalWorkspaceStore } from "@/stores/hospitalWorkspace.store";
import "../assets/staff.css";

const auth = useAuthStore();
const hospitalWorkspace = useHospitalWorkspaceStore();
const activeSectionId = ref<StaffSectionId>("operations");
const activeSection = computed(() =>
  staffNavigation.find((section) => section.id === activeSectionId.value),
);
const {
  isMobile: mobileViewport,
  isOpen: mobileNavigationOpen,
  root: mobileNavigationRoot,
  toggle: toggleMobileNavigation,
  close: closeMobileNavigation,
} = useMobileNavigation({
  breakpoint: 760,
  trigger: ".staff-menu-button",
  firstNavigationItem: ".staff-navigation .staff-nav-link",
});

onMounted(() => {
  if (auth.user?.role === "staff") {
    void hospitalWorkspace.loadAssignments(auth.user.id);
  }
});

function setNavigationRoot(element: unknown) {
  mobileNavigationRoot.value = element instanceof HTMLElement ? element : null;
}

function navigateTo(section: StaffSectionId) {
  activeSectionId.value = section;
  void closeMobileNavigation();
}
</script>

<template>
  <div :ref="setNavigationRoot" class="staff-dashboard">
    <a class="staff-skip-link" href="#staff-main-content"
      >Skip to main content</a
    >
    <StaffSidebar
      :active-section="activeSectionId"
      :mobile-open="mobileNavigationOpen"
      :mobile-viewport="mobileViewport"
      :navigation="staffNavigation"
      @navigate="navigateTo"
      @close="closeMobileNavigation"
    />

    <div class="staff-main">
      <header class="staff-topbar">
        <div class="staff-topbar-heading">
          <span class="staff-eyebrow">MEDIQUEUE / STAFF</span>
          <h1>{{ activeSection?.title ?? "Hospital operations" }}</h1>
        </div>
        <div class="staff-topbar-actions">
          <ThemeSwitcher />
          <button
            class="staff-menu-button"
            type="button"
            :aria-expanded="mobileNavigationOpen"
            aria-controls="staff-navigation"
            :aria-label="
              mobileNavigationOpen ? 'Close navigation' : 'Open navigation'
            "
            @click="toggleMobileNavigation"
          >
            <X v-if="mobileNavigationOpen" :size="20" aria-hidden="true" />
            <Menu v-else :size="20" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="staff-main-content" class="staff-content">
        <section class="staff-intro" aria-labelledby="staff-page-title">
          <div>
            <span class="staff-eyebrow">STAFF WORKSPACE</span>
            <h2 id="staff-page-title">Hospital operations overview</h2>
            <p>
              Organize patient-flow and hospital service workflows here.
              Assigned hospital information appears only when a verified service
              provides it.
            </p>
          </div>
          <span class="staff-preview-badge">Preview · No live data</span>
        </section>

        <section
          class="staff-connection-alert"
          role="status"
          aria-live="polite"
        >
          <span class="staff-alert-icon" aria-hidden="true"
            ><Activity :size="19"
          /></span>
          <div>
            <strong>Hospital services are not connected</strong>
            <p>
              Dashboard data is unavailable. This preview contains no live
              hospital records or operational controls.
            </p>
          </div>
        </section>

        <section
          id="operations"
          class="staff-section staff-overview-section"
          aria-labelledby="operations-title"
        >
          <div class="staff-section-heading">
            <div>
              <span class="staff-eyebrow">OVERVIEW</span>
              <h2 id="operations-title">Operations at a glance</h2>
            </div>
            <span class="staff-unavailable-label">Unavailable</span>
          </div>
          <p class="staff-section-description">
            Hospital-wide operational summaries will appear here when a verified
            data service is available.
          </p>
          <div class="staff-overview-placeholder" role="status">
            <Activity :size="20" aria-hidden="true" />
            <span>
              <strong>No operational data available</strong>
              <small
                >This is an unavailable state, not a report of zero
                activity.</small
              >
            </span>
          </div>
        </section>

        <div class="staff-section-grid">
          <section
            v-for="section in staffNavigation.slice(1)"
            :id="section.id"
            :key="section.id"
            class="staff-section staff-detail-section"
            :aria-labelledby="`${section.id}-title`"
          >
            <div class="staff-section-heading">
              <div class="staff-title-with-icon">
                <span class="staff-section-icon" aria-hidden="true">
                  <component :is="section.icon" :size="18" />
                </span>
                <div>
                  <span class="staff-eyebrow">STAFF WORKSPACE</span>
                  <h2 :id="`${section.id}-title`">{{ section.title }}</h2>
                </div>
              </div>
              <span class="staff-unavailable-label">Unavailable</span>
            </div>
            <div class="staff-unavailable-state" role="status">
              <p>{{ section.description }}</p>
            </div>
          </section>
        </div>

        <footer class="staff-footer">
          <span>MediQueue · Hospital staff workspace</span>
          <span>Preview only · Operational services unavailable</span>
        </footer>
      </main>
    </div>
  </div>
</template>
