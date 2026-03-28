import { useToastController } from '@tamagui/toast'
import { useCallback, useMemo } from 'react'
import { Alert } from 'react-native'
import { useUserStore } from '@/store/userStore'
import { useShallow } from 'zustand/react/shallow'
import { clearAllStoredData } from '@/utils/storage/clearStorage'

export function useClearData() {
  const toast = useToastController()

  const { bookmarkedPokemonIds, recentSelections } = useUserStore(
    useShallow((state) => ({
      bookmarkedPokemonIds: state.bookmarkedPokemonIds,
      recentSelections: state.recentSelections,
    }))
  )

  const hasStoredData = useMemo(() => {
    return (
      bookmarkedPokemonIds.length > 0 ||
      recentSelections.length > 0
    )
  }, [
    bookmarkedPokemonIds,
    recentSelections,
  ])

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all stored data? This will remove all bookmarks and recent selections. This action cannot be undone.',
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
              await clearAllStoredData()
              useUserStore.getState().$reset()

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
