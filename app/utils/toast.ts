import type { useToastController } from '@tamagui/toast'

// Toast controller will be set from the app
type ToastController = ReturnType<typeof useToastController>
let toastController: ToastController | null = null

export const setToastController = (controller: ToastController) => {
  toastController = controller
}

export const showToast = (title: string, message?: string) => {
  if (toastController) {
    toastController.show(title, { message })
  }
}

