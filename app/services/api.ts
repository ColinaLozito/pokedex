// PokéAPI service layer
// This file will contain all API calls to PokéAPI

import { extractEvolutionChain } from "app/utils/evolutionTree"
import { extractPokemonId, extractTypeId } from "app/utils/extractPokemonId"
import type {
  CombinedPokemonDetail,
  EvolutionChain,
  PokemonDetail,
  PokemonListItem,
  PokemonSpecies,
  TypeListItem,
  TypeResponse,
} from './types'

const BASE_URL = 'https://pokeapi.co/api/v2/'

// Re-export types for backward compatibility
export type {
  CombinedPokemonDetail,
  EvolutionChain,
  EvolutionChainLink,
  EvolutionPokemon,
  PokemonDetail,
  PokemonListItem,
  PokemonResponse,
  PokemonSpecies,
  TypeListItem,
  TypeResponse
} from './types'

/**
 * Fetch a Pokémon by ID with full details
 */
export async function fetchPokemonById(id: number): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}pokemon/${id}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon: ${response.status}`)
  }
  
  const data = await response.json()
  
  return data as PokemonDetail
}

/**
 * Fetch Pokémon species information
 */
export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const response = await fetch(`${BASE_URL}pokemon-species/${id}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch species: ${response.status}`)
  }
  
  const data = await response.json()
  
  return data as PokemonSpecies
}

/**
 * Fetch evolution chain by URL
 */
export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain: ${response.status}`)
  }
  
  const data = await response.json()
  
  return data as EvolutionChain
}

/**
 * Fetch complete Pokemon details including species and evolution chain
 * Evolution chain contains only IDs and names (from API response)
 * Sprites are retrieved from pokemonDetails cache when rendering, or fallback to ID-based URL
 * @param id - Pokemon ID to fetch
 */
export async function fetchCompletePokemonDetail(
  id: number
): Promise<CombinedPokemonDetail> {
  // Fetch pokemon data and species data in parallel
  const [pokemonData, speciesData] = await Promise.all([
    fetchPokemonById(id),
    fetchPokemonSpecies(id)
  ])
  
  // Fetch evolution chain
  const evolutionChainData = await fetchEvolutionChain(speciesData.evolution_chain.url)
  
  // Extract evolution chain into flat array with just IDs and names
  // Names are already in the API response, no need to fetch separately
  const evolutionSpeciesList = extractEvolutionChain(evolutionChainData.chain)
  
  const evolutionChain = evolutionSpeciesList.map((species) => {
    const speciesId = extractPokemonId(species.url)
    
    if (speciesId === 0) {
      throw new Error(`Could not extract Pokemon ID from URL: ${species.url}`)
    }
    
    // Return just ID and name - sprite will be retrieved from pokemonDetails cache when rendering
    return {
      id: speciesId,
      name: species.name
    }
  })
  
  // Get English flavor text
  const englishFlavorText = speciesData.flavor_text_entries
    .find(entry => entry.language.name === 'en')?.flavor_text
    ?.replace(/\f/g, ' ') || 'No description available.'
  
  // Get English genus
  const englishGenus = speciesData.genera
    .find(genus => genus.language.name === 'en')?.genus || 'Unknown'
  
  const combinedDetail: CombinedPokemonDetail = {
    // From pokemon data
    id: pokemonData.id,
    name: pokemonData.name,
    height: pokemonData.height,
    weight: pokemonData.weight,
    sprites: pokemonData.sprites,
    types: pokemonData.types,
    stats: pokemonData.stats,
    abilities: pokemonData.abilities,
    
    // From species data
    speciesInfo: {
      genus: englishGenus,
      flavorText: englishFlavorText,
      habitat: speciesData.habitat?.name || null,
      isLegendary: speciesData.is_legendary,
      isMythical: speciesData.is_mythical
    },
    
    // Evolution chain (flat array for backward compatibility)
    evolutionChain,
    
    // Full evolution chain tree structure
    evolutionChainTree: evolutionChainData.chain
  }
  
  return combinedDetail
}

/**
 * Fetch complete list of Pokémon (up to 2000)
 * Transforms the response from { name, url } to { id, name }
 */
export async function fetchPokemonList(): Promise<PokemonListItem[]> {
  const response = await fetch(`${BASE_URL}pokemon?limit=2000`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.status}`)
  }
  
  const data = await response.json()

  // Transform the results to extract ID from URL
  const transformedList: PokemonListItem[] = (data.results || []).map(
    (pokemon: { name: string; url: string }) => ({
      id: extractPokemonId(pokemon.url),
      name: pokemon.name,
    })
  )
  
  return transformedList
}

/**
 * Fetch complete list of Pokémon types
 * Transforms the response from { name, url } to { id, name }
 */
export async function fetchTypeList(): Promise<TypeListItem[]> {
  const response = await fetch(`${BASE_URL}type`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch type list: ${response.status}`)
  }
  
  const data = await response.json()
    
  // Transform the results to extract ID from URL
  const transformedList: TypeListItem[] = (data.results || []).map(
    (type: { name: string; url: string }) => ({
      id: extractTypeId(type.url),
      name: type.name,
    })
  )
  
  // Filter out "unknown" and "shadow" types (special types not commonly used)
  const filteredList = transformedList.filter(
    (type) => type.name !== 'unknown' && type.name !== 'shadow'
  )
  
  return filteredList
}


/**
 * Fetch Pokemon by type ID or name
 * Returns list of Pokemon with their IDs
 */
export async function fetchPokemonByType(
  typeIdOrName: number | string
): Promise<PokemonListItem[]> {
  const response = await fetch(`${BASE_URL}type/${typeIdOrName}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch type: ${response.status}`)
  }
  
  const data: TypeResponse = await response.json()
  
  // Transform to PokemonListItem format
  const pokemonList: PokemonListItem[] = data.pokemon.map((entry) => ({
    id: extractPokemonId(entry.pokemon.url),
    name: entry.pokemon.name,
  }))
  
  return pokemonList
}

