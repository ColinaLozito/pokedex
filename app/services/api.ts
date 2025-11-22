// PokéAPI service layer
// This file will contain all API calls to PokéAPI

import { extractPokemonId } from "app/helpers/extractPokemonId"

const BASE_URL = 'https://pokeapi.co/api/v2'

export interface PokemonResponse {
  id: number
  name: string
  [key: string]: any
}

export interface PokemonListItem {
  id: number
  name: string
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
 * Fetch a Pokémon by ID
 */
export async function fetchPokemonById(id: number): Promise<PokemonResponse> {
  // This will be implemented to fetch a Pokémon by ID
  throw new Error('Not implemented yet')
}

/**
 * Fetch complete list of Pokémon (up to 2000)
 * Transforms the response from { name, url } to { id, name }
 */
export async function fetchPokemonList(): Promise<PokemonListItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=2000`)
    const data = await response.json()
    
    // Log the raw response to inspect structure
    console.log('PokéAPI Raw Response (first 3 items):', JSON.stringify(data.results?.slice(0, 3), null, 2))
    console.log('Number of Pokémon fetched:', data.results?.length || 0)
    
    // Transform the results to extract ID from URL
    const transformedList: PokemonListItem[] = (data.results || []).map((pokemon: { name: string; url: string }) => ({
      id: extractPokemonId(pokemon.url),
      name: pokemon.name,
    }))
    
    // Log the transformed result
    console.log('Transformed List (first 3 items):', JSON.stringify(transformedList.slice(0, 3), null, 2))
    console.log('Total transformed:', transformedList.length)
    
    return transformedList
  } catch (error) {
    console.error('Error fetching Pokémon list:', error)
    throw error
  }
}

