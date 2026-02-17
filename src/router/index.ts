import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  RouterView,
} from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/HomeView.vue'
import NotFound from '@/views/NotFound.vue'
import LoginView from '@/views/LoginView.vue'
import StaffHomeView from '@/views/staff/StaffHomeView.vue'
import { useAuthStore } from '@/stores/auth'
import TicketStatusView from '@/views/TicketStatusView.vue'
import TicketJoinView from '@/views/TicketJoinView.vue'
import DisplayQrView from '@/views/DisplayQrView.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      // { path: '', name: 'home', component: HomeView },
      { path: '', name: 'ticket.join', component: TicketJoinView, alias: ['/join'] },
      { path: 'display', name: 'qr.display', component: DisplayQrView },
      { path: 'login', name: 'login', component: LoginView },
      {
        path: 'staff',
        component: RouterView,
        meta: { requiresAuth: true },
        children: [{ path: '', name: 'staff.home', component: StaffHomeView }],
      },
    ],
  },
  // { path: '/join', name: 'ticket.join', component: TicketJoinView },
  { path: '/ticket/:publicId', name: 'ticket.status', component: TicketStatusView },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to: RouteLocationNormalized) => {
  if (!to.matched.some((r) => r.meta?.requiresAuth)) return true

  const auth = useAuthStore()
  if (auth.isAuthenticated) return true

  return {
    name: 'login',
    query: { redirect: to.fullPath },
  }
})

export default router
