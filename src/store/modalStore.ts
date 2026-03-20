import { create } from 'zustand'
import type { ModalState } from './types/modal'

export const useModalStore = create<ModalState>((set, get) => ({
  type: null,
  props: null,
  openModal: (type, props) => set({ type, props }),
  closeModal: () => set({ type: null, props: null }),
  isOpen: (type) => get().type === type,
}))
