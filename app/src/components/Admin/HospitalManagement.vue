<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { Building2, ClipboardList, Search } from "@lucide/vue";
import StateEmpty from "@/components/ui/StateEmpty.vue";
import { hospitalManagementService } from "@/services/hospitalManagement.service";
import { useAuthStore } from "@/stores/auth.store";
import type {
  Hospital,
  HospitalRegistrationInput,
} from "@/types/models";

interface HospitalRegistrationForm {
  name: string;
  registrationNumber: string;
  hospitalType: HospitalRegistrationInput["hospitalType"];
  address: string;
  county: string;
  town: string;
  phone: string;
  email: string;
  status: HospitalRegistrationInput["status"];
}

const auth = useAuthStore();
const hospitals = ref<Hospital[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const directoryLoaded = ref(false);
const directoryError = ref<string | null>(null);
const registrationMessage = ref<string | null>(null);
const searchQuery = ref("");
const isSystemAdmin = computed(
  () => auth.user?.backendRole === "SYSTEM_ADMIN",
);
const form = reactive<HospitalRegistrationForm>({
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

const rules = {
  name: {
    required: helpers.withMessage(
      "Enter a hospital name.",
      (value: string) => value.trim().length > 0,
    ),
  },
};
const validation = useVuelidate(rules, form);

const filteredHospitals = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase();
  if (!query) return hospitals.value;
  return hospitals.value.filter((hospital) => {
    const location = hospital.location
      ? Object.values(hospital.location).join(" ")
      : "";
    return [
      hospital.name,
      hospital.registrationIdentifier,
      location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(query);
  });
});

function locationSummary(hospital: Hospital): string {
  const parts = [
    hospital.location?.address,
    hospital.location?.city,
    hospital.location?.region,
  ].filter((part): part is string => Boolean(part?.trim()));
  return parts.length ? parts.join(", ") : "Location not provided";
}

async function loadHospitals() {
  isLoading.value = true;
  directoryError.value = null;
  try {
    if (isSystemAdmin.value) {
      hospitals.value = await hospitalManagementService.getHospitals();
    } else if (auth.user?.hospitalId) {
      hospitals.value = [
        await hospitalManagementService.getHospital(auth.user.hospitalId),
      ];
    } else {
      throw new Error(
        "No hospital is associated with this administrator account.",
      );
    }
    directoryLoaded.value = true;
  } catch (error) {
    directoryLoaded.value = false;
    directoryError.value =
      error instanceof Error
        ? error.message
        : "Unable to load hospital information.";
    console.error("Error loading hospital information:", error);
  } finally {
    isLoading.value = false;
  }
}

async function submitRegistration() {
  registrationMessage.value = null;
  const isValid = await validation.value.$validate();
  if (!isValid) return;

  isSubmitting.value = true;
  try {
    const input: HospitalRegistrationInput = {
      name: form.name.trim(),
      registrationNumber: form.registrationNumber.trim() || undefined,
      hospitalType: form.hospitalType,
      address: form.address.trim() || undefined,
      county: form.county.trim() || undefined,
      town: form.town.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      status: form.status,
    };
    await hospitalManagementService.registerHospital(input);
    registrationMessage.value = "Hospital registered successfully.";
    form.name = "";
    form.registrationNumber = "";
    form.address = "";
    form.county = "";
    form.town = "";
    form.phone = "";
    form.email = "";
    await loadHospitals();
  } catch (error) {
    registrationMessage.value =
      error instanceof Error
        ? `Hospital registration failed: ${error.message}`
        : "Hospital registration failed.";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => void loadHospitals());
</script>

<template>
  <section class="admin-page-heading" aria-labelledby="hospital-management-title">
    <div>
      <span class="admin-eyebrow">ORGANIZATION</span>
      <h2 id="hospital-management-title">Hospital Management</h2>
      <p>Review live hospital records and register hospitals using the administration service.</p>
    </div>
    <span class="admin-availability-badge">
      {{ isLoading ? "Loading" : isSystemAdmin ? "Connected" : "Hospital scope" }}
    </span>
  </section>

  <section class="admin-hospital-layout" aria-label="Hospital management">
    <section class="admin-hospital-panel" aria-labelledby="hospital-directory-title">
      <div class="admin-section-heading">
        <div class="admin-section-title">
          <span class="admin-section-icon" aria-hidden="true"><Building2 :size="19" /></span>
          <div>
            <span class="admin-eyebrow">HOSPITAL RECORDS</span>
            <h2 id="hospital-directory-title">Hospital directory</h2>
          </div>
        </div>
        <span class="admin-unavailable-badge">Live records</span>
      </div>
      <label class="admin-hospital-search" for="hospital-directory-search">
        <Search :size="17" aria-hidden="true" />
        <span class="sr-only">Search hospitals</span>
        <input
          id="hospital-directory-search"
          v-model="searchQuery"
          type="search"
          placeholder="Search hospitals"
          :disabled="isLoading || !hospitals.length"
        />
      </label>
      <p v-if="isLoading" class="admin-hospital-feedback" role="status">
        Loading hospital information…
      </p>
      <div v-else-if="directoryError" class="admin-hospital-error" role="alert">
        <strong>Hospital information unavailable</strong>
        <p>{{ directoryError }}</p>
        <button type="button" @click="loadHospitals">Retry</button>
      </div>
      <div v-else-if="directoryLoaded && !filteredHospitals.length">
        <StateEmpty
          :title="hospitals.length ? 'No hospitals match your search' : 'No hospital records available'"
          :description="hospitals.length ? 'Try another search term.' : 'The service returned no hospital records.'"
        />
      </div>
      <div v-if="!isLoading && !directoryError && filteredHospitals.length" class="admin-hospital-list-wrap">
        <ul class="admin-hospital-list" aria-label="Hospitals">
          <li v-for="hospital in filteredHospitals" :key="hospital.id">
            <div>
              <strong>{{ hospital.name }}</strong>
              <small>Hospital ID: {{ hospital.id }}</small>
              <small>{{ locationSummary(hospital) }}</small>
              <small v-if="hospital.registrationIdentifier">
                Registration: {{ hospital.registrationIdentifier }}
              </small>
            </div>
            <span class="admin-hospital-status" :class="`is-${hospital.status}`">
              {{ hospital.status }}
            </span>
          </li>
        </ul>
      </div>
      <div v-if="!isSystemAdmin && !directoryError" class="admin-hospital-feedback">
        Hospital registration is restricted to system administrators.
      </div>
    </section>

    <section v-if="isSystemAdmin" class="admin-hospital-panel" aria-labelledby="hospital-registration-title">
      <div class="admin-section-heading">
        <div class="admin-section-title">
          <span class="admin-section-icon" aria-hidden="true"><ClipboardList :size="19" /></span>
          <div>
            <span class="admin-eyebrow">REGISTRATION</span>
            <h2 id="hospital-registration-title">Register a hospital</h2>
          </div>
        </div>
      </div>
      <form class="admin-hospital-form" novalidate @submit.prevent="submitRegistration">
        <div class="admin-hospital-field">
          <label for="hospital-name">Hospital name <span aria-hidden="true">*</span></label>
          <input
            id="hospital-name"
            v-model="form.name"
            name="name"
            autocomplete="organization"
            required
            :aria-invalid="validation.name.$error"
            :aria-describedby="validation.name.$error ? 'hospital-name-error' : undefined"
            @blur="validation.name.$touch()"
          />
          <p v-if="validation.name.$error" id="hospital-name-error" class="admin-hospital-field-error" role="alert">
            {{ validation.name.$errors[0]?.$message }}
          </p>
        </div>
        <div class="admin-hospital-field">
          <label for="hospital-registration-number">Registration number</label>
          <input id="hospital-registration-number" v-model="form.registrationNumber" maxlength="50" />
        </div>
        <div class="admin-hospital-location-grid">
          <div class="admin-hospital-field">
            <label for="hospital-type">Hospital type</label>
            <select id="hospital-type" v-model="form.hospitalType">
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="FAITH_BASED">Faith based</option>
            </select>
          </div>
          <div class="admin-hospital-field">
            <label for="hospital-status">Status</label>
            <select id="hospital-status" v-model="form.status">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div class="admin-hospital-field">
            <label for="hospital-phone">Phone</label>
            <input id="hospital-phone" v-model="form.phone" type="tel" />
          </div>
          <div class="admin-hospital-field">
            <label for="hospital-email">Email</label>
            <input id="hospital-email" v-model="form.email" type="email" />
          </div>
          <div class="admin-hospital-field">
            <label for="hospital-address">Address</label>
            <input id="hospital-address" v-model="form.address" />
          </div>
          <div class="admin-hospital-field">
            <label for="hospital-town">Town</label>
            <input id="hospital-town" v-model="form.town" />
          </div>
          <div class="admin-hospital-field">
            <label for="hospital-county">County</label>
            <input id="hospital-county" v-model="form.county" />
          </div>
        </div>
        <p v-if="registrationMessage" class="admin-hospital-registration-message" role="status">
          {{ registrationMessage }}
        </p>
        <button class="admin-hospital-submit" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Registering…" : "Register hospital" }}
        </button>
        <p class="admin-hospital-form-note">
          Registration is sent to the authorized MediQueue administration service.
        </p>
      </form>
    </section>
  </section>
</template>
