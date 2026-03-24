import PokemonCard from '@/components/pokemon/PokemonCard'
import { PokemonCardVariant } from '@/types/pokemonCardVariant'
import { LegendList } from '@legendapp/list'
import { useCallback } from 'react'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'
import { YStack } from 'tamagui'
import { PokemonGridProps } from '../types'

export default function PokemonGrid({ data, onSelect, onLoadMore, hasMore }: PokemonGridProps) {
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

  const onEndReached = useCallback(() => {
    if (hasMore && onLoadMore) {
      onLoadMore()
    }
  }, [hasMore, onLoadMore])

  return (
    <LegendList
      data={data}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparator}
      drawDistance={500}
      initialScrollIndex={0}
      onEndReached={onEndReached}
      style={{ flex: 1 }}
    />
  )
}
