import {
  buildEvolutionTree,
  flattenLinearChain,
  isBranchingEvolution,
  collectEvolutionVariants,
  extractEvolutionChain,
} from '@/utils/evolution/evolutionTree'
import { createMockEvolutionChainLink } from '@/shared/tests/mocks'

jest.mock('@/utils/api/extractId', () => ({
  extractPokemonId: jest.fn((url: string) => {
    const matches = url.match(/\/pokemon(?:-species)?\/(\d+)\/?/)
    return matches ? parseInt(matches[1], 10) : 0
  }),
}))

jest.mock('@/utils/pokemon/sprites', () => ({
  getPokemonSpriteUrl: jest.fn((id: number) => `https://example.com/sprite/${id}.png`),
}))

describe('evolutionTree', () => {
  describe('buildEvolutionTree', () => {
    it('should build tree from EvolutionChainLink', () => {
      const chain = createMockEvolutionChainLink()

      const result = buildEvolutionTree(chain)

      expect(result.id).toBe(1)
      expect(result.name).toBe('bulbasaur')
      expect(result.evolvesTo).toEqual([])
    })

    it('should include nested evolutions', () => {
      const chain = createMockEvolutionChainLink({
        evolves_to: [
          createMockEvolutionChainLink({
            species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
          }),
        ],
      })

      const result = buildEvolutionTree(chain)

      expect(result.evolvesTo).toHaveLength(1)
      expect(result.evolvesTo[0].name).toBe('ivysaur')
    })
  })

  describe('flattenLinearChain', () => {
    it('should flatten linear evolution chain', () => {
      const chain = createMockEvolutionChainLink({
        evolves_to: [
          createMockEvolutionChainLink({
            species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
            evolves_to: [
              createMockEvolutionChainLink({
                species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
              }),
            ],
          }),
        ],
      })

      const tree = buildEvolutionTree(chain)
      const result = flattenLinearChain(tree)

      expect(result).toHaveLength(3)
      expect(result.map(n => n.name)).toEqual(['bulbasaur', 'ivysaur', 'venusaur'])
    })

    it('should handle single node', () => {
      const chain = createMockEvolutionChainLink()

      const tree = buildEvolutionTree(chain)
      const result = flattenLinearChain(tree)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('bulbasaur')
    })
  })

  describe('isBranchingEvolution', () => {
    it('should return true for branching evolution', () => {
      const chain = createMockEvolutionChainLink({
        evolves_to: [
          createMockEvolutionChainLink({ species: { name: 'ivysaur', url: '' } }),
          createMockEvolutionChainLink({ species: { name: 'other', url: '' } }),
        ],
      })

      expect(isBranchingEvolution(chain)).toBe(true)
    })

    it('should return false for linear evolution', () => {
      const chain = createMockEvolutionChainLink({
        evolves_to: [
          createMockEvolutionChainLink({ species: { name: 'ivysaur', url: '' } }),
        ],
      })

      expect(isBranchingEvolution(chain)).toBe(false)
    })
  })

  describe('collectEvolutionVariants', () => {
    it('should collect all descendants from branching node', () => {
      const chain = createMockEvolutionChainLink({
        evolves_to: [
          createMockEvolutionChainLink({
            species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
            evolves_to: [
              createMockEvolutionChainLink({
                species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
              }),
            ],
          }),
        ],
      })

      const tree = buildEvolutionTree(chain)
      const result = collectEvolutionVariants(tree)

      expect(result).toHaveLength(2)
      expect(result.map(n => n.name)).toEqual(['ivysaur', 'venusaur'])
    })
  })

  describe('extractEvolutionChain', () => {
    it('should extract flat array from chain', () => {
      const chain = createMockEvolutionChainLink({
        evolves_to: [
          createMockEvolutionChainLink({
            species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
          }),
        ],
      })

      const result = extractEvolutionChain(chain)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('bulbasaur')
      expect(result[1].name).toBe('ivysaur')
    })

    it('should handle empty chain', () => {
      const chain = createMockEvolutionChainLink()

      const result = extractEvolutionChain(chain)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('bulbasaur')
    })
  })
})
