import { renderHook, act } from '@testing-library/react-native'
import { useModalStore } from '@/store/modalStore'
import { useModal } from '@/shared/hooks/useModal'

jest.mock('@/store/modalStore', () => {
  const { create } = require('zustand')
  return {
    useModalStore: create((set) => ({
      type: null,
      props: null,
      openModal: jest.fn((type: string, props: unknown) => set({ type, props })),
      closeModal: jest.fn(() => set({ type: null, props: null })),
      $reset: jest.fn(() => set({ type: null, props: null })),
    })),
  }
})

describe('useModal', () => {
  beforeEach(() => {
    useModalStore.getState().$reset()
  })

  describe('showLoading', () => {
    it('should open loading modal with message', () => {
      const { result } = renderHook(() => useModal())

      act(() => {
        result.current.showLoading('Test message')
      })

      const state = useModalStore.getState()
      expect(state.type).toBe('loading')
      expect(state.props).toEqual({ message: 'Test message' })
    })

    it('should open loading modal without message', () => {
      const { result } = renderHook(() => useModal())

      act(() => {
        result.current.showLoading()
      })

      const state = useModalStore.getState()
      expect(state.type).toBe('loading')
    })
  })

  describe('dismiss', () => {
    it('should close modal', () => {
      useModalStore.getState().openModal('loading', { message: 'Test' })

      const { result } = renderHook(() => useModal())

      act(() => {
        result.current.dismiss()
      })

      const state = useModalStore.getState()
      expect(state.type).toBeNull()
      expect(state.props).toBeNull()
    })
  })

  describe('closeModal', () => {
    it('should close modal', () => {
      useModalStore.getState().openModal('loading', { message: 'Test' })

      const { result } = renderHook(() => useModal())

      act(() => {
        result.current.closeModal()
      })

      const state = useModalStore.getState()
      expect(state.type).toBeNull()
    })
  })
})
