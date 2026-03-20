// Re-exported modal state types is safer to import from this file in stores
export type ModalType = 'roulette' | 'loading' | null

export interface RouletteModalProps {
  sessionKey: number
  finalNumber: number
  duration: number
  min: number
  max: number
  onComplete?: (finalNumber: number) => Promise<void> | void
}

export interface LoadingModalProps {
  message?: string
}

export type ModalProps = RouletteModalProps | LoadingModalProps

export interface ModalState {
  type: ModalType
  props: ModalProps | null
  openModal: <T extends ModalType>(
    type: T,
    props: T extends 'roulette' ? RouletteModalProps : T extends 'loading' ? LoadingModalProps : never
  ) => void
  closeModal: () => void
  isOpen: (type: ModalType) => boolean
}
