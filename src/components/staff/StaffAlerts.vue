<template>
  <div class="alerts">
    <div v-if="serviceError" class="alert-box alert-box--error">
      <div class="alert-box__icon">
        <span>×</span>
      </div>
      <div class="alert-box__text">
        {{ mapErrorMessage(serviceError) }}
      </div>
    </div>

    <div v-if="error" class="alert-box alert-box--error">
      <div class="alert-box__icon">
        <span>×</span>
      </div>
      <div class="alert-box__text">
        {{ mapErrorMessage(error) }}
      </div>
    </div>

    <div v-if="showEmpty" class="alert-box alert-box--info">
      <div class="alert-box__text">
        {{ emptyText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  serviceError?: string | null
  error?: string | null
  showEmpty: boolean
  emptyText?: string
}>()

function mapErrorMessage(message?: string | null): string {
  if (!message) return ''

  const normalized = message.toLowerCase()

  if (normalized.includes('contraseña inválida') || normalized.includes('invalid password')) {
    return 'Contraseña inválida'
  }

  if (normalized.includes('unauthorized') || normalized.includes('no autorizado') || normalized.includes('forbidden')) {
    return 'No tienes permiso para realizar esta acción.'
  }

  if (normalized.includes('network') || normalized.includes('fetch')) {
    return 'No se pudo conectar con el servidor.'
  }

  if (normalized.includes('timeout')) {
    return 'La operación tardó demasiado. Inténtalo de nuevo.'
  }

  if (normalized.includes('no se pudo cargar el estado del servicio')) {
    return 'No se pudo cargar el estado del servicio.'
  }

  if (normalized.includes('no se pudo actualizar el estado del servicio')) {
    return 'No se pudo cambiar el estado del servicio.'
  }

  if (normalized.includes('error al cargar tickets')) {
    return 'No se pudo cargar la lista de tickets.'
  }

  if (normalized.includes('error al servir ticket')) {
    return 'No se pudo marcar el ticket como servido.'
  }

  if (normalized.includes('error al saltar ticket')) {
    return 'No se pudo saltar el ticket.'
  }

  if (normalized.includes('error al cancelar ticket')) {
    return 'No se pudo cancelar el ticket.'
  }

  if (normalized.includes('error al avisar')) {
    return 'No se pudo enviar el aviso.'
  }

  return message
}
</script>

<style scoped lang="scss">
.alerts {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.alert-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;

  width: 100%;
  min-height: 68px;
  padding: 14px 20px;
  border-radius: 24px;

  text-align: center;
}

.alert-box__icon {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid currentColor;
  border-radius: 999px;

  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;
}

.alert-box__text {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.25;
}

.alert-box--error {
  background-color: #f2a3a3;
  color: #2b2b2b;
}

.alert-box--info {
  background-color: #dfe8f6;
  color: #2b2b2b;
}
</style>