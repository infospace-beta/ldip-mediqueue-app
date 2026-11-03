import { reactive } from "vue";

export const patient = reactive({
  name: "",
  id: "",
  phone: "",
  email: "",
  birthDate: "",
  gender: "",
  emergencyContact: "",
});

export const queue = reactive({
  active: false,
  hospital: "",
  department: "",
  service: "",
  visitType: "",
  queueType: "",
  number: 0,
  position: 0,
  ahead: 0,
  wait: 0,
  status: "Waiting",
  progress: 0,
});

export const hospitals = reactive([]);
export const appointments = reactive([]);
export const notifications = reactive([]);
export const activities = reactive([]);
export const medicalHistory = reactive([]);
export const emergencyRequests = reactive([]);

export const unreadCount = () =>
  notifications.filter((item) => item.unread).length;

export function resetPatientSession() {
  Object.assign(patient, {
    name: "",
    id: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    emergencyContact: "",
  });
  Object.assign(queue, {
    active: false,
    hospital: "",
    department: "",
    service: "",
    visitType: "",
    queueType: "",
    number: 0,
    position: 0,
    ahead: 0,
    wait: 0,
    status: "Waiting",
    progress: 0,
  });

  for (const records of [
    hospitals,
    appointments,
    notifications,
    activities,
    medicalHistory,
    emergencyRequests,
  ]) {
    records.splice(0);
  }
}

export function joinQueue(details) {
  Object.assign(queue, details, {
    active: true,
    number: 0,
    position: 0,
    ahead: 0,
    wait: 0,
    status: "Waiting",
    progress: 0,
  });
  return queue;
}

export function updateQueuePosition() {
  return queue;
}
