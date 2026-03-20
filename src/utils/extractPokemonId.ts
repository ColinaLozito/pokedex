/**
 * Extract Pokémon ID from PokéAPI URL
 * Works with both /pokemon/ and /pokemon-species/ URLs
 * @param url - PokéAPI Pokemon or Pokemon species URL
 * @returns Pokemon ID as number, or 0 if not found
 * @example
 * extractPokemonId("https://pokeapi.co/api/v2/pokemon/25/") // Returns 25
 * extractPokemonId("https://pokeapi.co/api/v2/pokemon-species/25/") // Returns 25
 */
export function extractPokemonId(url: string): number {
  // Match both /pokemon/{id} and /pokemon-species/{id}
  const matches = url.match(/\/pokemon(?:-species)?\/(\d+)\/?/)
  return matches ? parseInt(matches[1], 10) : 0
}

/**
 * Extract Type ID from PokéAPI URL
 * @param url - PokéAPI type URL
 * @returns Type ID as number, or 0 if not found
 * @example
 * extractTypeId("https://pokeapi.co/api/v2/type/1/") // Returns 1
 * extractTypeId("https://pokeapi.co/api/v2/type/12/") // Returns 12
 */
export function extractTypeId(url: string): number {
  const matches = url.match(/\/type\/(\d+)\//)
  return matches ? parseInt(matches[1], 10) : 0
}