import type {
  CombinedPokemonDetail,
  EvolutionChainLink,
  EvolutionPokemon,
  PokemonListItem,
  PokemonTypeSlot,
  PokemonStatEntry,
  PokemonAbilityEntry,
  SpeciesInfo,
  Sprites,
} from '@/shared/types/pokemon.domain'

export function createMockSprites(overrides?: Partial<Sprites>): Sprites {
  return {
    front_default: 'https://example.com/sprite.png',
    front_shiny: 'https://example.com/sprite-shiny.png',
    other: {
      'official-artwork': {
        front_default: 'https://example.com/official.png',
      },
      home: {
        front_default: 'https://example.com/home.png',
      },
    },
    ...overrides,
  }
}

export function createMockSpeciesInfo(overrides?: Partial<SpeciesInfo>): SpeciesInfo {
  return {
    genus: 'Seed Pokemon',
    flavorText: 'A strange seed was planted on its back at birth.',
    habitat: 'forest',
    isLegendary: false,
    isMythical: false,
    ...overrides,
  }
}

export function createMockTypeSlot(typeName: string, slot = 1): PokemonTypeSlot {
  return {
    slot,
    type: {
      name: typeName,
      url: `https://pokeapi.co/api/v2/type/${typeName}/`,
    },
  }
}

export function createMockStatEntry(
  statName: string,
  baseStat: number
): PokemonStatEntry {
  return {
    base_stat: baseStat,
    stat: {
      name: statName,
      url: `https://pokeapi.co/api/v2/stat/${statName}/`,
    },
  }
}

export function createMockAbilityEntry(
  abilityName: string,
  isHidden = false
): PokemonAbilityEntry {
  return {
    ability: {
      name: abilityName,
      url: `https://pokeapi.co/api/v2/ability/${abilityName}/`,
    },
    is_hidden: isHidden,
  }
}

export function createMockEvolutionPokemon(
  overrides?: Partial<EvolutionPokemon>
): EvolutionPokemon {
  return {
    id: 1,
    name: 'bulbasaur',
    ...overrides,
  }
}

export function createMockEvolutionChainLink(
  overrides?: Partial<EvolutionChainLink>
): EvolutionChainLink {
  return {
    species: {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
    },
    evolves_to: [],
    ...overrides,
  }
}

export function createMockPokemonListItem(
  overrides?: Partial<PokemonListItem>
): PokemonListItem {
  return {
    id: 1,
    name: 'bulbasaur',
    ...overrides,
  }
}

export function createMockPokemonList(
  count: number,
  startId = 1
): PokemonListItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    name: `pokemon-${startId + i}`,
  }))
}

export function createMockPokemon(
  overrides?: Partial<CombinedPokemonDetail>
): CombinedPokemonDetail {
  const defaults: CombinedPokemonDetail = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    sprites: createMockSprites(),
    types: [createMockTypeSlot('grass', 1)],
    stats: [createMockStatEntry('hp', 45)],
    abilities: [createMockAbilityEntry('overgrow')],
    speciesInfo: createMockSpeciesInfo(),
    evolutionChain: [createMockEvolutionPokemon()],
    evolutionChainTree: createMockEvolutionChainLink(),
  }

  if (!overrides) {
    return defaults
  }

  return {
    ...defaults,
    ...overrides,
    sprites: overrides.sprites
      ? { ...defaults.sprites, ...overrides.sprites }
      : defaults.sprites,
    types: overrides.types ?? defaults.types,
    stats: overrides.stats ?? defaults.stats,
    abilities: overrides.abilities ?? defaults.abilities,
    speciesInfo: overrides.speciesInfo
      ? { ...defaults.speciesInfo, ...overrides.speciesInfo }
      : defaults.speciesInfo,
    evolutionChain: overrides.evolutionChain ?? defaults.evolutionChain,
    evolutionChainTree: overrides.evolutionChainTree ?? defaults.evolutionChainTree,
  }
}
