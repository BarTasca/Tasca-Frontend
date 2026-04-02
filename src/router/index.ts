import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
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
import BareLayout from '@/layouts/BareLayout.vue'
import StyleGuideView from '@/views/StyleGuideView.vue'
import { isDevPreviewEnabled } from '@/config/env'
import DevHubView from '@/views/DevHubView.vue'
import privacyPolicyView from '@/views/PrivacyPolicyView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'ticket.join', component: TicketJoinView, alias: ['/join'] },
      { path: 'datos-proteccion', name: 'ticket.join.privacy', component: privacyPolicyView },
      {
        path: 'staff',
        component: RouterView,
        meta: { requiresAuth: true },
        children: [{ path: '', name: 'staff.home', component: StaffHomeView }],
      },
      { path: 'login', name: 'login', component: LoginView },
    ],
  },
  {
    path: '/',
    component: BareLayout,
    children: [
      { path: 'display', name: 'qr.display', component: DisplayQrView },
    ],
  },
  { path: '/ticket/:publicId', name: 'ticket.status', component: TicketStatusView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

if (isDevPreviewEnabled) {
  routes.push(
    {
      path: '/style',
      name: 'style.guide',
      component: StyleGuideView,
    },
    {
      path: '/dev',
      name: 'dev.hub',
      component: () => import('@/views/DevHubView.vue'),
    },
  )
}

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

router.beforeEach((to) => {
  if (to.name === 'dev.hub' && !isDevPreviewEnabled) {
    return { name: 'not-found' }
  }
})

export default router
