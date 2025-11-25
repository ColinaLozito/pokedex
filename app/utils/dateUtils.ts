// Maximum Pokemon ID for random generation (PokéAPI has Pokemon up to #1000+)
const MAX_POKEMON_ID = 1000

/**
 * Get today's date string in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/**
 * Check if a given date string is different from today
 */
export function isNewDay(dateString: string | null): boolean {
  if (!dateString) return true
  return dateString !== getTodayDateString()
}

/**
 * Generate a random Pokemon ID between 1 and MAX_POKEMON_ID
 * @returns Random Pokemon ID between 1 and 1000
 */
export function generateRandomPokemonId(): number {
  return Math.floor(Math.random() * MAX_POKEMON_ID) + 1
}

