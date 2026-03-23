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
          background: themeConfig.colors.background,
          wood: themeConfig.colors.wood,
          dark_Wood: themeConfig.colors.dark_Wood,
          success: themeConfig.colors.success,
          cancel: themeConfig.colors.cancel,
          accent: themeConfig.colors.accent,
        },
      },
      dark: {
        dark: true,
        colors: {
          background: themeConfig.colors.background,
          wood: themeConfig.colors.wood,
          dark_Wood: themeConfig.colors.wood,
          success: themeConfig.colors.success,
          cancel: themeConfig.colors.cancel,
          accent: themeConfig.colors.accent,
        },
      },
    },
  },
})
