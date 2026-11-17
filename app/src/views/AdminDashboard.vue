<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  Stethoscope,
  UsersRound,
} from "@lucide/vue";
import type { Component } from "vue";
import LogoutAction from "@/components/common/LogoutAction.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useMobileNavigation } from "@/composables/useMobileNavigation";
import ThemeSwitcher from "@/components/common/ThemeSwitcher.vue";
import StateEmpty from "@/components/ui/StateEmpty.vue";
import HospitalManagement from "@/components/Admin/HospitalManagement.vue";
import {
  mediqueueService,
  type DepartmentRecord,
  type EmergencyRecord,
  type HospitalRecord,
  type QueueTicketRecord,
  type UserRecord,
} from "@/services/mediqueue.service";
import "@/assets/admin.css";

type AdminSection =
  | "overview"
  | "users"
  | "hospitals"
  | "departments"
  | "medical-staff"
  | "appointments"
  | "queues"
  | "emergencies"
  | "settings";

interface AdminNavigationItem {
  id: AdminSection;
  label: string;
  icon: Component;
}

const navigation: AdminNavigationItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: UsersRound },
  { id: "hospitals", label: "Hospital Management", icon: Building2 },
  { id: "departments", label: "Department Management", icon: Building2 },
  { id: "medical-staff", label: "Medical Staff", icon: Stethoscope },
  { id: "appointments", label: "Appointment Oversight", icon: CalendarDays },
  { id: "queues", label: "Queue Oversight", icon: ClipboardList },
  { id: "emergencies", label: "Emergency Oversight", icon: ShieldAlert },
  { id: "settings", label: "System Settings", icon: Settings },
];

const auth = useAuthStore();
const activeSection = ref<AdminSection>("overview");
const hospitals = ref<HospitalRecord[]>([]);
const hospitalId = ref<number | null>(null);
const hospitalSummary = ref<{
  hospitalId: number;
  waitingTickets: number;
  openEmergencyCases: number;
  onDutyDoctors: number;
} | null>(null);
const users = ref<UserRecord[]>([]);
const departments = ref<DepartmentRecord[]>([]);
const staff = ref<UserRecord[]>([]);
const doctors = ref<UserRecord[]>([]);
const queueItems = ref<(QueueTicketRecord & { departmentName: string })[]>([]);
const emergencyCases = ref<EmergencyRecord[]>([]);
const isLoading = ref(true);
const isLoadingSection = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const sectionError = ref("");
const actionMessage = ref("");
const userForm = reactive({
  username: "",
  fullName: "",
  email: "",
  password: "",
  role: "PATIENT",
  hospitalId: null as number | null,
  enabled: true,
});
const departmentForm = reactive({
  name: "",
  code: "",
  description: "",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
});
const staffForm = reactive({
  username: "",
  fullName: "",
  email: "",
  password: "",
  role: "RECEPTIONIST",
});

const isSystemAdmin = computed(() => auth.user?.backendRole === "SYSTEM_ADMIN");
const requiresHospitalAssignment = computed(() =>
  ["DOCTOR", "RECEPTIONIST", "MEDICAL_STAFF", "RESPONDER", "HOSPITAL_ADMIN"].includes(
    userForm.role,
  ),
);
const activeNavigationItem = computed(
  () => navigation.find((item) => item.id === activeSection.value)!,
);
const administratorName = computed(
  () =>
    [auth.user?.firstName, auth.user?.lastName].filter(Boolean).join(" ") ||
    auth.user?.username ||
    "Administrator",
);
const administratorInitial = computed(
  () => administratorName.value.charAt(0).toUpperCase() || "?",
);
const {
  isMobile: mobileViewport,
  isOpen: mobileNavigationOpen,
  root: mobileNavigationRoot,
  toggle: toggleMobileNavigation,
  close: closeMobileNavigation,
} = useMobileNavigation({
  breakpoint: 800,
  trigger: ".admin-menu-button",
  firstNavigationItem: ".admin-navigation .admin-nav-link",
});

function setNavigationRoot(element: unknown) {
  mobileNavigationRoot.value = element instanceof HTMLElement ? element : null;
}

function navigateTo(section: AdminSection) {
  activeSection.value = section;
  void closeMobileNavigation();
  if (section !== "hospitals") void loadSection(section);
}

async function loadHospitalData(selectedHospitalId: number) {
  isLoadingSection.value = true;
  sectionError.value = "";
  const [summaryResult, departmentResult, staffResult, doctorResult, emergencyResult] =
    await Promise.allSettled([
      mediqueueService.getHospitalSummary(selectedHospitalId),
      mediqueueService.getHospitalDepartments(selectedHospitalId),
      mediqueueService.getHospitalStaff(selectedHospitalId),
      mediqueueService.getHospitalDoctorsAdmin(selectedHospitalId),
      mediqueueService.getHospitalEmergencyCases(selectedHospitalId),
    ]);

  if (summaryResult.status === "fulfilled") hospitalSummary.value = summaryResult.value;
  else hospitalSummary.value = null;
  if (departmentResult.status === "fulfilled") departments.value = departmentResult.value;
  else departments.value = [];
  if (staffResult.status === "fulfilled") staff.value = staffResult.value;
  else staff.value = [];
  if (doctorResult.status === "fulfilled") doctors.value = doctorResult.value;
  else doctors.value = [];
  if (emergencyResult.status === "fulfilled") emergencyCases.value = emergencyResult.value;
  else emergencyCases.value = [];

  const failed = [
    summaryResult.status === "rejected" ? "dashboard summary" : "",
    departmentResult.status === "rejected" ? "departments" : "",
    staffResult.status === "rejected" ? "staff" : "",
    doctorResult.status === "rejected" ? "doctors" : "",
    emergencyResult.status === "rejected" ? "emergency cases" : "",
  ].filter(Boolean);
  if (failed.length) sectionError.value = `Unable to load ${failed.join(", ")}.`;

  if (departmentResult.status === "fulfilled") {
    const records = departmentResult.value;
    const results = await Promise.allSettled(
      records.map((department) =>
        mediqueueService.getDepartmentQueue(department.id),
      ),
    );
    queueItems.value = results.flatMap((result, index) => {
      const department = records[index];
      if (!department || result.status === "rejected") return [];
      return result.value.map((ticket) => ({
        ...ticket,
        departmentName: department.name,
      }));
    });
    if (results.some((result) => result.status === "rejected")) {
      sectionError.value = sectionError.value
        ? `${sectionError.value} Some department queues could not be loaded.`
        : "Some department queues could not be loaded.";
    }
  } else {
    queueItems.value = [];
  }
  isLoadingSection.value = false;
}

async function loadSection(section: AdminSection) {
  sectionError.value = "";
  actionMessage.value = "";
  if (section === "overview" || section === "hospitals") return;
  if (section === "users") {
    if (!isSystemAdmin.value) {
      sectionError.value = "User administration is restricted to system administrators.";
      users.value = [];
      return;
    }
    isLoadingSection.value = true;
    try {
      users.value = await mediqueueService.getUsers();
    } catch (error) {
      sectionError.value =
        error instanceof Error ? error.message : "Unable to load user records.";
    } finally {
      isLoadingSection.value = false;
    }
    return;
  }
  if (section === "appointments" || section === "settings") return;
  if (!hospitalId.value) {
    sectionError.value = "Select an authorized hospital first.";
    return;
  }
  await loadHospitalData(hospitalId.value);
}

async function loadDashboard() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    if (!auth.user?.backendRole) {
      await auth.refreshBackendProfile();
    }
    if (isSystemAdmin.value) {
      hospitals.value = await mediqueueService.getAdminHospitals();
    } else if (auth.user?.hospitalId) {
      hospitals.value = [
        await mediqueueService.getHospital(auth.user.hospitalId),
      ];
    } else {
      throw new Error("This administrator account has no assigned hospital.");
    }
    const selected = auth.user?.hospitalId ?? hospitals.value[0]?.id ?? null;
    hospitalId.value = selected;
    if (selected !== null) {
      await loadHospitalData(selected);
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unable to load administration data.";
  } finally {
    isLoading.value = false;
  }
}

async function createUser() {
  if (!userForm.password) {
    sectionError.value = "A password is required for a new user account.";
    return;
  }
  if (requiresHospitalAssignment.value && !userForm.hospitalId) {
    sectionError.value = "Select a hospital for this user role.";
    return;
  }
  isSubmitting.value = true;
  sectionError.value = "";
  try {
    await mediqueueService.createUser({
      ...userForm,
      username: userForm.username.trim(),
      fullName: userForm.fullName.trim(),
      email: userForm.email.trim(),
      hospitalId: requiresHospitalAssignment.value
        ? userForm.hospitalId
        : null,
    });
    actionMessage.value = "User account created.";
    Object.assign(userForm, {
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "PATIENT",
      hospitalId: null,
      enabled: true,
    });
    users.value = await mediqueueService.getUsers();
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to create user.";
  } finally {
    isSubmitting.value = false;
  }
}

async function toggleUser(user: UserRecord) {
  sectionError.value = "";
  try {
    await mediqueueService.updateUser(user.id, {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      enabled: !user.enabled,
      hospitalId: user.hospitalId,
      onDuty: user.onDuty,
    });
    users.value = await mediqueueService.getUsers();
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to update this user.";
  }
}

async function createDepartment() {
  if (!hospitalId.value) return;
  isSubmitting.value = true;
  sectionError.value = "";
  try {
    await mediqueueService.createDepartment({
      hospitalId: hospitalId.value,
      name: departmentForm.name.trim(),
      code: departmentForm.code.trim(),
      description: departmentForm.description.trim(),
      status: departmentForm.status,
    });
    Object.assign(departmentForm, { name: "", code: "", description: "" });
    actionMessage.value = "Department created.";
    await loadHospitalData(hospitalId.value);
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to create department.";
  } finally {
    isSubmitting.value = false;
  }
}

async function createStaffMember() {
  if (!hospitalId.value) return;
  if (!staffForm.password) {
    sectionError.value = "A password is required for a new staff account.";
    return;
  }
  isSubmitting.value = true;
  sectionError.value = "";
  try {
    const request = {
      ...staffForm,
      username: staffForm.username.trim(),
      fullName: staffForm.fullName.trim(),
      email: staffForm.email.trim(),
      enabled: true,
      hospitalId: hospitalId.value,
      onDuty: false,
    };
    if (staffForm.role === "DOCTOR") {
      await mediqueueService.createHospitalDoctor(hospitalId.value, request);
    } else {
      await mediqueueService.createHospitalStaff(hospitalId.value, request);
    }
    Object.assign(staffForm, {
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "RECEPTIONIST",
    });
    actionMessage.value = "Staff account created.";
    await loadHospitalData(hospitalId.value);
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to create staff account.";
  } finally {
    isSubmitting.value = false;
  }
}

async function toggleDoctorAvailability(doctor: UserRecord) {
  if (!hospitalId.value) return;
  sectionError.value = "";
  try {
    await mediqueueService.setDoctorAvailability(
      hospitalId.value,
      doctor.id,
      !doctor.onDuty,
    );
    await loadHospitalData(hospitalId.value);
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to update doctor availability.";
  }
}

async function resolveCase(item: EmergencyRecord) {
  if (!hospitalId.value) return;
  sectionError.value = "";
  try {
    await mediqueueService.resolveEmergency(hospitalId.value, item.id);
    actionMessage.value = `Emergency case #${item.id} resolved.`;
    await loadHospitalData(hospitalId.value);
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to resolve this case.";
  }
}

onMounted(() => void loadDashboard());
</script>

<template>
  <div :ref="setNavigationRoot" class="admin-dashboard">
    <a class="admin-skip-link" href="#admin-main-content">Skip to main content</a>
    <button
      v-if="mobileNavigationOpen"
      class="admin-scrim"
      type="button"
      aria-label="Close admin navigation"
      tabindex="-1"
      @click="closeMobileNavigation"
    />
    <aside
      id="admin-navigation"
      class="admin-sidebar"
      :class="{ 'admin-sidebar-open': mobileNavigationOpen }"
      :inert="mobileViewport && !mobileNavigationOpen ? true : undefined"
      aria-label="Admin workspace navigation"
    >
      <div class="admin-brand">
        <span class="admin-brand-mark"><img :src="'/mediqueue-logo.png'" alt="" /></span>
        <span class="admin-brand-copy"><strong>MediQueue</strong><small>ADMINISTRATION</small></span>
      </div>
      <p class="admin-nav-label">WORKSPACE</p>
      <nav class="admin-navigation" aria-label="Admin workspace">
        <button
          v-for="item in navigation"
          :key="item.id"
          class="admin-nav-link"
          :class="{ 'admin-nav-link-active': activeSection === item.id }"
          :aria-current="activeSection === item.id ? 'page' : undefined"
          type="button"
          @click="navigateTo(item.id)"
        >
          <component :is="item.icon" :size="18" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </button>
      </nav>
      <div class="admin-connection-note" role="status">
        <span class="admin-connection-mark" />
        <span><strong>Administration data</strong><small>{{ isLoading ? "Loading" : "Connected" }}</small></span>
      </div>
      <LogoutAction button-class="admin-nav-link admin-logout">
        <LogOut :size="18" aria-hidden="true" /><span>Log out</span>
      </LogoutAction>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <button
          class="admin-menu-button"
          type="button"
          :aria-expanded="mobileNavigationOpen"
          aria-controls="admin-navigation"
          :aria-label="mobileNavigationOpen ? 'Close navigation' : 'Open navigation'"
          @click="toggleMobileNavigation"
        ><span aria-hidden="true">{{ mobileNavigationOpen ? "Ã—" : "â˜°" }}</span></button>
        <div class="admin-topbar-heading">
          <span class="admin-eyebrow">MEDIQUEUE / ADMIN</span><h1>{{ activeNavigationItem.label }}</h1>
        </div>
        <div class="admin-topbar-actions">
          <ThemeSwitcher />
          <div class="admin-account" aria-label="Signed-in administrator">
            <span class="admin-account-mark">{{ administratorInitial }}</span>
            <span><strong>{{ administratorName }}</strong><small>{{ auth.user?.backendRole || "Administrator" }}</small></span>
          </div>
        </div>
      </header>

      <main id="admin-main-content" class="admin-content">
        <p v-if="isLoading" class="admin-integration-banner" role="status">Loading live administration dataâ€¦</p>
        <p v-if="errorMessage" class="admin-integration-banner" role="alert">
          {{ errorMessage }} <button type="button" @click="loadDashboard">Retry</button>
        </p>
        <p v-if="sectionError" class="admin-integration-banner" role="alert">
          {{ sectionError }} <button v-if="hospitalId" type="button" @click="loadSection(activeSection)">Retry</button>
        </p>
        <p v-if="actionMessage" class="form-message service-notice" role="status">{{ actionMessage }}</p>

        <template v-if="activeSection === 'overview'">
          <section class="admin-page-heading">
            <div>
              <span class="admin-eyebrow">ADMINISTRATION WORKSPACE</span>
              <h2>Hospital administration overview</h2>
              <p>Live metrics for the selected hospital.</p>
            </div>
            <label v-if="isSystemAdmin" class="admin-hospital-select">
              <span>Hospital</span>
              <select v-model.number="hospitalId" @change="hospitalId && loadHospitalData(hospitalId)">
                <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital.id">{{ hospital.name }}</option>
              </select>
            </label>
            <span v-else class="admin-availability-badge">{{ hospitals[0]?.name || "Assigned hospital" }}</span>
          </section>
          <section v-if="hospitalSummary" class="admin-overview-panel">
            <div class="admin-section-heading"><div><span class="admin-eyebrow">LIVE METRICS</span><h2>{{ hospitals.find(item => item.id === hospitalId)?.name || "Hospital" }}</h2></div></div>
            <div class="admin-metrics-grid">
              <article><span>Waiting tickets</span><strong>{{ hospitalSummary.waitingTickets }}</strong></article>
              <article><span>Open emergency cases</span><strong>{{ hospitalSummary.openEmergencyCases }}</strong></article>
              <article><span>Doctors on duty</span><strong>{{ hospitalSummary.onDutyDoctors }}</strong></article>
              <article><span>Departments</span><strong>{{ departments.length }}</strong></article>
            </div>
          </section>
          <StateEmpty v-else title="Hospital summary unavailable" description="No summary was returned for the selected hospital." />
        </template>

        <HospitalManagement v-else-if="activeSection === 'hospitals'" />

        <template v-else-if="activeSection === 'users'">
          <section class="admin-page-heading"><div><span class="admin-eyebrow">ACCESS & ACCOUNTS</span><h2>User Management</h2><p>Review and create user accounts using the system administration API.</p></div></section>
          <section class="admin-overview-panel">
            <h2>Create a user</h2>
            <form class="admin-form-grid" @submit.prevent="createUser">
              <input v-model="userForm.username" placeholder="Username" minlength="3" maxlength="50" required />
              <input v-model="userForm.fullName" placeholder="Full name" maxlength="100" required />
              <input v-model="userForm.email" type="email" placeholder="Email" maxlength="255" required />
              <input v-model="userForm.password" type="password" placeholder="Temporary password" minlength="8" maxlength="72" required />
              <select v-model="userForm.role">
  <option value="PATIENT">PATIENT</option>
  <option value="DOCTOR">DOCTOR</option>
  <option value="RECEPTIONIST">RECEPTIONIST</option>
  <option value="MEDICAL_STAFF">MEDICAL_STAFF</option>
  <option value="RESPONDER">RESPONDER</option>
  <option value="HOSPITAL_ADMIN">HOSPITAL_ADMIN</option>
  <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
</select>
<select
  v-if="requiresHospitalAssignment"
  v-model.number="userForm.hospitalId"
  required
  :disabled="!hospitals.length"
  aria-label="Assign user to a hospital"
>
  <option :value="null" disabled>Select a hospital</option>
  <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital.id">
    {{ hospital.name }}
  </option>
</select>
              <button class="button button-primary" type="submit" :disabled="isSubmitting">{{ isSubmitting ? "Creatingâ€¦" : "Create user" }}</button>
            </form>
            <ul class="admin-record-list">
              <li v-for="user in users" :key="user.id">
                <strong>{{ user.fullName }}</strong><span>{{ user.username }} Â· {{ user.email }} Â· {{ user.role }} Â· {{ user.enabled ? "Enabled" : "Disabled" }}</span>
                <button class="button button-secondary button-small" type="button" @click="toggleUser(user)">{{ user.enabled ? "Disable" : "Enable" }}</button>
              </li>
            </ul>
            <StateEmpty v-if="!users.length && !isLoadingSection" title="No user records" description="No users were returned by the administration service." />
          </section>
        </template>

        <template v-else-if="activeSection === 'departments'">
          <section class="admin-page-heading">
            <div><span class="admin-eyebrow">ORGANIZATION</span><h2>Department Management</h2><p>Manage departments for an authorized hospital.</p></div>
            <select v-if="isSystemAdmin" v-model.number="hospitalId" @change="hospitalId && loadHospitalData(hospitalId)">
              <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital.id">{{ hospital.name }}</option>
            </select>
          </section>
          <section class="admin-overview-panel">
            <h2>Create department</h2>
            <form class="admin-form-grid" @submit.prevent="createDepartment">
              <input v-model="departmentForm.name" placeholder="Department name" maxlength="150" required />
              <input v-model="departmentForm.code" placeholder="Department code" maxlength="30" required />
              <input v-model="departmentForm.description" placeholder="Description (optional)" maxlength="500" />
              <select v-model="departmentForm.status"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select>
              <button class="button button-primary" type="submit" :disabled="isSubmitting || !hospitalId">{{ isSubmitting ? "Creatingâ€¦" : "Create department" }}</button>
            </form>
            <ul class="admin-record-list">
              <li v-for="department in departments" :key="department.id"><strong>{{ department.name }}</strong><span>{{ department.code }} Â· {{ department.status || "ACTIVE" }}</span></li>
            </ul>
            <StateEmpty v-if="!departments.length" title="No department records" description="No departments were returned for this hospital." />
          </section>
        </template>

        <template v-else-if="activeSection === 'medical-staff'">
          <section class="admin-page-heading">
            <div><span class="admin-eyebrow">CARE TEAMS</span><h2>Medical Staff</h2><p>Review hospital staff and manage doctor availability.</p></div>
            <select v-if="isSystemAdmin" v-model.number="hospitalId" @change="hospitalId && loadHospitalData(hospitalId)">
              <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital.id">{{ hospital.name }}</option>
            </select>
          </section>
          <section class="admin-overview-panel">
            <h2>Create hospital staff or doctor account</h2>
            <form class="admin-form-grid" @submit.prevent="createStaffMember">
              <input v-model="staffForm.username" placeholder="Username" minlength="3" maxlength="50" required />
              <input v-model="staffForm.fullName" placeholder="Full name" maxlength="100" required />
              <input v-model="staffForm.email" type="email" placeholder="Email" maxlength="255" required />
              <input v-model="staffForm.password" type="password" placeholder="Temporary password" minlength="8" maxlength="72" required />
              <select v-model="staffForm.role"><option>RECEPTIONIST</option><option>MEDICAL_STAFF</option><option>RESPONDER</option><option>DOCTOR</option></select>
              <button class="button button-primary" type="submit" :disabled="isSubmitting || !hospitalId">{{ isSubmitting ? "Creatingâ€¦" : "Create account" }}</button>
            </form>
            <ul class="admin-record-list">
              <li v-for="member in staff" :key="member.id"><strong>{{ member.fullName }}</strong><span>{{ member.email }} Â· {{ member.role }} Â· {{ member.enabled ? "Enabled" : "Disabled" }}</span></li>
              <li v-for="doctor in doctors" :key="doctor.id"><strong>{{ doctor.fullName }}</strong><span>{{ doctor.email }} Â· Doctor Â· {{ doctor.onDuty ? "On duty" : "Off duty" }}</span><button class="button button-secondary button-small" type="button" @click="toggleDoctorAvailability(doctor)">{{ doctor.onDuty ? "Set off duty" : "Set on duty" }}</button></li>
            </ul>
            <StateEmpty v-if="!staff.length && !doctors.length" title="No medical staff records" description="No staff or doctor records were returned." />
          </section>
        </template>

        <template v-else-if="activeSection === 'queues'">
          <section class="admin-page-heading"><div><span class="admin-eyebrow">PATIENT FLOW</span><h2>Queue Oversight</h2><p>Live tickets for the selected hospital.</p></div><button class="button button-secondary" type="button" :disabled="!hospitalId" @click="hospitalId && loadHospitalData(hospitalId)">Refresh</button></section>
          <section class="admin-overview-panel"><ul class="admin-record-list"><li v-for="ticket in queueItems" :key="ticket.id"><strong>Ticket #{{ ticket.id }} Â· Patient #{{ ticket.patientId }}</strong><span>{{ ticket.departmentName }} Â· {{ ticket.status }}<template v-if="ticket.position"> Â· Position {{ ticket.position }}</template></span></li></ul><StateEmpty v-if="!queueItems.length" title="No queue tickets" description="No queue tickets were returned for this hospital." /></section>
        </template>

        <template v-else-if="activeSection === 'emergencies'">
          <section class="admin-page-heading"><div><span class="admin-eyebrow">EMERGENCY SERVICES</span><h2>Emergency Oversight</h2><p>Review and resolve hospital emergency cases. This does not dispatch emergency services.</p></div></section>
          <section class="admin-overview-panel"><ul class="admin-record-list"><li v-for="item in emergencyCases" :key="item.id"><strong>#{{ item.id }} Â· {{ item.title }}</strong><span>{{ item.severity }} Â· {{ item.status }}</span><button v-if="item.status !== 'RESOLVED'" class="button button-secondary button-small" type="button" @click="resolveCase(item)">Resolve</button></li></ul><StateEmpty v-if="!emergencyCases.length" title="No emergency cases" description="No cases were returned for the selected hospital." /></section>
        </template>

        <template v-else-if="activeSection === 'appointments'">
          <section class="admin-page-heading"><div><span class="admin-eyebrow">SCHEDULING</span><h2>Appointment Oversight</h2><p>The current backend provides patient-owned appointment listing and booking, but no hospital-wide appointment oversight endpoint.</p></div></section>
          <StateEmpty title="Hospital-wide appointment listing is not available" description="Patients can view and manage their own appointments. An admin-wide appointment API is needed to show this section." />
        </template>

        <template v-else-if="activeSection === 'settings'">
          <section class="admin-page-heading"><div><span class="admin-eyebrow">CONFIGURATION</span><h2>System Settings</h2><p>No system-settings endpoint is currently published by the backend.</p></div></section>
          <StateEmpty title="System settings are not available" description="No backend endpoint exists to read or update system-wide settings." />
        </template>

        <footer class="admin-footer"><span>MediQueue Â· Admin workspace</span><span>Live authorized administration data</span></footer>
      </main>
    </div>
  </div>
</template>
