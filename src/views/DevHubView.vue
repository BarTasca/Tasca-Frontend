<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <AppCard
          title="Dev Preview"
          subtitle="Navega por pantallas reales con presets de estado (solo DEV/staging)."
          :maxWidth="900"
        >
          <div class="d-flex flex-column ga-4">
            <!-- Ticket Join -->
            <div class="text-subtitle-1 font-weight-bold">TicketJoin</div>

            <div class="d-flex flex-wrap ga-2">
              <v-btn variant="tonal" @click="openJoin('loading')">Loading</v-btn>
              <v-btn variant="tonal" @click="openJoin('service_closed')">Servicio cerrado</v-btn>
              <v-btn variant="tonal" @click="openJoin('no_qr')">Sin QR</v-btn>
              <v-btn variant="tonal" @click="openJoin('qr_expired')">QR caducado</v-btn>
              <v-btn variant="tonal" @click="openJoin('ahead_0')">Ahead 0</v-btn>
              <v-btn variant="tonal" @click="openJoin('ahead_3')">Ahead 3</v-btn>
              <v-btn variant="tonal" @click="openJoin('submit_error_generic')">Submit error</v-btn>
              <v-btn variant="tonal" @click="openJoin('submit_error_qr')">Submit QR</v-btn>
              <v-btn variant="tonal" @click="openJoin('submit_error_closed')">Submit cerrado</v-btn>
            </div>

            <v-divider class="my-2" />

            <!-- Ticket Status -->
            <div class="text-subtitle-1 font-weight-bold mt-2">TicketStatus</div>

            <div class="d-flex flex-wrap ga-2">
              <v-btn variant="tonal" @click="openStatus('waiting')">WAITING</v-btn>
              <v-btn variant="tonal" @click="openStatus('notified')">NOTIFIED</v-btn>
              <v-btn variant="tonal" @click="openStatus('confirmed')">CONFIRMED</v-btn>
              <v-btn variant="tonal" @click="openStatus('served')">SERVED</v-btn>
              <v-btn variant="tonal" @click="openStatus('cancelled')">CANCELLED</v-btn>
              <v-btn variant="tonal" @click="openStatus('expired')">EXPIRED</v-btn>
              <v-btn variant="tonal" @click="openStatus('error')">Error</v-btn>
              <v-btn variant="tonal" @click="openStatus('cancel_error')">Cancel error</v-btn>
              <v-btn variant="tonal" @click="openStatus('cancel_success')">Cancel success</v-btn>
            </div>

            <v-divider class="my-2" />

            <!-- Login -->
            <div class="text-subtitle-1 font-weight-bold mt-2">Login</div>

            <div class="d-flex flex-wrap ga-2">
              <v-btn variant="tonal" @click="openLogin('login_default')">Default</v-btn>
              <v-btn variant="tonal" @click="openLogin('login_error')"
                >Error: Credenciales invalidas</v-btn
              >
              <v-btn variant="tonal" @click="openLogin('login_error_server')"
                >Error: Generico</v-btn
              >
              <v-btn variant="tonal" @click="openLogin('login_success_to_staff')"
                >Success → /staff</v-btn
              >
            </div>

            <v-divider class="my-2" />

            <div class="text-subtitle-1 font-weight-bold mt-2">Staff</div>

            <!-- Staff Panel -->

            <div class="d-flex flex-wrap ga-2">
              <v-btn variant="tonal" @click="devSetStaffToken()">Set staff token</v-btn>
              <v-btn variant="tonal" @click="devClearStaffToken()">Clear staff token</v-btn>

              <v-btn variant="tonal" @click="openStaff('staff_list')">Panel (lista)</v-btn>
              <v-btn variant="tonal" @click="openStaff('staff_empty')">Panel (vacía)</v-btn>
              <v-btn variant="tonal" @click="openStaff('staff_error')">Panel (error)</v-btn>
              <v-btn variant="tonal" @click="openStaff('staff_action_error')">Acción error</v-btn>

              <v-btn variant="tonal" @click="openStaff('service_closed')">Servicio cerrado</v-btn>
              <v-btn variant="tonal" @click="openStaff('service_error')">Service error</v-btn>
              <v-btn variant="tonal" @click="openStaff('service_set_error')">SetOpen error</v-btn>
            </div>

            <v-divider class="my-2" />

            <div class="text-caption opacity-70">
              Los presets navegan a rutas reales con query params. El comportamiento se simula con
              mocks (solo DEV).
            </div>

            <div class="text-caption opacity-70">
              Estos botones solo preparan la navegación con parámetros de preview. Los mocks/bypass
              se implementan en las siguientes áreas.
            </div>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppCard from '@/components/ui/AppCard.vue'

import { STORAGE_KEYS } from '@/config'

type JoinScenario =
  | 'loading'
  | 'service_closed'
  | 'no_qr'
  | 'qr_expired'
  | 'ahead_0'
  | 'ahead_3'
  | 'submit_error_generic'
  | 'submit_error_qr'
  | 'submit_error_closed'

type StatusScenario =
  | 'waiting'
  | 'notified'
  | 'confirmed'
  | 'served'
  | 'cancelled'
  | 'expired'
  | 'error'
  | 'cancel_error'
  | 'cancel_success'

type LoginScenario =
  | 'login_default'
  | 'login_error'
  | 'login_error_server'
  | 'login_success_to_staff'

type StaffScenario =
  | 'staff_list'
  | 'staff_empty'
  | 'staff_error'
  | 'staff_action_error'
  | 'service_closed'
  | 'service_error'
  | 'service_set_error'
  | 'service_set_ok'

const router = useRouter()

function openJoin(s: JoinScenario) {
  const query: Record<string, string> = {
    dev: '1',
    view: 'ticket.join',
    scenario: s,
  }

  if (s !== 'no_qr') {
    query.qt = s === 'qr_expired' ? 'DEV_EXPIRED' : 'DEV_VALID'
  }

  router.push({ name: 'ticket.join', query })
}

function openStatus(s: StatusScenario) {
  router.push({
    name: 'ticket.status',
    params: { publicId: 'DEV-STATUS' },
    query: {
      dev: '1',
      view: 'ticket.status',
      scenario: s,
    },
  })
}

function openLogin(s: LoginScenario) {
  router.push({
    name: 'login',
    query: {
      dev: '1',
      view: 'login',
      scenario: s === 'login_success_to_staff' ? 'login_default' : s,
      redirect: s === 'login_success_to_staff' ? '/staff' : '/login',
    },
  })
}

function openStaff(s: StaffScenario) {
  router.push({
    name: 'staff.home',
    query: { dev: '1', view: 'staff.home', scenario: s },
  })
}

function devSetStaffToken() {
  localStorage.setItem(STORAGE_KEYS.staffToken, 'DEV.STAFF.TOKEN')
}
function devClearStaffToken() {
  localStorage.removeItem(STORAGE_KEYS.staffToken)
}
</script>
