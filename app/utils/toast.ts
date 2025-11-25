// Toast controller will be set from the app
let toastController: any = null

export const setToastController = (controller: any) => {
  toastController = controller
}

export const showToast = (title: string, message?: string) => {
  if (toastController) {
    toastController.show(title, { message })
  }
}

