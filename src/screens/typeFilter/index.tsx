import ErrorScreen from '@/components/common/ErrorScreen'
import { useLoadingModal } from '@/hooks/useLoadingModal'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import PokemonGrid from './_parts/PokemonGrid'
import TypeFilterHeader from './_parts/TypeFilterHeader'
import { useTypeFilterScreen } from './hooks/useTypeFilterScreen'

export default function TypeFilterScreen() {
  const { data, status, actions } = useTypeFilterScreen()

  const showLoading = status.loading || status.isLoading
  useLoadingModal(showLoading && !status.isCached, 'LOADING POKEMON')

  if (status.error) {
    return (
      <ErrorScreen
        error={status.error}
        onGoBack={actions.onGoBack}
        backgroundColor={data.typeColor as string}
        errorColor="white"
        goBackColor="white"
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: data.typeColor as string }}>
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
