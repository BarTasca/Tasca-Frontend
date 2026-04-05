<template>
  <CenteredLayout>
    <AppCard
      title="INFORMACIÓN SOBRE EL TRATAMIENTO DE DATOS"
      subtitle="Información legal"
      :maxWidth="960"
      :gdpr="false"
    >
      <p>
        De acuerdo con L.O. 3/2018, de 5 de diciembre, de Protección de Datos Personales y Garantía
        de los derechos digitales le informamos que sus datos personales serán tratados por LA TASCA
        DE ANA S.L. con la finalidad de atender su solicitud e inscribirle en nuestra lista de
        espera. El tratamiento de estos datos se encuentra legitimado en su consentimiento expreso
        al remitir este formulario. Estos datos no serán comunicados a terceros ajenos a esta
        entidad y serán conservados durante el tiempo necesario para reservar su mesa en nuestro
        establecimiento. Al margen de todo ello, Ud. podrá acceder, rectificar, suprimir sus datos,
        oponerse o solicitar la limitación del tratamiento o la portabilidad de sus datos enviando
        un correo a isalaguna75@gmail.com Si desea ampliar esta información, consulte nuestra
        Política de Privacidad en nuestras instalaciones.
      </p>
      <h3>lista de derechos del consumidor</h3>
      <ul>
        <li>acceso</li>
        <li>rectificacion</li>
        <li>supresion</li>
        <li>limitacion</li>
        <li>portabilidad</li>
        <li>oposicion</li>
      </ul>
      <p>Para ejercer tus derechos, contacta con isabel.</p>
      <template #actions>
        <div class="d-flex justify-center">
          <v-btn variant="text" @click="goBack"> Volver </v-btn>
        </div>
      </template>
    </AppCard>
  </CenteredLayout>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
import CenteredLayout from '@/layouts/CenteredLayout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'ticket.join' })
  }
}
</script>
