import {
  Bell,
  CalendarDays,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  UserRound,
  UsersRound,
} from "@lucide/vue";
import type { Component } from "vue";

export type StaffSectionId =
  | "operations"
  | "queue"
  | "patient-flow"
  | "patients"
  | "departments"
  | "medical-staff"
  | "emergency"
  | "notifications"
  | "profile"
  | "settings";

export interface StaffNavigationItem {
  id: StaffSectionId;
  label: string;
  title: string;
  description: string;
  icon: Component;
}

export const staffNavigation = [
  {
    id: "operations",
    label: "Overview",
    title: "Hospital operations",
    description:
      "Live operational summaries from the assigned hospital.",
    icon: LayoutDashboard,
  },
  {
    id: "queue",
    label: "Queue monitoring",
    title: "Queue monitoring",
    description:
      "Review and manage live department queue tickets.",
    icon: Clock3,
  },
  {
    id: "patient-flow",
    label: "Appointments and patient flow",
    title: "Appointments and patient flow",
    description:
      "Track live patient queue progress. The backend does not provide a staff appointment schedule.",
    icon: CalendarDays,
  },
  {
    id: "patients",
    label: "Patients",
    title: "Patients",
    description:
      "View patient identifiers for active queue tickets in authorized departments.",
    icon: UsersRound,
  },
  {
    id: "departments",
    label: "Departments and services",
    title: "Departments and services",
    description:
      "Browse active departments returned by the assigned hospital directory.",
    icon: ClipboardList,
  },
  {
    id: "medical-staff",
    label: "Medical staff",
    title: "Medical staff",
    description:
      "Review staff and doctor rosters returned for the assigned hospital.",
    icon: UsersRound,
  },
  {
    id: "emergency",
    label: "Emergency activity",
    title: "Emergency activity",
    description:
      "Review emergency cases returned by the assigned hospital service. This does not dispatch emergency services.",
    icon: ShieldAlert,
  },
  {
    id: "notifications",
    label: "Notifications",
    title: "Notifications",
    description:
      "Read notifications for the signed-in staff account.",
    icon: Bell,
  },
  {
    id: "profile",
    label: "My profile",
    title: "My profile",
    description: "Review account profile details from the authenticated session.",
    icon: UserRound,
  },
  {
    id: "settings",
    label: "Settings",
    title: "Settings",
    description: "No backend endpoint currently exposes staff workspace preferences.",
    icon: Settings,
  },
] as const satisfies readonly StaffNavigationItem[];
