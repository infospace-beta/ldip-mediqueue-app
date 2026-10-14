import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/staff/dashboard' },
    {
      path: '/staff/dashboard',
      name: 'dashboard',
      component: () => import('../views/StaffDashboard.vue'),
    },
    {
      path: '/staff/queue',
      name: 'queue',
      component: () => import('../views/PatientQueue.vue'),
    },
    {
      path: '/staff/emergency',
      name: 'emergency',
      component: () => import('../views/EmergencyManagement.vue'),
    },
    {
      path: '/staff/departments',
      name: 'departments',
      component: () => import('../views/Departments.vue'),
    },
    {
      path: '/staff/reports',
      name: 'reports',
      component: () => import('../views/Reports.vue'),
    },
    {
      path: '/staff/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
    },
  ],
})

export default router
