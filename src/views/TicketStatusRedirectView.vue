<template>
  <CenteredLayout>
    <AppCard>
      <div class="text-center py-6">
        <v-progress-circular
          color="primary"
          indeterminate
          :size="96"
          :width="12"
        />
      </div>
    </AppCard>
  </CenteredLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { readTicketPublicId } from '@/services/tickets'

import AppCard from '@/components/ui/AppCard.vue'
import CenteredLayout from '@/layouts/CenteredLayout.vue'

const router = useRouter()

onMounted(() => {
  const publicId = readTicketPublicId()
  const destination = publicId
    ? { name: 'ticket.status', params: { publicId } }
    : { name: 'ticket.join' }

  router.replace(destination)
})
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
