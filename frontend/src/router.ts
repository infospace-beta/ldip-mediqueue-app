import { createRouter, createWebHistory } from 'vue-router'
import PatientLayout from './components/PatientLayout.vue'
import DashboardPage from './views/DashboardPage.vue'
import QueuePage from './views/QueuePage.vue'
import JoinQueuePage from './views/JoinQueuePage.vue'
import EmergencyPage from './views/EmergencyPage.vue'
import AppointmentsPage from './views/AppointmentsPage.vue'
import NotificationsPage from './views/NotificationsPage.vue'
import HistoryPage from './views/HistoryPage.vue'
import ProfilePage from './views/ProfilePage.vue'
import SettingsPage from './views/SettingsPage.vue'
import ResponderDashboard from './views/ResponderDashboard.vue'
import ResponderSection from './views/ResponderSection.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/responder',
      component: ResponderDashboard,
      children: [
        { path: '', redirect: '/responder/dashboard' },
        { path: 'dashboard', name: 'responder-dashboard', component: ResponderSection, meta: { title: 'Responder Dashboard', section: 'dashboard' } },
        { path: 'emergencies', name: 'responder-emergencies', component: ResponderSection, meta: { title: 'Emergency Requests', section: 'emergencies' } },
        { path: 'patients', name: 'responder-patients', component: ResponderSection, meta: { title: 'Assigned Patients', section: 'patients' } },
        { path: 'queue', name: 'responder-queue', component: ResponderSection, meta: { title: 'Queue', section: 'queue' } },
        { path: 'notifications', name: 'responder-notifications', component: ResponderSection, meta: { title: 'Notifications', section: 'notifications' } },
        { path: 'history', name: 'responder-history', component: ResponderSection, meta: { title: 'Response History', section: 'history' } },
        { path: 'profile', name: 'responder-profile', component: ResponderSection, meta: { title: 'Profile', section: 'profile' } },
        { path: 'settings', name: 'responder-settings', component: ResponderSection, meta: { title: 'Settings', section: 'settings' } },
      ],
    },
    {
      path: '/patient',
      component: PatientLayout,
      children: [
        { path: '', redirect: '/patient/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: DashboardPage, meta: { title: 'Dashboard' } },
        { path: 'queue', name: 'queue', component: QueuePage, meta: { title: 'My queue' } },
        { path: 'join-queue', name: 'join-queue', component: JoinQueuePage, meta: { title: 'Join a queue' } },
        { path: 'emergency', name: 'emergency', component: EmergencyPage, meta: { title: 'Emergency' } },
        { path: 'appointments', name: 'appointments', component: AppointmentsPage, meta: { title: 'Appointments' } },
        { path: 'notifications', name: 'notifications', component: NotificationsPage, meta: { title: 'Notifications' } },
        { path: 'history', name: 'history', component: HistoryPage, meta: { title: 'Medical history' } },
        { path: 'profile', name: 'profile', component: ProfilePage, meta: { title: 'My profile' } },
        { path: 'settings', name: 'settings', component: SettingsPage, meta: { title: 'Settings' } },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/patient/dashboard' },
  ],
})

export default router