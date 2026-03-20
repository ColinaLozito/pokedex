import { create } from 'zustand'

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

// Union type for all modal props - extend this when adding new modal types
export type ModalProps = RouletteModalProps | LoadingModalProps

interface ModalState {
  type: ModalType
  props: ModalProps | null
  openModal: <T extends ModalType>(
    type: T,
    props: T extends 'roulette'
      ? RouletteModalProps
      : T extends 'loading'
        ? LoadingModalProps
        : never,
  ) => void
  closeModal: () => void
  isOpen: (type: ModalType) => boolean
}

export const useModalStore = create<ModalState>((set, get) => ({
  type: null,
  props: null,
  openModal: (type, props) => set({ type, props }),
  closeModal: () => set({ type: null, props: null }),
  isOpen: (type) => get().type === type,
}))

