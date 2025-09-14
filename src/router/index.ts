// src/router/index.ts
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import NotFound from '@/views/NotFound.vue'
import LoginView from '@/views/LoginView.vue'
import StaffHomeView from '@/views/staff/StaffHomeView.vue'
import TicketStatusView from '@/views/TicketStatusView.vue'
import TicketJoinView from '@/views/TicketJoinView.vue'
import { ensureTicketTokenFor } from '@/services/tickets'
import { STORAGE_KEYS } from '@/config'

const routes = [
  // ✅ añade login (era referencia del guard)
  { path: '/login', name: 'login', component: LoginView },

  // ✅ haz la raíz pública para que / muestre algo
  { path: '/', name: 'home', component: TicketJoinView },

  // ✅ zona staff protegida en una ruta distinta
  {
    path: '/staff',
    name: 'staff.home',
    component: StaffHomeView,
    meta: { requiresStaff: true },
  },

  {
    path: '/ticket/:publicId',
    name: 'ticket.status',
    component: TicketStatusView,
    beforeEnter: async (to: RouteLocationNormalized) => {
      const publicId = String(to.params.publicId ?? '')
      if (!publicId) return { name: 'home' }
      try {
        await ensureTicketTokenFor(publicId)
        return true
      } catch {
        return { name: 'home' }
      }
    },
  },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to: RouteLocationNormalized) => {
  if (!to.meta?.requiresStaff) return true

  if (to.name === 'login') return true

  const token = localStorage.getItem(STORAGE_KEYS.staffToken)
  if (token) return true

  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
