import { reactive } from "vue";

export const patient = reactive({
  name: "",
  id: "",
  username: "",
  phone: "",
  email: "",
  birthDate: "",
  gender: "",
  emergencyContact: "",
});

export const queue = reactive({
  active: false,
  ticketId: null,
  hospitalId: null,
  departmentId: null,
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
  joinedAt: "",
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
    username: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    emergencyContact: "",
  });
  Object.assign(queue, {
    active: false,
    ticketId: null,
    hospitalId: null,
    departmentId: null,
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
    joinedAt: "",
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

export function setPatientQueue(ticket, hospitalName = "", hospitalId = null) {
  const position = Number(ticket.position ?? 0);
  const active = ticket.status === "WAITING" || ticket.status === "CALLED";
  Object.assign(queue, {
    active,
    ticketId: ticket.id,
    hospitalId: ticket.hospitalId ?? hospitalId,
    departmentId: ticket.departmentId,
    hospital: hospitalName,
    department: ticket.departmentName,
    service: "",
    number: 0,
    position,
    ahead: Math.max(position - 1, 0),
    wait: Number(ticket.estimatedWaitMinutes ?? 0),
    status: ticket.status,
    joinedAt: ticket.joinedAt,
    progress: position > 0 ? Math.max(0, Math.min(100, 100 / position)) : 0,
  });
  return queue;
}

export function clearPatientQueue(status = "CANCELLED") {
  Object.assign(queue, {
    active: false,
    ticketId: null,
    hospitalId: null,
    departmentId: null,
    hospital: "",
    department: "",
    service: "",
    visitType: "",
    queueType: "",
    number: 0,
    position: 0,
    ahead: 0,
    wait: 0,
    status,
    joinedAt: "",
    progress: 0,
  });
  return queue;
}
