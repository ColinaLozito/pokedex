import ErrorScreen from '@/shared/components/ui/atomic/ErrorScreen'
import { useLoadingModal } from '@/shared/hooks/useLoadingModal'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import PokemonGrid from './components/PokemonGrid'
import TypeFilterHeader from './components/TypeFilterHeader'
import { useTypeFilterScreen } from './hooks/use-type-filter.screen'

export default function TypeFilterScreen() {
  const { data, status, actions } = useTypeFilterScreen()

  const showLoading = status.loading
  useLoadingModal(showLoading, 'LOADING POKEMON')

  if (status.error) {
    return (
      <ErrorScreen
        error={status.error}
        onGoBack={actions.onGoBack}
        backgroundColor={data.typeColor}
        errorColor="white"
        goBackColor="white"
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: data.typeColor }}>
      <YStack flex={1}>
        <TypeFilterHeader typeName={data.typeName} typeIcon={data.typeIcon} />

        <YStack
          flex={1}
          bg="white"
          borderTopLeftRadius="$4"
          borderTopRightRadius="$4"
          mt="$2"
          pt="$2"
          px="$2"
        >
          <PokemonGrid 
            data={data.filteredData} 
            onSelect={actions.handleSelect}
            hasMore={data.hasMore}
            onLoadMore={actions.loadMore}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}
