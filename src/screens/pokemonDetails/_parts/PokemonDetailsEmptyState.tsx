import EmptyStateScreen from '@/components/common/EmptyStateScreen'
import type { PokemonDetailsEmptyStateProps } from '../types'

export default function PokemonDetailsEmptyState({
  title = "No Pokémon data available",
  subtitle = "Please select a Pokémon first",
}: PokemonDetailsEmptyStateProps) {
  return (
    <EmptyStateScreen
      title={title}
      subtitle={subtitle}
    />
  )
}
