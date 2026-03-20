// Modal types: simplified to only support loading modal
export type ModalType = 'loading' | null

export interface LoadingModalProps {
  message?: string
}

export type ModalProps = LoadingModalProps

export interface ModalState {
  type: ModalType
  props: ModalProps | null
  openModal: (type: 'loading', props: LoadingModalProps) => void
  closeModal: () => void
  isOpen: (type: ModalType) => boolean
}
