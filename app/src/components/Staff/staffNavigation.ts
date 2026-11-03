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
      "Operational summaries will be available when an authorized hospital service is connected.",
    icon: LayoutDashboard,
  },
  {
    id: "queue",
    label: "Queue monitoring",
    title: "Queue monitoring",
    description:
      "Queue positions and service status will appear here when the authorized hospital queue service is connected. No live queue activity is shown.",
    icon: Clock3,
  },
  {
    id: "patient-flow",
    label: "Appointments and patient flow",
    title: "Appointments and patient flow",
    description:
      "Appointment schedules and visit progress shared with staff will appear here when an authorized service is connected.",
    icon: CalendarDays,
  },
  {
    id: "patients",
    label: "Patients",
    title: "Patients",
    description:
      "Patient records are unavailable until a connected service confirms that this staff account is authorized to view them.",
    icon: UsersRound,
  },
  {
    id: "departments",
    label: "Departments and services",
    title: "Departments and services",
    description:
      "Department details and service availability will appear here when verified hospital records are connected.",
    icon: ClipboardList,
  },
  {
    id: "medical-staff",
    label: "Medical staff",
    title: "Medical staff",
    description:
      "Staff rosters and hospital permissions require an authorized administration service. No membership or staffing details are assumed.",
    icon: UsersRound,
  },
  {
    id: "emergency",
    label: "Emergency activity",
    title: "Emergency activity",
    description:
      "Emergency activity is unavailable. This dashboard does not receive or dispatch emergency requests.",
    icon: ShieldAlert,
  },
  {
    id: "notifications",
    label: "Notifications",
    title: "Notifications",
    description:
      "Updates from authorized hospital workflows will appear here when notification services are connected.",
    icon: Bell,
  },
  {
    id: "profile",
    label: "My profile",
    title: "My profile",
    description: "Staff profile information is not available in this preview.",
    icon: UserRound,
  },
  {
    id: "settings",
    label: "Settings",
    title: "Settings",
    description: "Staff workspace settings are unavailable in this preview.",
    icon: Settings,
  },
] as const satisfies readonly StaffNavigationItem[];
