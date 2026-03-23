import { useCallback, useMemo } from 'react'
import PokemonCard from '@/components/pokemon/PokemonCard'
import { PokemonCardVariant } from '@/types/pokemonCardVariant'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'
import { LegendList } from '@legendapp/list'
import { YStack } from 'tamagui'

interface PokemonGridProps {
  data: PokemonDisplayDataArray
  onSelect: (id: number) => Promise<void>
}

export default function PokemonGrid({ data, onSelect }: PokemonGridProps) {
  const renderItem = useCallback(({ item }: { item: PokemonDisplayDataArray[number] }) => (
    <YStack p={4}>
      <PokemonCard
        id={item.id}
        name={item.name}
        variant={PokemonCardVariant.LIST}
        sprite={item.sprite}
        primaryType={item.primaryType}
        types={item.types}
        onSelect={onSelect}
      />
    </YStack>
  ), [onSelect])

  const keyExtractor = useCallback((item: PokemonDisplayDataArray[number]) => 
    item.id.toString(), [])

  const ItemSeparator = useCallback(() => <YStack height={8} />, [])

  return (
    <LegendList
      data={data}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparator}
      drawDistance={500}
      initialScrollIndex={0}
      style={{ flex: 1 }}
    />
  )
}
