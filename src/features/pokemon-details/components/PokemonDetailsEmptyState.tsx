import EmptyStateScreen from '@/shared/components/ui/atomic/EmptyStateScreen'
import type { PokemonDetailsEmptyStateProps } from '../details.types'

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
