import { PokemonDetail } from '@/services/types'; // Ajusta según tu modelo
import { GetThemeValueForKey } from '@tamagui/core';
import type { CombinedPokemonDetail } from 'src/services/types';

export interface PokemonDetailsHeaderProps {
  pokemon: CombinedPokemonDetail
  isBookmarked: boolean
  onBookmarkPress: () => void
  primaryTypeColor: string | GetThemeValueForKey<'backgroundColor'>
}

export interface PokemonDetailsContentProps {
  pokemon: CombinedPokemonDetail
  primaryTypeColor: string | GetThemeValueForKey<'backgroundColor'>
  onEvolutionPress: (id: number) => Promise<void>
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
}

export interface PokemonDetailsEmptyStateProps {
  title?: string
  subtitle?: string
}

export interface PokemonDetailsState {
  // Data & UI State
  pokemon: PokemonDetail | undefined
  isBookmarked: boolean
  primaryTypeColor: GetThemeValueForKey<"backgroundColor">
  
  // Status
  loading: boolean
  error: string | null
  
  // Handlers & Actions
  handleEvolutionPress: (id: number) => Promise<void>
  handleBookmarkPress: () => void
  clearError: () => void
}
