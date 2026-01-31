import { defineStore } from 'pinia'

type SnackColor = 'success' | 'error' | 'info' | 'warning'

interface SnackState {
  show: boolean
  text: string
  color: SnackColor
  timeout: number
}

export const useUiStore = defineStore('ui', {
  state: (): { snackbar: SnackState } => ({
    snackbar: {
      show: false,
      text: '',
      color: 'info',
      timeout: 2500,
    },
  }),
  actions: {
    showSnack(text: string, color: SnackColor = 'info', timeout = 2500) {
      this.snackbar.text = text
      this.snackbar.color = color
      this.snackbar.timeout = timeout
      this.snackbar.show = true
    },
    hideSnack() {
      this.snackbar.show = false
    },
  },
})
