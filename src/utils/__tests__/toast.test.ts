const mockMessage = jest.fn()

jest.mock('@/shared/utils/tamaguiToast', () => ({
  toast: {
    message: mockMessage,
  },
}))

const { showToast } = require('@/utils/ui/toast') as {
  showToast: (title: string, message?: string) => void
}

describe('toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('showToast', () => {
    it('should not throw when no controller is set', () => {
      expect(() => showToast('Test')).not.toThrow()
    })

    it('should call toast.message with title and message', () => {
      showToast('Test Title', 'Test Message')

      expect(mockMessage).toHaveBeenCalledWith('Test Title', {
        description: 'Test Message',
      })
    })

    it('should call toast.message with title only', () => {
      showToast('Test Title')

      expect(mockMessage).toHaveBeenCalledWith('Test Title', {
        description: undefined,
      })
    })
  })
})
