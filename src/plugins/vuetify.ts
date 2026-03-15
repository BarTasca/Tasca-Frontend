import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { themeConfig } from '@/styles/theme.config'

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: themeConfig.colors.primary,
          secondary: themeConfig.colors.secondary,
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: themeConfig.colors.primary,
          secondary: themeConfig.colors.secondary,
        },
      },
    },
  },
})
