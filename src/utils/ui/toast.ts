import { toast } from '@/shared/utils/tamaguiToast'

export const showToast = (title: string, message?: string) => {
  toast.message(title, { description: message })
}

