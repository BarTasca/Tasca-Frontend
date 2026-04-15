<script setup lang="ts">
import {
  Squirrel,
  Bell,
  Hand,
  HandPlatter,
  CircleX,
  TicketX,
  Users,
  BookMarked,
  Pencil,
} from 'lucide-vue-next'
import { computed } from 'vue'
import type { TicketStatusDto } from '@/types/tickets'

const { status } = defineProps<{
  status: TicketStatusDto
  editable?: boolean
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit-people'): void
}>()

const statusAlert = {
  Waiting: {
    text: 'A la espera',
    icon: Hand,
  },
  Notified: {
    text: '¡Ya puedes venir!',
    icon: Bell,
  },
  Confirmed: {
    text: 'Servido',
    icon: HandPlatter,
  },
  Cancelled: {
    text: 'Cancelado',
    icon: CircleX,
  },
  Error: {
    text: 'Se ha producido un error, sentimos las molestias',
    icon: TicketX,
  },
}
const currentStatus = computed(() => {
  return statusAlert[status.status as keyof typeof statusAlert] ?? statusAlert.Error
})
</script>

<template>
  <v-alert color="accent" variant="flat" class="summary-box summary-box--accent mb-4">
    <div class="summary-content">
      <Squirrel class="summary-icon" />
      <strong>{{ status.ahead }} por delante</strong>
    </div>
  </v-alert>

  <v-alert color="wood" variant="flat" class="summary-box mb-4">
    <div class="summary-content">
      <component :is="currentStatus.icon" class="summary-icon" />
      <strong>{{ currentStatus.text }}</strong>
    </div>
  </v-alert>

  <div class="d-flex ga-2">
    <v-alert color="wood" variant="flat" class="summary-box summary-box--prefix">
      <div class="summary-content summary-content--small">
        <Users class="summary-icon summary-icon--small" />
        <strong>{{ status.peopleCount }}</strong>

        <v-btn
          v-if="editable"
          size="xl-small"
          variant="text"
          :disabled="busy"
          @click.stop="emit('edit-people')"
          class="summary-icon"
        >
          <Pencil />
        </v-btn>
      </div>
    </v-alert>

    <v-alert color="wood" variant="flat" class="summary-box flex-grow-1">
      <div class="summary-content">
        <BookMarked class="summary-icon" />
        <strong>{{ status.customerFullName }}</strong>
      </div>
    </v-alert>
  </div>
</template>

<style scoped lang="scss">
%summary-content-base {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  line-height: 1;
  font-weight: 700;
}

.summary-content {
  @extend %summary-content-base;
  font-size: clamp(20px, 5vw, 25px);
}

.summary-content--small {
  @extend %summary-content-base;
  gap: 6px;
  font-size: clamp(16px, 4vw, 20px);
  opacity: 0.75;
}

%summary-icon-base {
  width: 1.2em;
  height: 1.2em;
  flex-shrink: 0;
}

.summary-icon {
  @extend %summary-icon-base;
}

.summary-icon--small {
  @extend %summary-icon-base;
  width: 0.9em;
  height: 0.9em;
  opacity: 0.75;
}

.summary-box {
  border-radius: 19px !important;
  overflow: hidden;
  box-shadow: none !important;
  border: none !important;
  min-height: 56px;
  padding-inline: 16px;
}

.summary-box--prefix {
  max-width: 120px;
}

.summary-box :deep(.v-alert__content) {
  width: 100%;
}

.summary-box :deep(strong) {
  color: var(--color-dark-wood) !important;
}

.summary-box .summary-icon {
  color: var(--color-dark-wood) !important;
}

.summary-box--accent :deep(strong),
.summary-box--accent .summary-icon {
  color: white !important;
}

.summary-box :deep(.v-alert__prepend),
.summary-box :deep(.v-alert__close) {
  display: none !important;
}
</style>
