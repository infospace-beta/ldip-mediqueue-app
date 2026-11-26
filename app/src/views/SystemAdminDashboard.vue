<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import axios from "axios";
import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Settings,
  ShieldCheck,
  UsersRound,
  X,
} from "@lucide/vue";
import type { Component } from "vue";
import type { BackendUserRole } from "@/types/models";
import LogoutAction from "@/components/common/LogoutAction.vue";
import ThemeSwitcher from "@/components/common/ThemeSwitcher.vue";
import { useMobileNavigation } from "@/composables/useMobileNavigation";
import { useAuthStore } from "@/stores/auth.store";
import {
  systemAdminService,
  type SystemAdminHospital,
  type SystemAdminHospitalRequest,
  type SystemAdminHospitalStatus,
  type SystemAdminHospitalType,
  type SystemAdminPage,
  type SystemAdminUser,
  type SystemAdminUserRequest,
} from "@/services/systemAdmin.service";
import "@/assets/system-admin.css";

type SystemAdminSection =
  | "overview"
  | "hospitals"
  | "users"
  | "roles"
  | "monitoring"
  | "audit"
  | "settings";

interface NavigationItem {
  id: SystemAdminSection;
  label: string;
  icon: Component;
}

const PAGE_SIZE = 10;
const HOSPITAL_OPTION_PAGE_SIZE = 50;
const roleOptions: BackendUserRole[] = [
  "PATIENT",
  "RESPONDER",
  "DOCTOR",
  "RECEPTIONIST",
  "MEDICAL_STAFF",
  "HOSPITAL_ADMIN",
  "SYSTEM_ADMIN",
];
const hospitalTypes: SystemAdminHospitalType[] = [
  "PUBLIC",
  "PRIVATE",
  "FAITH_BASED",
];
const hospitalStatuses: SystemAdminHospitalStatus[] = ["ACTIVE", "INACTIVE"];
const navigation: NavigationItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "hospitals", label: "Hospital Management", icon: Building2 },
  { id: "users", label: "User Management", icon: UsersRound },
  { id: "roles", label: "Role Management", icon: KeyRound },
  { id: "monitoring", label: "System Monitoring", icon: Activity },
  { id: "audit", label: "Audit Logs", icon: ScrollText },
  { id: "settings", label: "System Settings", icon: Settings },
];

const auth = useAuthStore();
const activeSection = ref<SystemAdminSection>("overview");
const {
  isMobile,
  isOpen: mobileNavigationOpen,
  root: mobileNavigationRoot,
  toggle: toggleMobileNavigation,
  close: closeMobileNavigation,
} = useMobileNavigation({
  breakpoint: 900,
  trigger: ".system-admin-menu-button",
  firstNavigationItem: ".system-admin-nav-link",
});

const administratorName = computed(
  () =>
    [auth.user?.firstName, auth.user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    auth.user?.username?.trim() ||
    "System administrator",
);
const administratorInitial = computed(
  () => administratorName.value.charAt(0).toUpperCase() || "?",
);
const activeNavigationItem = computed(() =>
  navigation.find((item) => item.id === activeSection.value)!,
);

const hospitalPage = ref<SystemAdminPage<SystemAdminHospital> | null>(null);
const userPage = ref<SystemAdminPage<SystemAdminUser> | null>(null);
const overviewHospitalCount = ref<number | null>(null);
const overviewUserCount = ref<number | null>(null);
const overviewError = ref<string | null>(null);
const overviewLoading = ref(false);
const hospitalsLoading = ref(false);
const hospitalsError = ref<string | null>(null);
const usersLoading = ref(false);
const usersError = ref<string | null>(null);
const hospitalOptions = ref<SystemAdminHospital[]>([]);
const hospitalOptionsPage = ref(0);
const hasMoreHospitalOptions = ref(true);
const hospitalOptionsLoading = ref(false);
const healthStatus = ref<string | null>(null);
const healthError = ref<string | null>(null);
const healthLoading = ref(false);
const hospitalSaving = ref(false);
const userSaving = ref(false);
const roleSavingId = ref<number | null>(null);
const hospitalSuccess = ref<string | null>(null);
const userSuccess = ref<string | null>(null);
const roleSuccess = ref<string | null>(null);
const roleError = ref<string | null>(null);
const userSearch = ref("");
const roleSearch = ref("");
const roleDrafts = reactive<Record<number, BackendUserRole>>({});
const hospitalDrafts = reactive<Record<number, number | null>>({});
const hospitalRoleErrors = reactive<Record<number, string>>({});

const hospitalForm = reactive({
  name: "",
  registrationNumber: "",
  hospitalType: "PUBLIC" as SystemAdminHospitalType,
  address: "",
  county: "",
  town: "",
  phone: "",
  email: "",
  status: "ACTIVE" as SystemAdminHospitalStatus,
});
const userForm = reactive({
  username: "",
  email: "",
  fullName: "",
  role: "PATIENT" as BackendUserRole,
  hospitalId: null as number | null,
  password: "",
});

function setNavigationRoot(element: unknown) {
  mobileNavigationRoot.value = element instanceof HTMLElement ? element : null;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "The MediQueue service could not be reached. Check the connection and try again.";
    }
    if (error.response.status === 401) {
      return "Your session could not be verified. Sign in again.";
    }
    if (error.response.status === 403) {
      return "The backend denied this action for the current account.";
    }
    if (error.response.status === 400 || error.response.status === 409) {
      return "The backend rejected the request. Review the entered details and try again.";
    }
    return fallback;
  }
  return fallback;
}

function requiresHospital(role: BackendUserRole): boolean {
  return [
    "HOSPITAL_ADMIN",
    "DOCTOR",
    "RECEPTIONIST",
    "MEDICAL_STAFF",
    "RESPONDER",
  ].includes(role);
}

function formatRole(role: string): string {
  return role
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

async function loadOverview() {
  overviewLoading.value = true;
  overviewError.value = null;
  try {
    const [hospitals, users] = await Promise.all([
      systemAdminService.getHospitals(0, 1),
      systemAdminService.getUsers(0, 1),
    ]);
    overviewHospitalCount.value = hospitals.totalElements;
    overviewUserCount.value = users.totalElements;
  } catch (error) {
    overviewError.value = getErrorMessage(
      error,
      "System overview data could not be loaded.",
    );
    overviewHospitalCount.value = null;
    overviewUserCount.value = null;
  } finally {
    overviewLoading.value = false;
  }
}

async function loadHospitals(page = 0, search = "") {
  hospitalsLoading.value = true;
  hospitalsError.value = null;
  hospitalPage.value = null;
  try {
    hospitalPage.value = await systemAdminService.getHospitals(
      page,
      PAGE_SIZE,
      search.trim() || undefined,
    );
  } catch (error) {
    hospitalsError.value = getErrorMessage(
      error,
      "The hospital directory could not be loaded.",
    );
  } finally {
    hospitalsLoading.value = false;
  }
}

async function loadUsers(page = 0, search = "") {
  usersLoading.value = true;
  usersError.value = null;
  userPage.value = null;
  try {
    const result = await systemAdminService.getUsers(
      page,
      PAGE_SIZE,
      search.trim() || undefined,
    );
    userPage.value = result;
    result.content.forEach((user) => {
      roleDrafts[user.id] = user.role as BackendUserRole;
      hospitalDrafts[user.id] = user.hospitalId;
      delete hospitalRoleErrors[user.id];
    });
  } catch (error) {
    usersError.value = getErrorMessage(
      error,
      "The user directory could not be loaded.",
    );
  } finally {
    usersLoading.value = false;
  }
}

async function loadMoreHospitalOptions(reset = false) {
  if (hospitalOptionsLoading.value) return;
  if (reset) {
    hospitalOptions.value = [];
    hospitalOptionsPage.value = 0;
    hasMoreHospitalOptions.value = true;
  }
  if (!hasMoreHospitalOptions.value) return;

  hospitalOptionsLoading.value = true;
  try {
    const result = await systemAdminService.getHospitals(
      hospitalOptionsPage.value,
      HOSPITAL_OPTION_PAGE_SIZE,
    );
    hospitalOptions.value = [...hospitalOptions.value, ...result.content];
    hospitalOptionsPage.value = result.page + 1;
    hasMoreHospitalOptions.value = !result.last;
  } catch (error) {
    usersError.value = getErrorMessage(
      error,
      "Hospital choices could not be loaded.",
    );
  } finally {
    hospitalOptionsLoading.value = false;
  }
}

async function loadSystemHealth() {
  healthLoading.value = true;
  healthError.value = null;
  try {
    const health = await systemAdminService.getSystemHealth();
    healthStatus.value = health.status;
  } catch (error) {
    healthStatus.value = null;
    healthError.value = getErrorMessage(
      error,
      "The public health endpoint is unavailable.",
    );
  } finally {
    healthLoading.value = false;
  }
}

function navigateTo(section: SystemAdminSection) {
  activeSection.value = section;
  void closeMobileNavigation();
  if (section === "hospitals") void loadHospitals();
  if (section === "users" || section === "roles") {
    void loadUsers(
      0,
      section === "roles" ? roleSearch.value : userSearch.value,
    );
    if (!hospitalOptions.value.length) void loadMoreHospitalOptions(true);
  }
  if (section === "monitoring") void loadSystemHealth();
}

async function submitHospital() {
  hospitalSuccess.value = null;
  hospitalsError.value = null;
  hospitalSaving.value = true;
  const request: SystemAdminHospitalRequest = {
    name: hospitalForm.name.trim(),
    hospitalType: hospitalForm.hospitalType,
    status: hospitalForm.status,
    ...(hospitalForm.registrationNumber.trim()
      ? { registrationNumber: hospitalForm.registrationNumber.trim() }
      : {}),
    ...(hospitalForm.address.trim()
      ? { address: hospitalForm.address.trim() }
      : {}),
    ...(hospitalForm.county.trim()
      ? { county: hospitalForm.county.trim() }
      : {}),
    ...(hospitalForm.town.trim() ? { town: hospitalForm.town.trim() } : {}),
    ...(hospitalForm.phone.trim() ? { phone: hospitalForm.phone.trim() } : {}),
    ...(hospitalForm.email.trim() ? { email: hospitalForm.email.trim() } : {}),
  };

  try {
    const created = await systemAdminService.createHospital(request);
    hospitalSuccess.value = `${created.name} was created (ID ${created.id}).`;
    Object.assign(hospitalForm, {
      name: "",
      registrationNumber: "",
      hospitalType: "PUBLIC",
      address: "",
      county: "",
      town: "",
      phone: "",
      email: "",
      status: "ACTIVE",
    });
    await Promise.all([loadHospitals(), loadOverview()]);
    if (hospitalOptions.value.length) {
      await loadMoreHospitalOptions(true);
    }
  } catch (error) {
    hospitalsError.value = getErrorMessage(
      error,
      "The hospital was not created.",
    );
  } finally {
    hospitalSaving.value = false;
  }
}

async function submitUser() {
  userSuccess.value = null;
  usersError.value = null;
  userSaving.value = true;
  const request: SystemAdminUserRequest = {
    username: userForm.username.trim(),
    email: userForm.email.trim(),
    fullName: userForm.fullName.trim(),
    role: userForm.role,
    enabled: true,
    hospitalId: requiresHospital(userForm.role) ? userForm.hospitalId : null,
    password: userForm.password,
    onDuty: false,
  };

  try {
    const created = await systemAdminService.createUser(request);
    userSuccess.value = `${created.fullName} was created with role ${formatRole(created.role)}.`;
    Object.assign(userForm, {
      username: "",
      email: "",
      fullName: "",
      role: "PATIENT",
      hospitalId: null,
      password: "",
    });
    await Promise.all([loadUsers(0, userSearch.value), loadOverview()]);
  } catch (error) {
    usersError.value = getErrorMessage(error, "The user was not created.");
  } finally {
    userSaving.value = false;
  }
}

async function saveUserRole(user: SystemAdminUser) {
  const role = (roleDrafts[user.id] ?? user.role) as BackendUserRole;
  const hospitalDraft = hospitalDrafts[user.id];
  const hospitalId =
    role === "SYSTEM_ADMIN"
      ? null
      : hospitalDraft === undefined
        ? user.hospitalId
        : hospitalDraft;

  if (requiresHospital(role) && hospitalId === null) {
    hospitalRoleErrors[user.id] = "Select a hospital for this role.";
    return;
  }

  roleError.value = null;
  roleSuccess.value = null;
  roleSavingId.value = user.id;
  const request: SystemAdminUserRequest = {
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role,
    enabled: user.enabled,
    hospitalId,
    onDuty: user.onDuty,
  };

  try {
    const updated = await systemAdminService.updateUser(user.id, request);
    userPage.value = userPage.value
      ? {
          ...userPage.value,
          content: userPage.value.content.map((entry) =>
            entry.id === user.id ? updated : entry,
          ),
        }
      : userPage.value;
    roleDrafts[user.id] = updated.role as BackendUserRole;
    hospitalDrafts[user.id] = updated.hospitalId;
    delete hospitalRoleErrors[user.id];
    roleSuccess.value = `${updated.fullName}'s role was updated to ${formatRole(updated.role)}.`;
  } catch (error) {
    roleError.value = getErrorMessage(error, "The role was not updated.");
  } finally {
    roleSavingId.value = null;
  }
}

onMounted(() => {
  void loadOverview();
});
</script>

<template>
  <div
    :ref="setNavigationRoot"
    class="system-admin"
    :class="{ 'system-admin-navigation-open': mobileNavigationOpen }"
  >
    <a class="system-admin-skip-link" href="#system-admin-main">
      Skip to main content
    </a>
    <button
      v-if="mobileNavigationOpen"
      class="system-admin-scrim"
      type="button"
      tabindex="-1"
      aria-label="Close system administration navigation"
      @click="closeMobileNavigation"
    />

    <aside
      id="system-admin-navigation"
      class="system-admin-sidebar"
      :inert="isMobile && !mobileNavigationOpen ? true : undefined"
      aria-label="System administration navigation"
    >
      <div class="system-admin-brand">
        <span class="system-admin-brand-mark" aria-hidden="true">
          <ShieldCheck :size="21" />
        </span>
        <span>
          <strong>MediQueue</strong>
          <small>SYSTEM ADMIN</small>
        </span>
      </div>

      <p class="system-admin-nav-label">PLATFORM</p>
      <nav class="system-admin-navigation" aria-label="System admin sections">
        <button
          v-for="item in navigation"
          :key="item.id"
          class="system-admin-nav-link"
          :class="{ 'is-active': activeSection === item.id }"
          :aria-current="activeSection === item.id ? 'page' : undefined"
          type="button"
          @click="navigateTo(item.id)"
        >
          <component :is="item.icon" :size="18" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="system-admin-sidebar-note" role="note">
        <span class="system-admin-status-mark" aria-hidden="true" />
        <span>
          <strong>Protected workspace</strong>
          <small>System Admin account</small>
        </span>
      </div>
      <LogoutAction button-class="system-admin-nav-link system-admin-logout">
        <LogOut :size="18" aria-hidden="true" />
        <span>Log out</span>
      </LogoutAction>
    </aside>

    <div class="system-admin-main">
      <header class="system-admin-topbar">
        <button
          class="system-admin-menu-button"
          type="button"
          :aria-expanded="mobileNavigationOpen"
          aria-controls="system-admin-navigation"
          :aria-label="
            mobileNavigationOpen ? 'Close navigation' : 'Open navigation'
          "
          @click="toggleMobileNavigation"
        >
          <X v-if="mobileNavigationOpen" :size="20" aria-hidden="true" />
          <Menu v-else :size="20" aria-hidden="true" />
        </button>
        <div class="system-admin-topbar-heading">
          <span class="system-admin-eyebrow">MEDIQUEUE / PLATFORM</span>
          <h1>{{ activeNavigationItem.label }}</h1>
        </div>
        <div class="system-admin-topbar-actions">
          <ThemeSwitcher />
          <div
            class="system-admin-account"
            aria-label="Signed-in system administrator"
          >
            <span class="system-admin-account-mark" aria-hidden="true">
              {{ administratorInitial }}
            </span>
            <span>
              <strong>{{ administratorName }}</strong>
              <small>System Administrator</small>
            </span>
          </div>
        </div>
      </header>

      <main id="system-admin-main" class="system-admin-content">
        <template v-if="activeSection === 'overview'">
          <section class="system-admin-welcome">
            <div>
              <span class="system-admin-eyebrow">PLATFORM OVERVIEW</span>
              <h2>System administration</h2>
              <p>
                Manage platform-wide accounts and hospital records using System
                Admin-authorized backend services.
              </p>
            </div>
            <span class="system-admin-role-badge">
              <ShieldCheck :size="16" aria-hidden="true" />
              System Admin
            </span>
          </section>

          <p v-if="overviewError" class="system-admin-alert" role="alert">
            {{ overviewError }}
          </p>
          <section
            class="system-admin-metrics"
            aria-label="Verified platform totals"
          >
            <article class="system-admin-metric-card">
              <span class="system-admin-metric-icon">
                <Building2 :size="19" aria-hidden="true" />
              </span>
              <span class="system-admin-metric-label"
                >Registered hospitals</span
              >
              <strong>{{
                overviewLoading ? "…" : (overviewHospitalCount ?? "—")
              }}</strong>
              <small>Reported by the hospital directory API</small>
            </article>
            <article class="system-admin-metric-card">
              <span class="system-admin-metric-icon">
                <UsersRound :size="19" aria-hidden="true" />
              </span>
              <span class="system-admin-metric-label">User accounts</span>
              <strong>{{
                overviewLoading ? "…" : (overviewUserCount ?? "—")
              }}</strong>
              <small>Reported by the System Admin user API</small>
            </article>
            <article class="system-admin-metric-card system-admin-metric-note">
              <span class="system-admin-metric-icon">
                <Activity :size="19" aria-hidden="true" />
              </span>
              <span class="system-admin-metric-label">System health</span>
              <strong>Check available</strong>
              <small>Overall status only; no detailed telemetry API</small>
              <button type="button" @click="navigateTo('monitoring')">
                View health check
              </button>
            </article>
          </section>

          <section class="system-admin-panel system-admin-overview-panel">
            <div class="system-admin-section-heading">
              <div>
                <span class="system-admin-eyebrow">ADMINISTRATION</span>
                <h2>Platform workspaces</h2>
              </div>
              <p>
                Changes are submitted to the backend and require its
                authorization.
              </p>
            </div>
            <div class="system-admin-quick-links">
              <button type="button" @click="navigateTo('hospitals')">
                <Building2 :size="19" aria-hidden="true" />
                <span
                  ><strong>Hospital management</strong
                  ><small>View and register hospital records</small></span
                >
              </button>
              <button type="button" @click="navigateTo('users')">
                <UsersRound :size="19" aria-hidden="true" />
                <span
                  ><strong>User management</strong
                  ><small>Review and create user accounts</small></span
                >
              </button>
              <button type="button" @click="navigateTo('roles')">
                <KeyRound :size="19" aria-hidden="true" />
                <span
                  ><strong>Role management</strong
                  ><small>Update backend user roles</small></span
                >
              </button>
            </div>
          </section>
        </template>

        <template v-else-if="activeSection === 'hospitals'">
          <section class="system-admin-page-heading">
            <div>
              <span class="system-admin-eyebrow">ORGANIZATION</span>
              <h2>Hospital Management</h2>
              <p>
                Hospital directory and registration use the System
                Admin-authorized hospital API.
              </p>
            </div>
            <span class="system-admin-availability-badge"
              >Backend connected by request</span
            >
          </section>

          <p v-if="hospitalsError" class="system-admin-alert" role="alert">
            {{ hospitalsError }}
            <button type="button" @click="loadHospitals()">Retry</button>
          </p>
          <p v-if="hospitalSuccess" class="system-admin-success" role="status">
            {{ hospitalSuccess }}
          </p>

          <section class="system-admin-panel">
            <div class="system-admin-section-heading">
              <div>
                <span class="system-admin-eyebrow">VERIFIED RECORDS</span>
                <h2>Hospital directory</h2>
              </div>
              <span class="system-admin-count">
                {{ hospitalPage?.totalElements ?? "—" }} records
              </span>
            </div>
            <p
              v-if="hospitalsLoading"
              class="system-admin-loading"
              role="status"
            >
              Loading hospital records…
            </p>
            <div
              v-else-if="hospitalPage?.content.length"
              class="system-admin-table-wrap"
            >
              <table class="system-admin-table">
                <thead>
                  <tr>
                    <th scope="col">Hospital</th>
                    <th scope="col">Type</th>
                    <th scope="col">Location</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="hospital in hospitalPage.content"
                    :key="hospital.id"
                  >
                    <td>
                      <strong>{{ hospital.name }}</strong>
                      <small
                        >ID {{ hospital.id }} ·
                        {{
                          hospital.registrationNumber ||
                          "No registration number"
                        }}</small
                      >
                    </td>
                    <td>{{ formatRole(hospital.hospitalType) }}</td>
                    <td>
                      {{
                        [hospital.town, hospital.county]
                          .filter(Boolean)
                          .join(", ") || "Not provided"
                      }}
                    </td>
                    <td>
                      <span
                        class="system-admin-status-pill"
                        :class="`is-${hospital.status.toLowerCase()}`"
                        >{{ hospital.status }}</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p
              v-else-if="hospitalPage"
              class="system-admin-empty"
              role="status"
            >
              No hospital records were returned by the backend.
            </p>
            <div class="system-admin-pagination">
              <span
                >Page {{ (hospitalPage?.page ?? 0) + 1 }} of
                {{ Math.max(hospitalPage?.totalPages ?? 0, 1) }}</span
              >
              <div>
                <button
                  type="button"
                  :disabled="
                    !hospitalPage || hospitalPage.page === 0 || hospitalsLoading
                  "
                  aria-label="Previous hospital page"
                  @click="loadHospitals((hospitalPage?.page ?? 1) - 1)"
                >
                  <ChevronLeft :size="17" aria-hidden="true" /> Previous
                </button>
                <button
                  type="button"
                  :disabled="
                    !hospitalPage || hospitalPage.last || hospitalsLoading
                  "
                  aria-label="Next hospital page"
                  @click="loadHospitals((hospitalPage?.page ?? 0) + 1)"
                >
                  Next <ChevronRight :size="17" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>

          <section class="system-admin-panel">
            <div class="system-admin-section-heading">
              <div>
                <span class="system-admin-eyebrow">CREATE RECORD</span>
                <h2>Register a hospital</h2>
              </div>
              <span class="system-admin-count">Saved by backend</span>
            </div>
            <form
              class="system-admin-form-grid"
              @submit.prevent="submitHospital"
            >
              <label class="system-admin-field">
                <span>Hospital name <b aria-hidden="true">*</b></span>
                <input
                  v-model="hospitalForm.name"
                  required
                  maxlength="150"
                  autocomplete="organization"
                />
              </label>
              <label class="system-admin-field">
                <span>Registration number</span>
                <input
                  v-model="hospitalForm.registrationNumber"
                  maxlength="50"
                />
              </label>
              <label class="system-admin-field">
                <span>Hospital type <b aria-hidden="true">*</b></span>
                <select v-model="hospitalForm.hospitalType" required>
                  <option
                    v-for="type in hospitalTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ formatRole(type) }}
                  </option>
                </select>
              </label>
              <label class="system-admin-field">
                <span>Status <b aria-hidden="true">*</b></span>
                <select v-model="hospitalForm.status" required>
                  <option
                    v-for="status in hospitalStatuses"
                    :key="status"
                    :value="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </label>
              <label class="system-admin-field">
                <span>Address</span>
                <input
                  v-model="hospitalForm.address"
                  maxlength="255"
                  autocomplete="street-address"
                />
              </label>
              <label class="system-admin-field">
                <span>County</span>
                <input v-model="hospitalForm.county" maxlength="100" />
              </label>
              <label class="system-admin-field">
                <span>Town</span>
                <input v-model="hospitalForm.town" maxlength="100" />
              </label>
              <label class="system-admin-field">
                <span>Phone</span>
                <input
                  v-model="hospitalForm.phone"
                  type="tel"
                  maxlength="30"
                  autocomplete="tel"
                />
              </label>
              <label class="system-admin-field">
                <span>Contact email</span>
                <input
                  v-model="hospitalForm.email"
                  type="email"
                  maxlength="150"
                  autocomplete="email"
                />
              </label>
              <div class="system-admin-form-actions">
                <button
                  class="system-admin-primary-button"
                  type="submit"
                  :disabled="hospitalSaving"
                >
                  {{ hospitalSaving ? "Saving…" : "Register hospital" }}
                </button>
                <span
                  >Only a successful backend response is reported as
                  saved.</span
                >
              </div>
            </form>
          </section>
        </template>

        <template v-else-if="activeSection === 'users'">
          <section class="system-admin-page-heading">
            <div>
              <span class="system-admin-eyebrow">IDENTITY</span>
              <h2>User Management</h2>
              <p>Review and create accounts through the backend user API.</p>
            </div>
            <span class="system-admin-availability-badge"
              >System Admin authorization required</span
            >
          </section>
          <p v-if="usersError" class="system-admin-alert" role="alert">
            {{ usersError }}
          </p>
          <p v-if="userSuccess" class="system-admin-success" role="status">
            {{ userSuccess }}
          </p>

          <section class="system-admin-panel">
            <div class="system-admin-section-heading">
              <div>
                <span class="system-admin-eyebrow">ACCOUNT DIRECTORY</span>
                <h2>User accounts</h2>
              </div>
              <span class="system-admin-count"
                >{{ userPage?.totalElements ?? "—" }} records</span
              >
            </div>
            <form
              class="system-admin-search"
              @submit.prevent="loadUsers(0, userSearch)"
            >
              <label for="system-user-search">Search users</label>
              <input
                id="system-user-search"
                v-model="userSearch"
                type="search"
                placeholder="Name, username, or email"
              />
              <button
                class="system-admin-secondary-button"
                type="submit"
                :disabled="usersLoading"
              >
                Search
              </button>
            </form>
            <p v-if="usersLoading" class="system-admin-loading" role="status">
              Loading user records…
            </p>
            <div
              v-else-if="userPage?.content.length"
              class="system-admin-table-wrap"
            >
              <table class="system-admin-table">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Role</th>
                    <th scope="col">Hospital</th>
                    <th scope="col">Account</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in userPage.content" :key="user.id">
                    <td>
                      <strong>{{ user.fullName }}</strong
                      ><small
                        >{{ user.username }} · {{ user.email }} · ID
                        {{ user.id }}</small
                      >
                    </td>
                    <td>{{ formatRole(user.role) }}</td>
                    <td>{{ user.hospitalId ?? "Unassigned" }}</td>
                    <td>
                      <span
                        class="system-admin-status-pill"
                        :class="user.enabled ? 'is-active' : 'is-inactive'"
                        >{{ user.enabled ? "Enabled" : "Disabled" }}</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else-if="userPage" class="system-admin-empty" role="status">
              No user records were returned by the backend.
            </p>
            <div class="system-admin-pagination">
              <span
                >Page {{ (userPage?.page ?? 0) + 1 }} of
                {{ Math.max(userPage?.totalPages ?? 0, 1) }}</span
              >
              <div>
                <button
                  type="button"
                  :disabled="!userPage || userPage.page === 0 || usersLoading"
                  aria-label="Previous user page"
                  @click="loadUsers((userPage?.page ?? 1) - 1, userSearch)"
                >
                  <ChevronLeft :size="17" aria-hidden="true" /> Previous
                </button>
                <button
                  type="button"
                  :disabled="!userPage || userPage.last || usersLoading"
                  aria-label="Next user page"
                  @click="loadUsers((userPage?.page ?? 0) + 1, userSearch)"
                >
                  Next <ChevronRight :size="17" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>

          <section class="system-admin-panel">
            <div class="system-admin-section-heading">
              <div>
                <span class="system-admin-eyebrow">CREATE ACCOUNT</span>
                <h2>Create a user</h2>
              </div>
              <span class="system-admin-count">Saved by backend</span>
            </div>
            <form class="system-admin-form-grid" @submit.prevent="submitUser">
              <label class="system-admin-field"
                ><span>Full name <b aria-hidden="true">*</b></span
                ><input
                  v-model="userForm.fullName"
                  required
                  maxlength="100"
                  autocomplete="name"
              /></label>
              <label class="system-admin-field"
                ><span>Username <b aria-hidden="true">*</b></span
                ><input
                  v-model="userForm.username"
                  required
                  minlength="3"
                  maxlength="50"
                  pattern="[a-zA-Z0-9._-]+"
                  autocomplete="username"
              /></label>
              <label class="system-admin-field"
                ><span>Email <b aria-hidden="true">*</b></span
                ><input
                  v-model="userForm.email"
                  required
                  type="email"
                  maxlength="255"
                  autocomplete="email"
              /></label>
              <label class="system-admin-field"
                ><span>Initial password <b aria-hidden="true">*</b></span
                ><input
                  v-model="userForm.password"
                  required
                  type="password"
                  minlength="8"
                  maxlength="72"
                  autocomplete="new-password"
              /></label>
              <label class="system-admin-field"
                ><span>Backend role <b aria-hidden="true">*</b></span
                ><select v-model="userForm.role" required>
                  <option v-for="role in roleOptions" :key="role" :value="role">
                    {{ formatRole(role) }}
                  </option>
                </select></label
              >
              <label
                v-if="requiresHospital(userForm.role)"
                class="system-admin-field"
                ><span>Hospital assignment <b aria-hidden="true">*</b></span
                ><select v-model.number="userForm.hospitalId" required>
                  <option value="" disabled>Select a hospital</option>
                  <option
                    v-for="hospital in hospitalOptions"
                    :key="hospital.id"
                    :value="hospital.id"
                  >
                    {{ hospital.name }} · {{ hospital.id }}
                  </option>
                </select></label
              >
              <p
                v-if="
                  requiresHospital(userForm.role) && !hospitalOptions.length
                "
                class="system-admin-form-note"
                role="status"
              >
                Load hospital records before creating an account that requires a
                hospital assignment.
              </p>
              <button
                v-if="hasMoreHospitalOptions"
                class="system-admin-text-button"
                type="button"
                :disabled="hospitalOptionsLoading"
                @click="loadMoreHospitalOptions()"
              >
                {{
                  hospitalOptionsLoading
                    ? "Loading hospitals…"
                    : "Load more hospital choices"
                }}
              </button>
              <div class="system-admin-form-actions">
                <button
                  class="system-admin-primary-button"
                  type="submit"
                  :disabled="
                    userSaving ||
                    (requiresHospital(userForm.role) &&
                      (!userForm.hospitalId || !hospitalOptions.length))
                  "
                >
                  {{ userSaving ? "Creating…" : "Create user" }}</button
                ><span
                  >Initial passwords are sent only to the backend and are not
                  stored in the browser session.</span
                >
              </div>
            </form>
          </section>
        </template>

        <template v-else-if="activeSection === 'roles'">
          <section class="system-admin-page-heading">
            <div>
              <span class="system-admin-eyebrow">ACCESS CONTROL</span>
              <h2>Role Management</h2>
              <p>
                Role changes are submitted as user updates to the System
                Admin-protected backend endpoint.
              </p>
            </div>
            <span class="system-admin-availability-badge"
              >Backend authorization enforced</span
            >
          </section>
          <p v-if="usersError" class="system-admin-alert" role="alert">
            {{ usersError }}
          </p>
          <p v-if="roleError" class="system-admin-alert" role="alert">
            {{ roleError }}
          </p>
          <p v-if="roleSuccess" class="system-admin-success" role="status">
            {{ roleSuccess }}
          </p>
          <section class="system-admin-panel">
            <div class="system-admin-section-heading">
              <div>
                <span class="system-admin-eyebrow">USER ROLES</span>
                <h2>Assign backend roles</h2>
              </div>
              <span class="system-admin-count"
                >{{ userPage?.totalElements ?? "—" }} users</span
              >
            </div>
            <form
              class="system-admin-search"
              @submit.prevent="loadUsers(0, roleSearch)"
            >
              <label for="system-role-search">Search users</label
              ><input
                id="system-role-search"
                v-model="roleSearch"
                type="search"
                placeholder="Name, username, or email"
              /><button
                class="system-admin-secondary-button"
                type="submit"
                :disabled="usersLoading"
              >
                Search
              </button>
            </form>
            <p class="system-admin-inline-note">
              Hospital assignment is required for Hospital Admin, Doctor,
              Receptionist, Medical Staff, and Responder roles. The backend
              validates every change.
            </p>
            <p v-if="usersLoading" class="system-admin-loading" role="status">
              Loading user roles…
            </p>
            <div
              v-else-if="userPage?.content.length"
              class="system-admin-table-wrap"
            >
              <table class="system-admin-table system-admin-role-table">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Backend role</th>
                    <th scope="col">Hospital assignment</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in userPage.content" :key="user.id">
                    <td>
                      <strong>{{ user.fullName }}</strong
                      ><small>{{ user.email }} · ID {{ user.id }}</small>
                    </td>
                    <td>
                      <label class="sr-only" :for="`role-${user.id}`"
                        >Role for {{ user.fullName }}</label
                      ><select
                        :id="`role-${user.id}`"
                        v-model="roleDrafts[user.id]"
                      >
                        <option
                          v-for="role in roleOptions"
                          :key="role"
                          :value="role"
                        >
                          {{ formatRole(role) }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <label class="sr-only" :for="`hospital-${user.id}`"
                        >Hospital for {{ user.fullName }}</label
                      ><select
                        :id="`hospital-${user.id}`"
                        v-model.number="hospitalDrafts[user.id]"
                        :disabled="roleDrafts[user.id] === 'SYSTEM_ADMIN'"
                      >
                        <option :value="null">No hospital</option>
                        <option
                          v-for="hospital in hospitalOptions"
                          :key="hospital.id"
                          :value="hospital.id"
                        >
                          {{ hospital.name }} · {{ hospital.id }}
                        </option></select
                      ><small
                        v-if="hospitalRoleErrors[user.id]"
                        class="system-admin-field-error"
                        >{{ hospitalRoleErrors[user.id] }}</small
                      >
                    </td>
                    <td>
                      <button
                        class="system-admin-secondary-button"
                        type="button"
                        :disabled="
                          roleSavingId === user.id ||
                          (roleDrafts[user.id] === user.role &&
                            hospitalDrafts[user.id] === user.hospitalId)
                        "
                        @click="saveUserRole(user)"
                      >
                        {{ roleSavingId === user.id ? "Saving…" : "Save role" }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                v-if="hasMoreHospitalOptions"
                class="system-admin-text-button"
                type="button"
                :disabled="hospitalOptionsLoading"
                @click="loadMoreHospitalOptions()"
              >
                {{
                  hospitalOptionsLoading
                    ? "Loading hospitals…"
                    : "Load more hospital choices"
                }}
              </button>
            </div>
            <p v-else-if="userPage" class="system-admin-empty" role="status">
              No user records were returned by the backend.
            </p>
            <div class="system-admin-pagination">
              <span
                >Page {{ (userPage?.page ?? 0) + 1 }} of
                {{ Math.max(userPage?.totalPages ?? 0, 1) }}</span
              >
              <div>
                <button
                  type="button"
                  :disabled="!userPage || userPage.page === 0 || usersLoading"
                  aria-label="Previous roles page"
                  @click="loadUsers((userPage?.page ?? 1) - 1, roleSearch)"
                >
                  <ChevronLeft :size="17" aria-hidden="true" /> Previous</button
                ><button
                  type="button"
                  :disabled="!userPage || userPage.last || usersLoading"
                  aria-label="Next roles page"
                  @click="loadUsers((userPage?.page ?? 0) + 1, roleSearch)"
                >
                  Next <ChevronRight :size="17" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        </template>

        <template v-else-if="activeSection === 'monitoring'">
          <section class="system-admin-page-heading">
            <div>
              <span class="system-admin-eyebrow">SERVICE HEALTH</span>
              <h2>System Monitoring</h2>
              <p>
                The backend exposes a public overall health endpoint. This view
                does not display component-level details or claim to be
                comprehensive monitoring.
              </p>
            </div>
            <button
              class="system-admin-secondary-button"
              type="button"
              :disabled="healthLoading"
              @click="loadSystemHealth"
            >
              {{ healthLoading ? "Checking…" : "Refresh health" }}
            </button>
          </section>
          <section class="system-admin-panel system-admin-health-card">
            <span class="system-admin-metric-icon"
              ><Activity :size="20" aria-hidden="true"
            /></span>
            <div>
              <span class="system-admin-eyebrow">OVERALL BACKEND HEALTH</span>
              <h2 v-if="healthLoading">Checking service…</h2>
              <h2 v-else-if="healthStatus">{{ healthStatus }}</h2>
              <h2 v-else>Unavailable</h2>
              <p v-if="healthError" class="system-admin-alert" role="alert">
                {{ healthError }}
              </p>
              <p v-else-if="healthStatus">
                Status returned by the public
                <code>/actuator/health</code> endpoint.
              </p>
              <p v-else>Use Refresh health to query the backend.</p>
            </div>
          </section>
        </template>

        <template v-else-if="activeSection === 'audit'">
          <section class="system-admin-page-heading">
            <div>
              <span class="system-admin-eyebrow">GOVERNANCE</span>
              <h2>Audit Logs</h2>
              <p>
                Review of administrative activity requires a backend audit
                service.
              </p>
            </div>
            <span class="system-admin-availability-badge is-pending"
              >Not yet connected</span
            >
          </section>
          <section class="system-admin-panel system-admin-placeholder">
            <ScrollText :size="24" aria-hidden="true" />
            <div>
              <h2>Audit log API unavailable</h2>
              <p>
                The current backend does not expose an audit-log endpoint. No
                events are fabricated or displayed.
              </p>
            </div>
          </section>
        </template>

        <template v-else>
          <section class="system-admin-page-heading">
            <div>
              <span class="system-admin-eyebrow">PLATFORM CONFIGURATION</span>
              <h2>System Settings</h2>
              <p>
                System-wide configuration changes require a dedicated backend
                settings API.
              </p>
            </div>
            <span class="system-admin-availability-badge is-pending"
              >Not yet connected</span
            >
          </section>
          <section class="system-admin-panel system-admin-placeholder">
            <Settings :size="24" aria-hidden="true" />
            <div>
              <h2>Settings API unavailable</h2>
              <p>
                The current backend does not expose a system settings endpoint.
                This section does not save browser-only configuration as server
                settings.
              </p>
            </div>
          </section>
        </template>

        <footer class="system-admin-footer">
          <span>MediQueue · System administration</span>
          <span>Backend authorization remains authoritative</span>
        </footer>
      </main>
    </div>
  </div>
</template>
