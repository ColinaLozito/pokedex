// PokéAPI service layer
// This file will contain all API calls to PokéAPI

import { extractPokemonId, extractTypeId } from "app/helpers/extractPokemonId"

const BASE_URL = 'https://pokeapi.co/api/v2/'

export interface PokemonResponse {
  id: number
  name: string
  [key: string]: any
}

export interface PokemonListItem {
  id: number
  name: string
}

export interface TypeListItem {
  id: number
  name: string
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    front_shiny: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
      home?: {
        front_default: string | null
      }
    }
  }
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
      url: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
  }>
}

export interface PokemonSpecies {
  id: number
  name: string
  evolution_chain: {
    url: string
  }
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
      url: string
    }
    version: {
      name: string
      url: string
    }
  }>
  genera: Array<{
    genus: string
    language: {
      name: string
      url: string
    }
  }>
  habitat: {
    name: string
    url: string
  } | null
  is_legendary: boolean
  is_mythical: boolean
}

export interface EvolutionChainLink {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionChainLink[]
}

export interface EvolutionChain {
  id: number
  chain: EvolutionChainLink
}

export interface EvolutionPokemon {
  id: number
  name: string
  // Note: sprite will be retrieved from store when rendering
}

export interface CombinedPokemonDetail {
  // From /pokemon/{id}
  id: number
  name: string
  height: number
  weight: number
  sprites: PokemonDetail['sprites']
  types: PokemonDetail['types']
  stats: PokemonDetail['stats']
  abilities: PokemonDetail['abilities']
  
  // From /pokemon-species/{id}
  speciesInfo: {
    genus: string
    flavorText: string
    habitat: string | null
    isLegendary: boolean
    isMythical: boolean
  }
  
  // Evolution chain (flat array for backward compatibility)
  evolutionChain: EvolutionPokemon[]
  
  // Full evolution chain tree structure
  evolutionChainTree?: EvolutionChainLink
}

/**
 * Fetch a random Pokémon
 */
export async function fetchRandomPokemon(): Promise<PokemonResponse> {
  // This will be implemented to fetch a random Pokémon
  // For now, return a placeholder
  throw new Error('Not implemented yet')
}

/**
 * Fetch a Pokémon by ID with full details
 */
export async function fetchPokemonById(id: number): Promise<PokemonDetail> {
  try {
    const response = await fetch(`${BASE_URL}pokemon/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data as PokemonDetail
  } catch (error) {
    console.error(`Error fetching Pokémon ${id}:`, error)
    throw error
  }
}

/**
 * Fetch Pokémon species information
 */
export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  try {
    const response = await fetch(`${BASE_URL}pokemon-species/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch species: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data as PokemonSpecies
  } catch (error) {
    console.error(`Error fetching species ${id}:`, error)
    throw error
  }
}

/**
 * Fetch evolution chain by URL
 */
export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch evolution chain: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data as EvolutionChain
  } catch (error) {
    console.error(`Error fetching evolution chain:`, error)
    throw error
  }
}

/**
 * Extract evolution chain into a flat array of Pokemon
 */
function extractEvolutionChain(chain: EvolutionChainLink): { name: string; url: string }[] {
  const pokemon: { name: string; url: string }[] = []
  
  const traverse = (link: EvolutionChainLink) => {
    pokemon.push({
      name: link.species.name,
      url: link.species.url
    })
    
    if (link.evolves_to && link.evolves_to.length > 0) {
      link.evolves_to.forEach(traverse)
    }
  }
  
  traverse(chain)
  return pokemon
}


/**
 * Fetch complete Pokemon details including species and evolution chain
 * This version fetches FULL data for each Pokemon in the evolution chain
 * @param id - Pokemon ID to fetch
 * @param existingCache - Existing cache of basic Pokemon data to avoid refetching
 * @param cacheCallback - Optional callback to store evolution Pokemon in external cache
 */
export async function fetchCompletePokemonDetail(
  id: number, 
  existingCache?: Record<number, PokemonDetail>,
  cacheCallback?: (id: number, data: PokemonDetail) => void
): Promise<CombinedPokemonDetail> {
  try {
    // Fetch pokemon data and species data in parallel
    const [pokemonData, speciesData] = await Promise.all([
      fetchPokemonById(id),
      fetchPokemonSpecies(id)
    ])
    
    // Fetch evolution chain
    const evolutionChainData = await fetchEvolutionChain(speciesData.evolution_chain.url)
    
    // Extract evolution chain into flat array
    const evolutionSpeciesList = extractEvolutionChain(evolutionChainData.chain)
    
    // Fetch full Pokemon data for each evolution and store via callback
    const evolutionPokemonPromises = evolutionSpeciesList.map(async (species) => {
      const speciesId = extractPokemonId(species.url)
      
      if (speciesId === 0) {
        throw new Error(`Could not extract Pokemon ID from URL: ${species.url}`)
      }
      
      // Check cache first to avoid duplicate fetches
      let pokemonDetails: PokemonDetail
      if (existingCache && existingCache[speciesId]) {
        pokemonDetails = existingCache[speciesId]
      } else {
        pokemonDetails = await fetchPokemonById(speciesId)
        
        // IMPORTANT: Cache the fetched data via callback so it's available in store
        if (cacheCallback) {
          cacheCallback(speciesId, pokemonDetails)
        }
      }
      
      // Return just ID and name - sprite will be retrieved from store when rendering
      return {
        id: speciesId,
        name: species.name
      }
    })
    
    const evolutionChain = await Promise.all(evolutionPokemonPromises)
    
    // Get English flavor text
    const englishFlavorText = speciesData.flavor_text_entries
      .find(entry => entry.language.name === 'en')?.flavor_text
      .replace(/\f/g, ' ') || 'No description available.'
    
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
  } catch (error) {
    console.error(`Error fetching complete Pokemon detail for ID ${id}:`, error)
    throw error
  }
}

/**
 * Fetch complete list of Pokémon (up to 2000)
 * Transforms the response from { name, url } to { id, name }
 */
export async function fetchPokemonList(): Promise<PokemonListItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=2000`)
    const data = await response.json()

    // Transform the results to extract ID from URL
    const transformedList: PokemonListItem[] = (data.results || []).map((pokemon: { name: string; url: string }) => ({
      id: extractPokemonId(pokemon.url),
      name: pokemon.name,
    }))
    
    return transformedList
  } catch (error) {
    console.error('Error fetching Pokémon list:', error)
    throw error
  }
}

/**
 * Fetch complete list of Pokémon types
 * Transforms the response from { name, url } to { id, name }
 */
export async function fetchTypeList(): Promise<TypeListItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/type`)
    const data = await response.json()
    
    // Transform the results to extract ID from URL
    const transformedList: TypeListItem[] = (data.results || []).map((type: { name: string; url: string }) => ({
      id: extractTypeId(type.url),
      name: type.name,
    }))
    
    // Filter out "unknown" and "shadow" types (special types not commonly used)
    const filteredList = transformedList.filter(
      (type) => type.name !== 'unknown' && type.name !== 'shadow'
    )
    
    return filteredList
  } catch (error) {
    console.error('Error fetching type list:', error)
    throw error
  }
}

/**
 * Type response from PokéAPI
 */
export interface TypeResponse {
  id: number
  name: string
  pokemon: Array<{
    pokemon: {
      name: string
      url: string
    }
    slot: number
  }>
}

/**
 * Fetch Pokemon by type ID or name
 * Returns list of Pokemon with their IDs
 */
export async function fetchPokemonByType(typeIdOrName: number | string): Promise<PokemonListItem[]> {
  try {
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
  } catch (error) {
    console.error(`[TYPE FETCH] Error fetching Pokemon by type ${typeIdOrName}:`, error)
    throw error
  }
}

