import { create } from 'zustand'
import type { ModalProps, ModalState, ModalType } from './types/modal'

export const useModalStore = create<ModalState>((set, get) => ({
  type: null,
  props: null,
  openModal: (type: ModalType, props: ModalProps) => set({ type, props }),
  closeModal: () => set({ type: null, props: null }),
  isOpen: (type) => get().type === type,
  $reset: () => set({ type: null, props: null }),
}))
