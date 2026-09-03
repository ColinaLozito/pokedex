export type ModalType = 'loading' | 'whos-that-pokemon-result' | null

export interface LoadingModalProps {
  message?: string
}

export interface WhosThatPokemonResultModalProps {
  status: 'correct' | 'incorrect'
  correctName: string
}

export type ModalProps = LoadingModalProps | WhosThatPokemonResultModalProps

export interface ModalState {
  type: ModalType
  props: ModalProps | null
  openModal: (type: ModalType, props: ModalProps) => void
  closeModal: () => void
  isOpen: (type: ModalType) => boolean
  $reset: () => void
}
