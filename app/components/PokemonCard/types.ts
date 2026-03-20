import { PokemonCardVariant } from "app/types/pokemonCardVariant"

// Base data for the PokemonCard module
export interface PokemonCardData {
  id: number
  name: string
  sprite?: string | null
  variant?: PokemonCardVariant
  primaryType?: string
  types?: Array<{ 
    slot: number
    type: {
      name: string
      url: string
    }
  }>
}

// Discriminated union for main props controlling RemoveButton visibility
export type PokemonCardProps =
  | {
      // LIST variant - removal not applicable
      id: number; name: string; sprite?: string | null; variant: PokemonCardVariant.LIST; primaryType?: string; types?: PokemonCardData['types']; displayRemoveButton?: boolean; onRemove?: never; onSelect?: (id: number) => void; onNavigate?: (id: number) => void
    }
  | {
      // Other variants - removal can be enabled via onRemove
      id: number; name: string; sprite?: string | null; variant: Exclude<PokemonCardVariant, PokemonCardVariant.LIST>; primaryType?: string; types?: PokemonCardData['types']; displayRemoveButton?: boolean; onRemove?: (id: number) => void; onSelect?: (id: number) => void; onNavigate?: (id: number) => void
    }
    
// Sub-component prop interfaces (imported by _parts components)
export type PokemonCardHeaderProps = PokemonCardData
export type PokemonCardRemoveButtonProps = {
  displayRemoveButton: boolean
  onRemove?: (id: number) => void
  id: number
  variant?: PokemonCardVariant
}
export type PokemonCardSpriteProps = {
  sprite?: string | null
  variant?: PokemonCardVariant
  primaryType?: string
  onError: () => void
  onLoadStart?: () => void
  onLoadEnd?: () => void
}
export type PokemonCardTypesProps = {
  types: Array<{ 
    slot: number
    type: {
      name: string
      url: string
    }
  }>
}
