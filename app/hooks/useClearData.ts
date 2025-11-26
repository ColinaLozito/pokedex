import { useToastController } from '@tamagui/toast'
import { useCallback, useMemo } from 'react'
import { Alert } from 'react-native'
import { useDailyPokemonStore } from '../store/dailyPokemonStore'
import { usePokemonDataStore } from '../store/pokemonDataStore'
import { usePokemonGeneralStore } from '../store/pokemonGeneralStore'
import { clearAllStoredData } from '../utils/clearStorage'

/**
 * Custom hook for managing data clearing functionality
 * 
 * @returns Object with:
 *   - hasStoredData: boolean indicating if there's any stored data
 *   - handleClearData: callback function to trigger the clear data flow
 */
export function useClearData() {
  const toast = useToastController()

  // Check if there's any stored data
  const pokemonDetails = usePokemonDataStore((state) => state.pokemonDetails)
  const bookmarkedPokemonIds = usePokemonGeneralStore((state) => state.bookmarkedPokemonIds)
  const parentBookmarkedPokemonIds = usePokemonGeneralStore(
    (state) => state.parentBookmarkedPokemonIds
  )
  const recentSelections = usePokemonGeneralStore((state) => state.recentSelections)
  const dailyPokemonId = useDailyPokemonStore((state) => state.dailyPokemonId)

  // Check if there's any data to clear
  const hasStoredData = useMemo(() => {
    return (
      Object.keys(pokemonDetails).length > 0 ||
      bookmarkedPokemonIds.length > 0 ||
      parentBookmarkedPokemonIds.length > 0 ||
      recentSelections.length > 0 ||
      dailyPokemonId !== null
    )
  }, [
    pokemonDetails,
    bookmarkedPokemonIds,
    parentBookmarkedPokemonIds,
    recentSelections,
    dailyPokemonId,
  ])

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all stored data? This will remove all bookmarks, recent selections, and cached Pokémon data. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await clearAllStoredData()

              // Reset all stores to initial state using setState
              usePokemonDataStore.setState({
                pokemonDetails: {},
                currentPokemonId: null,
              })

              usePokemonGeneralStore.setState({
                bookmarkedPokemonIds: [],
                parentBookmarkedPokemonIds: [],
                recentSelections: [],
              })

              useDailyPokemonStore.setState({
                dailyPokemonId: null,
                dailyPokemonDate: null,
                rerollCount: 0,
                rerollDate: null,
              })

              toast.show('All stored data cleared', {
                message: 'All stored data has been cleared successfully',
              })
            } catch (error) {
              console.error('Failed to clear stored data:', error)
              toast.show('Error clearing data', {
                message: 'Failed to clear stored data. Please try again.',
              })
            }
          },
        },
      ],
      { cancelable: true }
    )
  }, [toast])

  return {
    hasStoredData,
    handleClearData,
  }
}
