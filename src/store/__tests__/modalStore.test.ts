import { useModalStore } from '../modalStore'

describe('modalStore', () => {
  beforeEach(() => {
    useModalStore.getState().$reset()
  })

  describe('Initial State', () => {
    it('should have correct default values', () => {
      const state = useModalStore.getState()

      expect(state.type).toBeNull()
      expect(state.props).toBeNull()
    })
  })

  describe('openModal', () => {
    it('should set type and props', () => {
      useModalStore.getState().openModal('loading', { message: 'Loading...' })

      const state = useModalStore.getState()
      expect(state.type).toBe('loading')
      expect(state.props).toEqual({ message: 'Loading...' })
    })

    it('should overwrite previous modal type and props', () => {
      useModalStore.getState().openModal('loading', { message: 'First' })
      useModalStore.getState().openModal('loading', { message: 'Second' })

      const state = useModalStore.getState()
      expect(state.type).toBe('loading')
      expect(state.props).toEqual({ message: 'Second' })
    })
  })

  describe('closeModal', () => {
    it('should reset type and props to null', () => {
      useModalStore.getState().openModal('loading', { message: 'Loading...' })
      useModalStore.getState().closeModal()

      const state = useModalStore.getState()
      expect(state.type).toBeNull()
      expect(state.props).toBeNull()
    })
  })

  describe('isOpen', () => {
    it('should return true when modal type matches', () => {
      useModalStore.getState().openModal('loading', { message: 'Loading...' })

      const result = useModalStore.getState().isOpen('loading')

      expect(result).toBe(true)
    })

    it('should return false when modal type does not match', () => {
      useModalStore.getState().openModal('loading', { message: 'Loading...' })

      const result = useModalStore.getState().isOpen(null)

      expect(result).toBe(false)
    })

    it('should return false when no modal is open', () => {
      const result = useModalStore.getState().isOpen('loading')

      expect(result).toBe(false)
    })
  })

  describe('$reset', () => {
    it('should reset state to defaults', () => {
      useModalStore.getState().openModal('loading', { message: 'Loading...' })
      useModalStore.getState().$reset()

      const state = useModalStore.getState()
      expect(state.type).toBeNull()
      expect(state.props).toBeNull()
    })
  })
})
