import { clearAllStoredData } from '../storage/clearStorage'

jest.mock('@react-native-async-storage/async-storage', () => ({
  removeItem: jest.fn().mockResolvedValue(undefined),
}))

import AsyncStorage from '@react-native-async-storage/async-storage'

describe('clearStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should clear all storage keys', async () => {
    await clearAllStoredData()

    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(3)
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('pokemon-data-storage')
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('pokemon-general-storage')
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('daily-pokemon-storage')
  })

  it('should call removeItem in parallel', async () => {
    await clearAllStoredData()

    const mockRemoveItem = AsyncStorage.removeItem as jest.Mock
    const allCalls = mockRemoveItem.mock.calls.map(([key]) => key)
    expect(allCalls).toContain('pokemon-data-storage')
    expect(allCalls).toContain('pokemon-general-storage')
    expect(allCalls).toContain('daily-pokemon-storage')
  })
})
