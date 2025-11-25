import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEYS = [
  'pokemon-data-storage',
  'pokemon-general-storage',
  'daily-pokemon-storage',
] as const

/**
 * Clears all persisted store data from AsyncStorage
 */
export async function clearAllStoredData(): Promise<void> {
  try {
    await Promise.all(
      STORAGE_KEYS.map((key) => AsyncStorage.removeItem(key))
    )
  } catch (error) {
    console.error('Failed to clear stored data:', error)
    throw error
  }
}
