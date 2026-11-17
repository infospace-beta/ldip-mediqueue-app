<script setup>
import { onMounted, reactive, ref } from "vue";
import { Check, Edit3, Mail, ShieldCheck, UserRound } from "@lucide/vue";
import { patient } from "../data/patient";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";

const auth = useAuthStore();
const editing = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);
const saved = ref(false);
const errorMessage = ref("");
const draft = reactive({ name: "", username: "", email: "" });

function resetDraft() {
  Object.assign(draft, {
    name: patient.name,
    username: patient.username,
    email: patient.email,
  });
}

async function loadProfile() {
  const patientId = auth.user?.id;
  if (!patientId) {
    errorMessage.value = "Your patient account could not be identified.";
    isLoading.value = false;
    return;
  }
  try {
    const record = await mediqueueService.getPatient(patientId);
    Object.assign(patient, {
      id: String(record.id),
      name: record.fullName,
      username: record.username,
      email: record.email,
    });
    resetDraft();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unable to load your profile.";
  } finally {
    isLoading.value = false;
  }
}

function startEditing() {
  resetDraft();
  editing.value = true;
  saved.value = false;
}

function cancelEditing() {
  resetDraft();
  editing.value = false;
}

async function saveProfile() {
  const patientId = auth.user?.id;
  if (!patientId) {
    errorMessage.value = "Your patient account could not be identified.";
    return;
  }
  errorMessage.value = "";
  saved.value = false;
  isSaving.value = true;
  try {
    const record = await mediqueueService.updatePatient(patientId, {
      username: draft.username.trim(),
      email: draft.email.trim(),
      fullName: draft.name.trim(),
    });
    Object.assign(patient, {
      name: record.fullName,
      username: record.username,
      email: record.email,
    });
    if (auth.user) {
      const nameParts = record.fullName.trim().split(/\s+/);
      auth.user = {
        ...auth.user,
        username: record.username,
        firstName: nameParts.shift() || record.username,
        lastName: nameParts.join(" "),
        email: record.email,
      };
    }
    editing.value = false;
    saved.value = true;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unable to save profile changes.";
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => void loadProfile());
</script>

<template>
  <div class="section-page profile-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">YOUR INFORMATION</span>
        <h1>My profile</h1>
        <p>Review and update account details held by MediQueue.</p>
      </div>
      <button
        v-if="!editing"
        class="button button-primary"
        type="button"
        :disabled="isLoading"
        @click="startEditing"
      >
        <Edit3 :size="16" aria-hidden="true" /> Edit profile
      </button>
      <div v-else class="profile-edit-actions">
        <button class="button button-secondary" type="button" :disabled="isSaving" @click="cancelEditing">
          Cancel
        </button>
        <button class="button button-primary" type="button" :disabled="isSaving" @click="saveProfile">
          <Check :size="16" aria-hidden="true" />
          {{ isSaving ? "Saving…" : "Save changes" }}
        </button>
      </div>
    </div>
    <p v-if="errorMessage" class="form-message form-error" role="alert">
      {{ errorMessage }}
      <button class="text-link" type="button" @click="loadProfile">Retry</button>
    </p>
    <output v-if="saved" class="form-message service-notice" role="status">
      Your profile changes were saved.
    </output>
    <p v-if="isLoading" class="supporting-copy" role="status">
      Loading your profile…
    </p>
    <template v-else>
      <section class="panel profile-identity">
        <span class="avatar avatar-large">{{
          patient.name ? patient.name.slice(0, 1).toUpperCase() : "P"
        }}</span>
        <div>
          <span class="eyebrow">PATIENT ID · {{ patient.id || "—" }}</span>
          <h2>{{ patient.name || "Patient" }}</h2>
          <p><ShieldCheck :size="15" /> Patient account</p>
        </div>
        <span class="identity-pill">MediQueue account</span>
      </section>
      <form class="profile-form-grid" @submit.prevent="saveProfile">
        <section class="panel profile-fields-panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">ACCOUNT DETAILS</span>
              <h2>About you</h2>
            </div>
            <UserRound :size="19" class="section-muted-icon" aria-hidden="true" />
          </div>
          <div class="profile-fields">
            <label>
              <span>Full name</span>
              <input v-model="draft.name" :readonly="!editing" required maxlength="100" />
            </label>
            <label>
              <span>Username</span>
              <input v-model="draft.username" :readonly="!editing" required minlength="3" maxlength="50" />
            </label>
            <label>
              <span>Patient ID</span>
              <input :value="patient.id" readonly />
            </label>
          </div>
        </section>
        <section class="panel profile-fields-panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">CONTACT DETAILS</span>
              <h2>Email address</h2>
            </div>
            <Mail :size="19" class="section-muted-icon" aria-hidden="true" />
          </div>
          <div class="profile-fields">
            <label>
              <span>Email address</span>
              <input v-model="draft.email" type="email" :readonly="!editing" required maxlength="255" />
            </label>
          </div>
        </section>
      </form>
      <p class="profile-privacy">
        <ShieldCheck :size="15" aria-hidden="true" />
        Profile changes are saved securely by the MediQueue account service.
      </p>
    </template>
  </div>
</template>
