<template>
  <v-card
    class="ticket-surface"
    rounded="xl"
    elevation="2"
    :style="surfaceStyle"
    @click="onClick"
  >
<<<<<<< HEAD
    <v-card-item class="ticket-card-item">
      <div class="ticket-row">
        <div class="ticket-position-wrap">
          <v-chip class="ticket-position" color="dark_Wood" variant="text">
            <strong>#{{ displayPos }}</strong>
          </v-chip>
        </div>

        <div class="ticket-main">
          <div class="ticket-name">
            <strong>{{ customerName }}</strong>
          </div>

          <div class="ticket-status-row">
            <span class="ticket-status">{{ statusLabel }}</span>
            <v-progress-circular
              v-if="busy"
              indeterminate
              size="16"
              width="2"
              class="ticket-busy"
            />
          </div>
        </div>

        <div class="ticket-people">
          <v-chip class="ticket-people-chip" size="small" variant="text">
            <User class="ticket-icon ticket-user-icon" :stroke-width="2.5" />
            <span class="ticket-people-count">{{ peopleCount }}</span>
          </v-chip>
        </div>

        <div class="ticket-action">
          <v-btn
            class="ticket-notify-btn"
            color="dark_Wood"
            variant="elevated"
            @click.stop="emit('notify')"
            :disabled="busy"
            :loading="busy"
          >
            <Bell class="ticket-icon ticket-bell-icon" :stroke-width="2.5" />
          </v-btn>
=======
    <v-card-item>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-3">
          <v-chip color="primary" variant="flat" size="small"> #{{ displayPos }} </v-chip>
          <div class="text-subtitle-2 font-weight-medium">{{ customerName }}</div>
        </div>

        <div class="d-flex align-center ga-2">
          <v-progress-circular v-if="busy" indeterminate size="16" width="2" />
          <v-chip size="small" variant="tonal">{{ peopleCount }} pers.</v-chip>
>>>>>>> b37622cb9fe24df96b7b6434e1a986826b3777d8
        </div>
      </div>

      <div class="text-caption text-medium-emphasis mt-1">
        <strong>Estado:</strong> {{ status }}
      </div>
    </v-card-item>

    <v-card-actions class="justify-end">
      <v-btn
        size="small"
        color="secondary"
        variant="tonal"
        @click.stop="emit('notify')"
        prepend-icon="mdi-bell-outline"
        :disabled="busy"
        :loading="busy"
      >
        Avisar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

<<<<<<< HEAD
import { Bell, User } from 'lucide-vue-next'

=======
>>>>>>> b37622cb9fe24df96b7b6434e1a986826b3777d8
const props = defineProps<{
  displayPos: number
  customerName: string
  peopleCount: number
  status: string

  busy?: boolean

  dragX: number
  dragging: boolean
}>()

<<<<<<< HEAD
const statusLabel = computed(() => {
  switch (props.status) {
    case 'WAITING':
      return 'Esperando'
    case 'NOTIFIED':
      return 'Notificado'
    case 'CANCELLED':
      return 'Cancelado'
    case 'CONFIRMED':
      return 'Confirmado'
    default:
      return props.status
  }
})

=======
>>>>>>> b37622cb9fe24df96b7b6434e1a986826b3777d8
const emit = defineEmits<{
  (e: 'click'): void
  (e: 'notify'): void
}>()

const surfaceStyle = computed(() => ({
  transform: `translateX(${props.dragX}px)`,
  transition: props.dragging ? 'none' : 'transform 160ms',
}))

function onClick() {
  emit('click')
}
</script>

<style scoped lang="scss">
@use '@/styles/tokens.scss' as *;

.ticket-surface {
  user-select: none;
  margin: 8px 0;
}

.ticket-card-item {
  padding: 14px 18px;
}

.ticket-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.ticket-position-wrap {
  display: flex;
  align-items: center;
}

.ticket-position {
  padding: 0;
  min-width: auto;
  font-size: 1rem;
  font-weight: 700;
}

.ticket-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
}

.ticket-name {
  font-size: 1.2rem;
  font-weight: 520;
  line-height: 1.2;
  word-break: break-word;
}

.ticket-status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ticket-status {
  display: block;
  font-size: 1.02rem;
  font-weight: 500;
  line-height: 1.2;
  color: $color-dark-wood;
}

.ticket-busy {
  flex: 0 0 auto;
}

.ticket-people {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ticket-people-chip {
  padding: 0;
  min-width: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 500;
}

.ticket-people-count {
  line-height: 1;
  color: $color-dark-wood;
}

.ticket-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.ticket-notify-btn {
  min-width: 64px;
  height: 44px;
}

.ticket-icon {
  flex: 0 0 auto;
}

.ticket-user-icon {
  width: 24px;
  height: 24px;
  color: $color-dark-wood;
}

.ticket-bell-icon {
  width: 24px;
  height: 24px;
}

@media (max-width: 600px) {
  .ticket-card-item {
    padding: 14px 14px;
  }

  .ticket-row {
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    gap: 10px;
  }

  .ticket-position {
    font-size: 0.95rem;
  }

  .ticket-main {
    gap: 6px;
  }

  .ticket-name {
    font-size: 1.08rem;
    line-height: 1.2;
  }

  .ticket-status-row {
    gap: 6px;
    flex-wrap: wrap;
  }

  .ticket-status {
    font-size: 0.96rem;
    line-height: 1.25;
  }

  .ticket-people-chip {
    gap: 4px;
    font-size: 0.95rem;
  }

  .ticket-user-icon {
    width: 22px;
    height: 22px;
  }

  .ticket-bell-icon {
    width: 22px;
    height: 22px;
  }

  .ticket-notify-btn {
    min-width: 56px;
    height: 40px;
  }
}
</style>