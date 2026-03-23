import ErrorScreen from '@/components/common/ErrorScreen'
import { useLoadingModal } from '@/hooks/useLoadingModal'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import PokemonGrid from './_parts/PokemonGrid'
import TypeFilterHeader from './_parts/TypeFilterHeader'
import { useTypeFilterScreen } from './hooks/useTypeFilterScreen'

export default function TypeFilterScreen() {
  const {
    filteredData,
    loading,
    isLoading,
    error,
    typeName,
    typeColor,
    typeIcon,
    handleSelect,
    onGoBack,
  } = useTypeFilterScreen()

  useLoadingModal(loading || isLoading, 'LOADING POKEMON')

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onGoBack={onGoBack}
        backgroundColor={typeColor as string}
        errorColor="white"
        goBackColor="white"
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: typeColor as string }}>
      <YStack flex={1}>
        <TypeFilterHeader typeName={typeName} typeIcon={typeIcon} />

        <YStack
          flex={1}
          bg="white"
          borderTopLeftRadius={24}
          borderTopRightRadius={24}
          mt={8}
          pt={16}
          px={8}
        >
          <PokemonGrid data={filteredData} onSelect={handleSelect} />
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}
