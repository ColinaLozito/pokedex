/**
 * Extract Pokémon ID from PokéAPI URL
 * Works with both /pokemon/ and /pokemon-species/ URLs
 * Example: "https://pokeapi.co/api/v2/pokemon/25/" -> 25
 * Example: "https://pokeapi.co/api/v2/pokemon-species/25/" -> 25
 */
export function extractPokemonId(url: string): number {
    // Match both /pokemon/{id} and /pokemon-species/{id}
    const matches = url.match(/\/pokemon(?:-species)?\/(\d+)\/?/);
    return matches ? parseInt(matches[1], 10) : 0;
}

/**
 * Extract Type ID from PokéAPI URL
 * Example: "https://pokeapi.co/api/v2/type/1/" -> 1
 */
export function extractTypeId(url: string): number {
    const matches = url.match(/\/type\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
}