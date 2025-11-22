/**
 * Extract Pokémon ID from PokéAPI URL
 * Example: "https://pokeapi.co/api/v2/pokemon/25/" -> 25
 */
export function extractPokemonId(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
}