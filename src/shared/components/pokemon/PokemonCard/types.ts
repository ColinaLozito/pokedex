import type { PokemonTypeSlot } from "@/shared/types/pokemon.domain"
import { TEST_IDS } from '@/shared/tests/mocks/test-ids'

// Base data for the PokemonCard module

export enum PokemonCardVariant {
  LIST = 'list',
  BOOKMARK = 'bookmark',
  RECENT = 'recent', // Added a new variant for recently viewed Pokemon
}
export interface PokemonCardData {
  id: number
  name: string
  sprite?: string | null
  variant?: PokemonCardVariant
  primaryType?: string
  types?: Array<PokemonTypeSlot>
}

// Discriminated union for main props controlling RemoveButton visibility
export type PokemonCardProps =
  | {
      // LIST variant - removal not applicable
      id: number; 
      name: string; 
      sprite?: string | null; 
      variant: PokemonCardVariant.LIST; 
      primaryType?: string; types?: 
      PokemonCardData['types']; 
      onRemove?: never; 
      onSelect?: (id: number) => void; 
      onNavigate?: (id: number) => void
      testID?: string
    }
  | {
      // Other variants - removal can be enabled via onRemove
      id: 
      number; 
      name: string; 
      sprite?: string | null; 
      variant: Exclude<PokemonCardVariant, PokemonCardVariant.LIST>; 
      primaryType?: string; 
      types?: PokemonCardData['types'];
      onRemove?: (id: number) => void; 
      onSelect?: (id: number) => void;
      onNavigate?: (id: number) => void
      testID?: string
    }
    
// Sub-component prop interfaces (imported by _parts components)
export type PokemonCardHeaderProps = PokemonCardData

export type PokemonCardRemoveButtonProps = {
  onRemove?: (id: number) => void
  id: number
  variant?: PokemonCardVariant
  baseID?: string
}

export type PokemonCardSpriteProps = {
  sprite?: string | null
  baseID?: string
}

export type PokemonCardTypesProps = {
  types: Array<PokemonTypeSlot>
  primaryType?: string
  baseID?: string
}

export const DEFAULT_POKEMON_CARD_TEST_ID = TEST_IDS.shared.pokemonCard
