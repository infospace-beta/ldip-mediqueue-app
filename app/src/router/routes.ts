import type { RouteRecordRaw } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";

export const routes: RouteRecordRaw[] = [
  // =====================================================
  // PUBLIC MEDIQUEUE PAGES
  // =====================================================
  {
    path: "/",
    name: ROUTE_NAMES.landing,
    component: () => import("@/views/LandingView.vue"),
  },

  {
    path: "/how-it-works",
    name: ROUTE_NAMES.howItWorks,
    component: () => import("@/views/HowItWorksView.vue"),
  },

  {
    path: "/features",
    name: ROUTE_NAMES.features,
    component: () => import("@/views/FeaturesView.vue"),
  },

  {
    path: "/about",
    name: ROUTE_NAMES.about,
    component: () => import("@/views/AboutView.vue"),
  },

  {
    path: "/faq",
    name: ROUTE_NAMES.faq,
    component: () => import("@/views/FaqView.vue"),
  },

  {
    path: "/contact",
    name: ROUTE_NAMES.contact,
    component: () => import("@/views/ContactView.vue"),
  },

  // =====================================================
  // EXISTING TEMPLATE PAGES
  // Keep these for now; we can remove them after testing.
  // =====================================================
  {
    path: "/posts",
    name: ROUTE_NAMES.posts,
    component: () => import("@/views/PostsView.vue"),
  },

  {
    path: "/jobs",
    name: ROUTE_NAMES.jobs,
    component: () => import("@/views/JobsView.vue"),
  },

  // =====================================================
  // LOGIN
  // =====================================================
  {
    path: "/login",
    name: ROUTE_NAMES.login,
    component: () => import("@/views/LoginView.vue"),
    meta: {
      guestOnly: true,
      layout: "auth",
    },
  },

  {
    path: "/signup",
    name: ROUTE_NAMES.signup,
    component: () => import("@/views/SignupView.vue"),
    meta: {
      guestOnly: true,
      layout: "auth",
    },
  },

  // =====================================================
  // EXISTING TEMPLATE AUTHENTICATED PAGES
  // =====================================================
  {
    path: "/home",
    name: ROUTE_NAMES.home,
    component: () => import("@/views/HomeView.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/api",
    name: ROUTE_NAMES.apiTest,
    component: () => import("@/views/ApiTestView.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/posts/:id",
    name: ROUTE_NAMES.postDetails,
    component: () => import("@/views/PostDetailsView.vue"),
    props: true,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/jobs/:id",
    name: ROUTE_NAMES.jobDetails,
    component: () => import("@/views/JobDetailsView.vue"),
    props: true,
    meta: {
      requiresAuth: true,
    },
  },

  // =====================================================
  // MEDIQUEUE PATIENT PORTAL
  // PatientLayout provides its own sidebar, top navbar,
  // page content area, and footer.
  // The blank layout prevents duplicate template headers
  // and footers around the patient portal.
  // =====================================================
  {
    path: "/patient",
    component: () => import("@/components/PatientLayout.vue"),
    meta: {
      layout: "blank",
      requiresAuth: true,
      roles: ["patient"],
    },
    children: [
      {
        path: "",
        redirect: "/patient/dashboard",
      },

      {
        path: "dashboard",
        name: ROUTE_NAMES.patientDashboard,
        component: () => import("@/views/DashboardPage.vue"),
        meta: {
          title: "Dashboard",
        },
      },

      {
        path: "queue",
        component: () => import("@/views/QueuePage.vue"),
        meta: {
          title: "My Queue",
        },
      },

      {
        path: "join-queue",
        component: () => import("@/views/JoinQueuePage.vue"),
        meta: {
          title: "Prepare queue request",
        },
      },

      {
        path: "emergency",
        component: () => import("@/views/EmergencyPage.vue"),
        meta: {
          title: "Emergency Assistance",
        },
      },

      {
        path: "appointments",
        component: () => import("@/views/AppointmentsPage.vue"),
        meta: {
          title: "Appointments",
        },
      },

      {
        path: "notifications",
        component: () => import("@/views/NotificationsPage.vue"),
        meta: {
          title: "Notifications",
        },
      },

      {
        path: "history",
        component: () => import("@/views/HistoryPage.vue"),
        meta: {
          title: "Medical History",
        },
      },

      {
        path: "profile",
        component: () => import("@/views/ProfilePage.vue"),
        meta: {
          title: "My Profile",
        },
      },

      {
        path: "settings",
        component: () => import("@/views/SettingsPage.vue"),
        meta: {
          title: "Settings",
        },
      },
    ],
  },

  // =====================================================
  // MEDIQUEUE RESPONDER PORTAL
  // ResponderDashboard must contain a RouterView for
  // the responder child pages to render.
  // =====================================================
  {
    path: "/responder",
    component: () => import("@/views/ResponderDashboard.vue"),
    meta: {
      layout: "blank",
      requiresAuth: true,
      roles: ["responder"],
    },
    children: [
      {
        path: "",
        redirect: "/responder/dashboard",
      },

      {
        path: "dashboard",
        name: ROUTE_NAMES.responderDashboard,
        component: () => import("@/views/ResponderSection.vue"),
        meta: {
          title: "Responder Dashboard",
          section: "dashboard",
        },
      },

      {
        path: "emergencies",
        component: () => import("@/views/ResponderSection.vue"),
        meta: {
          title: "Emergencies",
          section: "emergencies",
        },
      },

      {
        path: "patients",
        component: () => import("@/views/ResponderSection.vue"),
        meta: {
          title: "Assigned Patients",
          section: "patients",
        },
      },

      {
        path: "queue",
        component: () => import("@/views/ResponderSection.vue"),
        meta: {
          title: "Queue",
          section: "queue",
        },
      },

      {
        path: "notifications",
        component: () => import("@/views/ResponderSection.vue"),
        meta: {
          title: "Notifications",
          section: "notifications",
        },
      },

      {
        path: "history",
        component: () => import("@/views/ResponderSection.vue"),
        meta: {
          title: "Response History",
          section: "history",
        },
      },

      {
        path: "profile",
        component: () => import("@/views/ResponderSection.vue"),
        meta: {
          title: "Profile",
          section: "profile",
        },
      },

      {
        path: "settings",
        component: () => import("@/views/ResponderSection.vue"),
        meta: {
          title: "Settings",
          section: "settings",
        },
      },
    ],
  },

  {
    path: "/doctor/dashboard",
    name: ROUTE_NAMES.doctorDashboard,
    component: () => import("@/views/DoctorDashboard.vue"),
    meta: {
      layout: "blank",
      requiresAuth: true,
      roles: ["doctor"],
      title: "Doctor workspace preview",
    },
  },

  {
    path: "/staff/dashboard",
    name: ROUTE_NAMES.staffDashboard,
    component: () => import("@/views/StaffDashboard.vue"),
    meta: {
      layout: "blank",
      requiresAuth: true,
      roles: ["staff"],
    },
  },

  {
    path: "/admin/dashboard",
    name: ROUTE_NAMES.adminDashboard,
    component: () => import("@/views/AdminDashboard.vue"),
    meta: {
      layout: "blank",
      requiresAuth: true,
      roles: ["admin"],
      title: "Admin Dashboard",
    },
  },

  // =====================================================
  // 404 - PAGE NOT FOUND
  // =====================================================
  {
    path: "/:pathMatch(.*)*",
    name: ROUTE_NAMES.notFound,
    component: () => import("@/views/NotFoundView.vue"),
    meta: {
      layout: "blank",
    },
  },
];
