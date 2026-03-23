import type { LoadingModalProps } from '@/store/types/modal'

export interface UseLoadingModalDataReturn {
  data: {
    modalType: 'loading' | null
    loadingProps: LoadingModalProps | null
  }
  actions: {
    closeModal: () => void
  }
}

export interface UseLoadingModalScreenReturn {
  data: {
    loadingProps: LoadingModalProps | null
    message: string
  }
  actions: {
    closeModal: () => void
    dismiss: () => void
  }
}
