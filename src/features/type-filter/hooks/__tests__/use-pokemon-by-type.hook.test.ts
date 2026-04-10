import { renderHook } from '@testing-library/react-native'
import { useQuery } from '@tanstack/react-query'
import { usePokemonByTypeGQL } from '../use-pokemon-by-type.hook'

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>

jest.mock('@/utils/pokemon/sprites', () => ({
  getPokemonSpriteUrl: jest.fn((id: number) => `https://example.com/sprite/${id}.png`),
}))

describe('usePokemonByTypeGQL', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading state', () => {
    it('should return isLoading true initially', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.isLoading).toBe(true)
    })

    it('should return isFetching true when fetching more', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.isFetching).toBe(true)
    })
  })

  describe('Success state', () => {
    it('should transform GQL response to PokemonDisplayDataArray', () => {
      const mockResponse = {
        pokemon_v2_pokemon: [
          { id: 1, name: 'bulbasaur', pokemon_v2_pokemontypes: [{ slot: 1, pokemon_v2_type: { name: 'grass' } }] },
          { id: 2, name: 'ivysaur', pokemon_v2_pokemontypes: [{ slot: 1, pokemon_v2_type: { name: 'grass' } }] },
        ],
        pokemon_v2_pokemon_aggregate: { aggregate: { count: 2 } },
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.data).toHaveLength(2)
      expect(result.current.data[0].id).toBe(1)
      expect(result.current.data[0].name).toBe('bulbasaur')
      expect(result.current.data[0].primaryType).toBe('grass')
      expect(result.current.data[0].sprite).toContain('sprite/1.png')
    })

    it('should calculate total count correctly', () => {
      const mockResponse = {
        pokemon_v2_pokemon: [
          { id: 1, name: 'bulbasaur', pokemon_v2_pokemontypes: [] },
        ],
        pokemon_v2_pokemon_aggregate: { aggregate: { count: 100 } },
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.totalCount).toBe(100)
    })

    it('should determine hasMore correctly', () => {
      const mockResponse = {
        pokemon_v2_pokemon: [
          { id: 1, name: 'bulbasaur', pokemon_v2_pokemontypes: [] },
        ],
        pokemon_v2_pokemon_aggregate: { aggregate: { count: 20 } },
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.hasMore).toBe(true)
    })

    it('should return hasMore false when all loaded', () => {
      const mockResponse = {
        pokemon_v2_pokemon: [
          { id: 1, name: 'bulbasaur', pokemon_v2_pokemontypes: [] },
        ],
        pokemon_v2_pokemon_aggregate: { aggregate: { count: 1 } },
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.hasMore).toBe(false)
    })
  })

  describe('Error state', () => {
    it('should return isError true when query fails', () => {
      const mockError = new Error('Network error')

      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: true,
        error: mockError,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBe(mockError)
    })

    it('should return empty array when data is undefined', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.data).toEqual([])
    })

    it('should return empty array when pokemon_v2_pokemon is missing', () => {
      mockUseQuery.mockReturnValue({
        data: { pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } } } as never,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.data).toEqual([])
    })
  })

  describe('Pagination', () => {
    it('should have loadMore function', () => {
      mockUseQuery.mockReturnValue({
        data: { pokemon_v2_pokemon: [], pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } } },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.loadMore).toBeDefined()
      expect(typeof result.current.loadMore).toBe('function')
    })

    it('should have refetch function', () => {
      const mockRefetch = jest.fn()

      mockUseQuery.mockReturnValue({
        data: { pokemon_v2_pokemon: [], pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } } },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      result.current.refetch()
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle disabled query', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: '', enabled: false }))

      expect(result.current.data).toEqual([])
    })

    it('should use primary type from slot 1', () => {
      const mockResponse = {
        pokemon_v2_pokemon: [
          { id: 1, name: 'bulbasaur', pokemon_v2_pokemontypes: [
            { slot: 2, pokemon_v2_type: { name: 'poison' } },
            { slot: 1, pokemon_v2_type: { name: 'grass' } },
          ] },
        ],
        pokemon_v2_pokemon_aggregate: { aggregate: { count: 1 } },
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonByTypeGQL({ typeName: 'fire' }))

      expect(result.current.data[0].primaryType).toBe('grass')
    })
  })
})
