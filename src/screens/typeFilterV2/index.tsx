import ErrorScreen from '@/components/common/ErrorScreen'
import { useLoadingModal } from '@/hooks/useLoadingModal'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import PokemonGrid from '@/screens/typeFilter/_parts/PokemonGrid'
import TypeFilterHeader from '@/screens/typeFilter/_parts/TypeFilterHeader'
import { useTypeFilterV2Screen } from '@/screens/typeFilterV2/hooks/useTypeFilterV2Screen'

export default function TypeFilterV2Screen() {
  const { data, status, actions } = useTypeFilterV2Screen()

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
