import { setToastController, showToast } from '@/utils/ui/toast'

describe('toast', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  describe('showToast', () => {
    it('should not throw when no controller is set', () => {
      expect(() => showToast('Test')).not.toThrow()
    })

    it('should not throw when controller is set but show is called', () => {
      const mockShow = jest.fn()
      const mockController = { show: mockShow } as never

      setToastController(mockController)
      showToast('Test Title', 'Test Message')

      expect(mockShow).toHaveBeenCalledWith('Test Title', { message: 'Test Message' })
    })

    it('should call show with title only', () => {
      const mockShow = jest.fn()
      const mockController = { show: mockShow } as never

      setToastController(mockController)
      showToast('Test Title')

      expect(mockShow).toHaveBeenCalledWith('Test Title', { message: undefined })
    })
  })

  describe('setToastController', () => {
    it('should set the toast controller', () => {
      const mockController = { show: jest.fn() } as never

      setToastController(mockController)

      expect(() => showToast('Test')).not.toThrow()
    })
  })
})
