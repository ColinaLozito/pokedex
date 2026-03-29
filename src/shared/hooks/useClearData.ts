import { useCallback, useMemo } from 'react'
import { Alert } from 'react-native'
import { useUserStore } from '@/store/userStore'
import { clearAllStoredData } from '@/utils/storage/clearStorage'
import { queryClient, asyncStoragePersister } from '@/shared/utils/queryClient'
import { toast } from '@/shared/utils/tamaguiToast'

export function useClearData() {
  const bookmarkedPokemonIds = useUserStore((state) => state.bookmarkedPokemonIds)
  const recentSelections = useUserStore((state) => state.recentSelections)

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

      toast.message('Stored data cleared', {
        description: 'Bookmarks and recent selections have been cleared',
      })
    } catch (error) {
      console.error('Failed to clear stored data:', error)
      toast.error('Error clearing data', {
        description: 'Failed to clear stored data. Please try again.',
      })
    }
  }, [])

  const clearAllData = useCallback(async () => {
    try {
      await clearAllStoredData()
      useUserStore.getState().$reset()
      queryClient.clear()
      await asyncStoragePersister.removeClient()

      toast.message('All data cleared', {
        description: 'Stored data and cached Pokemon have been cleared',
      })
    } catch (error) {
      console.error('Failed to clear all data:', error)
      toast.error('Error clearing data', {
        description: 'Failed to clear data. Please try again.',
      })
    }
  }, [])

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
