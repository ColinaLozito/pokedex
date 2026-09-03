import type { LoadingModalProps, ModalType } from '@/store/types/modal'

export interface UseLoadingModalDataReturn {
  data: {
    modalType: ModalType
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
