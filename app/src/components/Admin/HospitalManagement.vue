<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { Building2, ClipboardList, Search } from "@lucide/vue";
import StateEmpty from "@/components/ui/StateEmpty.vue";
import { hospitalManagementService } from "@/services/hospitalManagement.service";
import type {
  Hospital,
  HospitalLocation,
  HospitalRegistrationInput,
} from "@/types/models";

interface HospitalRegistrationForm {
  name: string;
  registrationIdentifier: string;
  address: string;
  city: string;
  region: string;
  country: string;
}

const hospitals = ref<Hospital[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const directoryLoaded = ref(false);
const directoryError = ref<string | null>(null);
const registrationMessage = ref<string | null>(null);
const searchQuery = ref("");
const form = reactive<HospitalRegistrationForm>({
  name: "",
  registrationIdentifier: "",
  address: "",
  city: "",
  region: "",
  country: "",
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
    return [hospital.name, hospital.registrationIdentifier, location]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(query);
  });
});

function locationSummary(location?: HospitalLocation): string {
  if (!location) return "Location not provided";
  const parts = [
    location.address,
    location.city,
    location.region,
    location.country,
  ].filter((part): part is string => Boolean(part?.trim()));
  return parts.length ? parts.join(", ") : "Location not provided";
}

async function loadHospitals() {
  isLoading.value = true;
  directoryError.value = null;
  try {
    hospitals.value = await hospitalManagementService.getHospitals();
    directoryLoaded.value = true;
  } catch (error) {
    directoryLoaded.value = false;
    directoryError.value =
      error instanceof Error
        ? error.message
        : "Unable to load the hospital directory.";
    console.error("Error loading hospital directory:", error);
  } finally {
    isLoading.value = false;
  }
}

function makeRegistrationInput(): HospitalRegistrationInput {
  const locationParts = {
    address: form.address.trim(),
    city: form.city.trim(),
    region: form.region.trim(),
    country: form.country.trim(),
  };
  const location = Object.values(locationParts).some(Boolean)
    ? locationParts
    : undefined;

  return {
    name: form.name.trim(),
    ...(form.registrationIdentifier.trim()
      ? { registrationIdentifier: form.registrationIdentifier.trim() }
      : {}),
    ...(location ? { location } : {}),
  };
}

async function submitRegistration() {
  registrationMessage.value = null;
  const isValid = await validation.value.$validate();
  if (!isValid) return;

  isSubmitting.value = true;
  try {
    const input = makeRegistrationInput();
    await hospitalManagementService.registerHospital(input);
    registrationMessage.value =
      "Registration details were accepted by the hospital service.";
    await loadHospitals();
  } catch (error) {
    registrationMessage.value =
      error instanceof Error
        ? `${error.message} Your validated details were not submitted or saved.`
        : "Hospital registration is unavailable. Your details were not submitted or saved.";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  void loadHospitals();
});
</script>

<template>
  <section
    class="admin-page-heading"
    aria-labelledby="hospital-management-title"
  >
    <div>
      <span class="admin-eyebrow">ORGANIZATION</span>
      <h2 id="hospital-management-title">Hospital Management</h2>
      <p>
        Review hospital information and prepare registration details. Hospital
        records and registration are unavailable until the backend service is
        connected.
      </p>
    </div>
    <span class="admin-availability-badge">Backend integration pending</span>
  </section>

  <section class="admin-hospital-layout" aria-label="Hospital management">
    <section
      class="admin-hospital-panel"
      aria-labelledby="hospital-directory-title"
    >
      <div class="admin-section-heading">
        <div class="admin-section-title">
          <span class="admin-section-icon" aria-hidden="true">
            <Building2 :size="19" />
          </span>
          <div>
            <span class="admin-eyebrow">HOSPITAL RECORDS</span>
            <h2 id="hospital-directory-title">Hospital directory</h2>
          </div>
        </div>
        <span class="admin-unavailable-badge">Verified data only</span>
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
        Loading hospital directory…
      </p>
      <div v-else-if="directoryError" class="admin-hospital-error" role="alert">
        <strong>Hospital directory unavailable</strong>
        <p>{{ directoryError }}</p>
        <button type="button" @click="loadHospitals">Retry</button>
      </div>
      <div v-else-if="directoryLoaded && !filteredHospitals.length">
        <StateEmpty
          :title="
            hospitals.length
              ? 'No hospitals match your search'
              : 'No hospital records available'
          "
          :description="
            hospitals.length
              ? 'Try another search term.'
              : 'The connected service returned no hospital records.'
          "
        />
      </div>
      <div v-else class="admin-hospital-pending" role="status">
        <ClipboardList :size="21" aria-hidden="true" />
        <p>
          Hospital records will appear here when the authorized directory
          service is configured. No hospital records are currently available.
        </p>
      </div>

      <ul
        v-if="!isLoading && !directoryError && filteredHospitals.length"
        class="admin-hospital-list"
        aria-label="Hospitals"
      >
        <li v-for="hospital in filteredHospitals" :key="hospital.id">
          <div>
            <strong>{{ hospital.name }}</strong>
            <small>Hospital ID: {{ hospital.id }}</small>
            <small>{{ locationSummary(hospital.location) }}</small>
            <small v-if="hospital.registrationIdentifier">
              Registration identifier: {{ hospital.registrationIdentifier }}
            </small>
          </div>
          <span class="admin-hospital-status" :class="`is-${hospital.status}`">
            {{ hospital.status }}
          </span>
        </li>
      </ul>
    </section>

    <section
      class="admin-hospital-panel"
      aria-labelledby="hospital-registration-title"
    >
      <div class="admin-section-heading">
        <div class="admin-section-title">
          <span class="admin-section-icon" aria-hidden="true">
            <ClipboardList :size="19" />
          </span>
          <div>
            <span class="admin-eyebrow">REGISTRATION</span>
            <h2 id="hospital-registration-title">Prepare hospital details</h2>
          </div>
        </div>
      </div>
      <p class="admin-hospital-form-intro">
        Validate details locally. This form does not register a hospital or
        verify its identity.
      </p>

      <form
        class="admin-hospital-form"
        novalidate
        @submit.prevent="submitRegistration"
      >
        <div class="admin-hospital-field">
          <label for="hospital-name"
            >Hospital name <span aria-hidden="true">*</span></label
          >
          <input
            id="hospital-name"
            v-model="form.name"
            name="name"
            autocomplete="organization"
            required
            :aria-invalid="validation.name.$error"
            :aria-describedby="
              validation.name.$error ? 'hospital-name-error' : undefined
            "
            @blur="validation.name.$touch()"
          />
          <p
            v-if="validation.name.$error"
            id="hospital-name-error"
            class="admin-hospital-field-error"
            role="alert"
          >
            {{ validation.name.$errors[0]?.$message }}
          </p>
        </div>

        <div class="admin-hospital-field">
          <label for="hospital-registration-identifier">
            Registration identifier <span>(optional)</span>
          </label>
          <input
            id="hospital-registration-identifier"
            v-model="form.registrationIdentifier"
            name="registrationIdentifier"
            autocomplete="off"
          />
        </div>

        <fieldset class="admin-hospital-location">
          <legend>Location <span>(optional)</span></legend>
          <div class="admin-hospital-field">
            <label for="hospital-address">Address</label>
            <input
              id="hospital-address"
              v-model="form.address"
              name="address"
              autocomplete="street-address"
            />
          </div>
          <div class="admin-hospital-location-grid">
            <div class="admin-hospital-field">
              <label for="hospital-city">City</label>
              <input
                id="hospital-city"
                v-model="form.city"
                name="city"
                autocomplete="address-level2"
              />
            </div>
            <div class="admin-hospital-field">
              <label for="hospital-region">Region</label>
              <input
                id="hospital-region"
                v-model="form.region"
                name="region"
                autocomplete="address-level1"
              />
            </div>
            <div class="admin-hospital-field">
              <label for="hospital-country">Country</label>
              <input
                id="hospital-country"
                v-model="form.country"
                name="country"
                autocomplete="country-name"
              />
            </div>
          </div>
        </fieldset>

        <p
          v-if="registrationMessage"
          class="admin-hospital-registration-message"
          role="status"
          aria-live="polite"
        >
          {{ registrationMessage }}
        </p>

        <button
          class="admin-hospital-submit"
          type="submit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Checking details…" : "Validate details" }}
        </button>
        <p class="admin-hospital-form-note">
          Backend registration is not connected. No registration request will be
          saved or reported as successful.
        </p>
      </form>
    </section>
  </section>
</template>
