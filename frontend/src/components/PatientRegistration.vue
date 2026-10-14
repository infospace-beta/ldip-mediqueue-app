<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from './Button.vue'
import InputField from './InputField.vue'
import SelectField from './SelectField.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const departmentOptions = [
  { label: 'Cardiology', value: 'Cardiology' },
  { label: 'General Consultation', value: 'General Consultation' },
  { label: 'Pediatrics', value: 'Pediatrics' },
  { label: 'Emergency', value: 'Emergency' },
]

const form = ref({
  name: '',
  mrn: '',
  phone: '',
  age: '',
  department: '',
  appointmentDate: '',
  appointmentTime: '',
  notes: '',
})

const errors = ref<Record<string, string>>({})
const successMessage = ref('')

const formReady = computed(() => Object.values(form.value).some((value) => value !== ''))

function validate() {
  const nextErrors: Record<string, string> = {}

  if (!form.value.name.trim()) nextErrors.name = 'Please enter a valid value.'
  if (!form.value.mrn.trim()) nextErrors.mrn = 'Patient ID could not be verified.'
  if (!form.value.phone.trim()) nextErrors.phone = 'Please enter a valid value.'
  if (!form.value.age.trim()) nextErrors.age = 'Please enter a valid value.'
  if (!form.value.department) nextErrors.department = 'Please select a department.'
  if (!form.value.appointmentDate) nextErrors.appointmentDate = 'Please select a valid date.'

  errors.value = nextErrors
  successMessage.value = Object.keys(nextErrors).length === 0 ? 'Patient registered successfully.' : ''
  return Object.keys(nextErrors).length === 0
}

function submit() {
  if (!validate()) return
  emit('close')
}
</script>

<template>
  <div v-if="open" class="modal-overlay" @click="emit('close')">
    <div class="modal-card modal-card--wide" role="dialog" aria-modal="true" @click.stop>
      <div class="modal-card__header">
        <div>
          <p class="eyebrow">Patient registration</p>
          <h3>Register new patient</h3>
        </div>
        <button type="button" class="modal-close" aria-label="Close" @click="emit('close')">✕</button>
      </div>

      <form class="registration-form" @submit.prevent="submit">
        <div class="form-grid">
          <InputField v-model="form.name" label="Patient Full Name" required :error="errors.name" />
          <InputField v-model="form.mrn" label="Patient ID / MRN" required :error="errors.mrn" />
          <InputField v-model="form.phone" label="Phone" type="tel" required :error="errors.phone" />
          <InputField v-model="form.age" label="Age" type="number" required :error="errors.age" />
          <SelectField v-model="form.department" label="Department" :options="departmentOptions" required :error="errors.department" />
          <InputField v-model="form.appointmentDate" label="Appointment Date" type="date" required :error="errors.appointmentDate" />
          <InputField v-model="form.appointmentTime" label="Appointment Time" type="time" />
        </div>

        <label class="field field--full">
          <span class="field__label">Clinical Notes</span>
          <textarea v-model="form.notes" rows="4" placeholder="Add triage or clinical notes"></textarea>
        </label>

        <div class="form-actions">
          <p v-if="successMessage" class="form-success">{{ successMessage }}</p>
          <div class="form-actions__buttons">
            <Button variant="secondary" @click="emit('close')">Cancel</Button>
            <Button variant="primary" :disabled="!formReady" @click="submit">Register patient</Button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
