import ErrorScreen from '@/components/common/ErrorScreen'
import { useLoadingModal } from '@/hooks/useLoadingModal'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import PokemonGrid from './_parts/PokemonGrid'
import TypeFilterHeader from './_parts/TypeFilterHeader'
import { useTypeFilterData } from './hooks/useTypeFilterData'

export default function TypeFilterScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ typeId: string; typeName: string }>()
  
  const typeId = params.typeId ? parseInt(params.typeId, 10) : null
  const typeName = params.typeName || 'Unknown'

  const {
    filteredData,
    loading,
    isLoading,
    error,
    typeColor,
    typeIcon,
    handleSelect,
  } = useTypeFilterData(typeId, typeName)

  useLoadingModal(loading || isLoading, 'LOADING POKEMON')

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onGoBack={() => router.back()}
        backgroundColor={typeColor}
        errorColor="white"
        goBackColor="white"
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: typeColor }}>
      <YStack flex={1}>
        <TypeFilterHeader
          typeName={typeName}
          typeColor={typeColor}
          typeIcon={typeIcon}
        />

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
