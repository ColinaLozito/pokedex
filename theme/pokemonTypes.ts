export const POKEMON_TYPES = {
  NORMAL: 'normal',
  FIRE: 'fire',
  WATER: 'water',
  ELECTRIC: 'electric',
  GRASS: 'grass',
  ICE: 'ice',
  FIGHTING: 'fighting',
  POISON: 'poison',
  GROUND: 'ground',
  FLYING: 'flying',
  PSYCHIC: 'psychic',
  BUG: 'bug',
  ROCK: 'rock',
  GHOST: 'ghost',
  DRAGON: 'dragon',
  DARK: 'dark',
  STEEL: 'steel',
  FAIRY: 'fairy',
  STELLAR: 'stellar',
} as const

export type PokemonType = typeof POKEMON_TYPES[keyof typeof POKEMON_TYPES]
