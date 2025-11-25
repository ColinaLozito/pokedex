import type { CombinedPokemonDetail, PokemonDetail, PokemonListItem } from '../services/types'
import { getPokemonSprite, getPokemonSpriteUrl } from './pokemonSprites'

export type PokemonDisplayData = Array<{
  id: number
  name: string
  sprite: string | null
  primaryType: string
  types?: Array<{ slot: number; type: { name: string; url: string } }>
}>

/**
 * Transform Pokemon list to display-ready data with sprites and types
 */
export function getPokemonDisplayData(
  pokemonList: PokemonListItem[],
  pokemonDetails: Record<number, CombinedPokemonDetail>,
  basicPokemonCache: Record<number, PokemonDetail>,
  fallbackType?: string
): PokemonDisplayData {
  return pokemonList.map((pokemon) => {
    const fullData = pokemonDetails[pokemon.id]
    const basicData = basicPokemonCache[pokemon.id]
    const types = fullData?.types || basicData?.types || undefined
    const primaryType =
      types?.[0]?.type?.name || fallbackType?.toLowerCase() || 'normal'

    const sprite = fullData
      ? getPokemonSprite(fullData, pokemon.id)
      : basicData
        ? getPokemonSprite(basicData, pokemon.id)
        : getPokemonSpriteUrl(pokemon.id)

    return {
      id: pokemon.id,
      name: pokemon.name,
      sprite,
      primaryType,
      types,
    }
  })
}

