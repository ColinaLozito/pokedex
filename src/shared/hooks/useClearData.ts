import { useToastController } from '@tamagui/toast'
import { useCallback, useMemo } from 'react'
import { Alert } from 'react-native'
import { useUserStore } from '@/store/userStore'
import { useShallow } from 'zustand/react/shallow'
import { clearAllStoredData } from '@/utils/storage/clearStorage'
import { queryClient, asyncStoragePersister } from '@/providers/MainProvidersWrapper'

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

  const clearStoredDataOnly = useCallback(async () => {
    try {
      await clearAllStoredData()
      useUserStore.getState().$reset()

      toast.show('Stored data cleared', {
        message: 'Bookmarks and recent selections have been cleared',
      })
    } catch (error) {
      console.error('Failed to clear stored data:', error)
      toast.show('Error clearing data', {
        message: 'Failed to clear stored data. Please try again.',
      })
    }
  }, [toast])

  const clearAllData = useCallback(async () => {
    try {
      await clearAllStoredData()
      useUserStore.getState().$reset()
      queryClient.clear()
      await asyncStoragePersister.removeClient()

      toast.show('All data cleared', {
        message: 'Stored data and cached Pokemon have been cleared',
      })
    } catch (error) {
      console.error('Failed to clear all data:', error)
      toast.show('Error clearing data', {
        message: 'Failed to clear data. Please try again.',
      })
    }
  }, [toast])

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear Data',
      'What would you like to clear?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Stored Data Only',
          style: 'destructive',
          onPress: clearStoredDataOnly,
        },
        {
          text: 'All Data (Including Cache)',
          style: 'destructive',
          onPress: clearAllData,
        },
      ],
      { cancelable: true }
    )
  }, [clearStoredDataOnly, clearAllData])

  return {
    hasStoredData,
    handleClearData,
  }
}
