<script setup>
import { computed, onMounted, ref } from "vue";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Stethoscope,
} from "@lucide/vue";
import { appointments } from "../data/patient";
import StatusBadge from "../components/StatusBadge.vue";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";

const auth = useAuthStore();
const hospitals = ref([]);
const departments = ref([]);
const doctors = ref([]);
const hospitalId = ref(null);
const departmentId = ref(null);
const doctorId = ref(null);
const startsAt = ref("");
const reason = ref("");
const isLoading = ref(true);
const isBooking = ref(false);
const isLoadingOptions = ref(false);
const pageError = ref("");
const bookingError = ref("");
const bookingNotice = ref("");

const minDateTime = computed(() => {
  const date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  return date.toISOString().slice(0, 16);
});

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Date unavailable";
}

function formatTime(value) {
  return value
    ? new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Time unavailable";
}

async function loadAppointments() {
  const patientId = auth.user?.id;
  if (!patientId) {
    pageError.value = "Your patient account could not be identified.";
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  pageError.value = "";
  try {
    const records = await mediqueueService.getPatientAppointments(patientId);
    appointments.splice(
      0,
      appointments.length,
      ...records.map((item) => ({
        id: item.id,
        doctor: item.doctorName,
        initials: item.doctorName.slice(0, 1),
        specialty: item.departmentName,
        date: formatDate(item.startsAt),
        time: formatTime(item.startsAt),
        hospital: item.hospitalName,
        status: item.status,
        startsAt: item.startsAt,
        reason: item.reason,
      })),
    );
  } catch (error) {
    pageError.value =
      error instanceof Error ? error.message : "Unable to load appointments.";
  } finally {
    isLoading.value = false;
  }
}

async function loadBookingOptions() {
  isLoadingOptions.value = true;
  bookingError.value = "";
  try {
    hospitals.value = await mediqueueService.getHospitals();
  } catch (error) {
    bookingError.value =
      error instanceof Error ? error.message : "Unable to load hospitals.";
  } finally {
    isLoadingOptions.value = false;
  }
}

async function selectHospital() {
  departments.value = [];
  doctors.value = [];
  departmentId.value = null;
  doctorId.value = null;
  bookingError.value = "";
  if (!hospitalId.value) return;
  isLoadingOptions.value = true;
  try {
    const [departmentRecords, doctorRecords] = await Promise.all([
      mediqueueService.getDepartments(hospitalId.value),
      mediqueueService.getDoctors(hospitalId.value),
    ]);
    departments.value = departmentRecords;
    doctors.value = doctorRecords;
  } catch (error) {
    bookingError.value =
      error instanceof Error
        ? error.message
        : "Unable to load booking options.";
  } finally {
    isLoadingOptions.value = false;
  }
}

async function bookAppointment() {
  bookingError.value = "";
  bookingNotice.value = "";
  if (!hospitalId.value || !departmentId.value || !doctorId.value || !startsAt.value || !reason.value.trim()) {
    bookingError.value = "Complete every appointment field before booking.";
    return;
  }
  isBooking.value = true;
  try {
    await mediqueueService.bookAppointment({
      doctorId: doctorId.value,
      departmentId: departmentId.value,
      startsAt: new Date(startsAt.value).toISOString(),
      reason: reason.value.trim(),
    });
    bookingNotice.value = "Your appointment was booked.";
    startsAt.value = "";
    reason.value = "";
    await loadAppointments();
  } catch (error) {
    bookingError.value =
      error instanceof Error ? error.message : "Unable to book this appointment.";
  } finally {
    isBooking.value = false;
  }
}

async function cancelAppointment(appointmentId) {
  bookingError.value = "";
  try {
    await mediqueueService.cancelAppointment(appointmentId);
    bookingNotice.value = "The appointment was cancelled.";
    await loadAppointments();
  } catch (error) {
    bookingError.value =
      error instanceof Error ? error.message : "Unable to cancel appointment.";
  }
}

onMounted(() => {
  void loadAppointments();
  void loadBookingOptions();
});
</script>

<template>
  <div class="section-page appointments-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">VISIT SCHEDULE</span>
        <h1>Appointments</h1>
        <p>View and book appointments available through MediQueue.</p>
      </div>
    </div>
    <p v-if="pageError" class="form-message form-error" role="alert">
      {{ pageError }}
      <button class="text-link" type="button" @click="loadAppointments">
        Retry
      </button>
    </p>
    <p v-if="bookingError" class="form-message form-error" role="alert">
      {{ bookingError }}
    </p>
    <output v-if="bookingNotice" class="form-message service-notice" role="status">
      {{ bookingNotice }}
    </output>

    <section class="panel appointment-booking-panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">NEW APPOINTMENT</span>
          <h2>Book a visit</h2>
        </div>
      </div>
      <form class="appointment-booking-form" @submit.prevent="bookAppointment">
        <label>
          <span>Hospital</span>
          <select v-model.number="hospitalId" :disabled="isLoadingOptions" @change="selectHospital">
            <option :value="null">Select hospital</option>
            <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital.id">
              {{ hospital.name }}
            </option>
          </select>
        </label>
        <label>
          <span>Department</span>
          <select v-model.number="departmentId" :disabled="!departments.length || isLoadingOptions">
            <option :value="null">Select department</option>
            <option v-for="department in departments" :key="department.id" :value="department.id">
              {{ department.name }}
            </option>
          </select>
        </label>
        <label>
          <span>Doctor</span>
          <select v-model.number="doctorId" :disabled="!doctors.length || isLoadingOptions">
            <option :value="null">Select doctor</option>
            <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
              {{ doctor.fullName }}
            </option>
          </select>
        </label>
        <label>
          <span>Date and time</span>
          <input v-model="startsAt" type="datetime-local" :min="minDateTime" required />
        </label>
        <label class="appointment-reason-field">
          <span>Reason for visit</span>
          <textarea v-model="reason" maxlength="500" required rows="3"></textarea>
        </label>
        <button class="button button-primary" type="submit" :disabled="isBooking || isLoadingOptions">
          {{ isBooking ? "Booking…" : "Book appointment" }}
        </button>
      </form>
    </section>

    <h2 class="appointment-list-heading">Your appointments</h2>
    <p v-if="isLoading" class="supporting-copy" role="status">
      Loading appointments…
    </p>
    <div v-else-if="appointments.length" class="appointment-list">
      <article
        v-for="appointment in appointments"
        :key="appointment.id"
        class="panel appointment-card"
      >
        <div class="appointment-card-main">
          <div class="appointment-doctor">
            <span class="doctor-avatar">{{ appointment.initials || "D" }}</span>
            <div>
              <strong>{{ appointment.doctor }}</strong>
              <span><Stethoscope :size="14" /> {{ appointment.specialty }}</span>
            </div>
          </div>
          <div class="appointment-facts">
            <span><CalendarDays :size="15" /> {{ appointment.date }}</span>
            <span><Clock3 :size="15" /> {{ appointment.time }}</span>
            <span><MapPin :size="15" /> {{ appointment.hospital }}</span>
          </div>
        </div>
        <StatusBadge :status="appointment.status" />
        <button
          v-if="appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED'"
          class="button button-secondary button-small"
          type="button"
          @click="cancelAppointment(appointment.id)"
        >
          Cancel
        </button>
      </article>
    </div>
    <section v-else class="panel empty-state">
      <span class="empty-state-icon"><CalendarDays :size="23" aria-hidden="true" /></span>
      <h2>No appointments</h2>
      <p>You do not have any appointments scheduled.</p>
    </section>
  </div>
</template>
