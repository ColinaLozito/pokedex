import { renderHook, act, waitFor } from '@testing-library/react-native'
import { usePokemonSearchGQL } from '../use-pokemon-search.hook'
import { useQuery } from '@tanstack/react-query'

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>

describe('usePokemonSearchGQL', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Initial state', () => {
    it('should return empty suggestions when searchTerm is empty', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isFetching: false,
        isError: false,
      } as never)

      const { result } = renderHook(() => 
        usePokemonSearchGQL({ searchTerm: '' })
      )

      expect(result.current.suggestions).toEqual([])
      expect(result.current.isLoading).toBe(false)
    })

    it('should return empty suggestions when searchTerm is short', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isFetching: false,
        isError: false,
      } as never)

      const { result } = renderHook(() => 
        usePokemonSearchGQL({ searchTerm: 'ab' })
      )

      expect(result.current.suggestions).toEqual([])
    })
  })

  describe('Search logic', () => {
    it('should debounce search term', async () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isFetching: false,
        isError: false,
      } as never)

      const { result, rerender } = renderHook(
        ({ searchTerm }) => usePokemonSearchGQL({ searchTerm }),
        { initialProps: { searchTerm: '' } }
      )

      rerender({ searchTerm: 'bulba' })

      expect(result.current.suggestions).toEqual([])
    })

    it('should trigger search after debounce delay', async () => {
      const mockResponse = {
        pokemon_v2_pokemon: [
          { id: 1, name: 'bulbasaur' },
          { id: 2, name: 'bulbasaurus' },
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isFetching: false,
        isError: false,
      } as never)

      const { result, rerender } = renderHook(
        ({ searchTerm }) => usePokemonSearchGQL({ searchTerm }),
        { initialProps: { searchTerm: '' } }
      )

      rerender({ searchTerm: 'bulba' })

      act(() => {
        jest.advanceTimersByTime(301)
      })

      await waitFor(() => {
        expect(result.current.suggestions).toHaveLength(2)
      })

      expect(result.current.suggestions[0]).toEqual({ id: '1', title: 'bulbasaur' })
    })
  })

  describe('Success state', () => {
    it('should transform GQL response to suggestions', () => {
      const mockResponse = {
        pokemon_v2_pokemon: [
          { id: 1, name: 'pikachu' },
          { id: 25, name: 'pikachu' },
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isFetching: false,
        isError: false,
      } as never)

      const { result } = renderHook(() => 
        usePokemonSearchGQL({ searchTerm: 'pikachu' })
      )

      act(() => {
        jest.advanceTimersByTime(301)
      })

      expect(result.current.suggestions).toHaveLength(2)
      expect(result.current.suggestions[0]).toEqual({ id: '1', title: 'pikachu' })
    })

    it('should set hasResults true when results exist', () => {
      const mockResponse = {
        pokemon_v2_pokemon: [
          { id: 1, name: 'bulbasaur' },
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isFetching: false,
        isError: false,
      } as never)

      const { result } = renderHook(() => 
        usePokemonSearchGQL({ searchTerm: 'bulba' })
      )

      act(() => {
        jest.advanceTimersByTime(301)
      })

      expect(result.current.hasResults).toBe(true)
    })

    it('should set hasResults false when no results', () => {
      const mockResponse = {
        pokemon_v2_pokemon: [],
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isFetching: false,
        isError: false,
      } as never)

      const { result } = renderHook(() => 
        usePokemonSearchGQL({ searchTerm: 'xyz123' })
      )

      act(() => {
        jest.advanceTimersByTime(301)
      })

      expect(result.current.hasResults).toBe(false)
    })
  })

  describe('Loading state', () => {
    it('should return isLoading true when fetching', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isFetching: true,
        isError: false,
      } as never)

      const { result } = renderHook(() => 
        usePokemonSearchGQL({ searchTerm: 'pikachu' })
      )

      act(() => {
        jest.advanceTimersByTime(301)
      })

      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('Error state', () => {
    it('should return isError true when query fails', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isFetching: false,
        isError: true,
      } as never)

      const { result } = renderHook(() => 
        usePokemonSearchGQL({ searchTerm: 'pikachu' })
      )

      act(() => {
        jest.advanceTimersByTime(301)
      })

      expect(result.current.isError).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should return empty array when data is undefined', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isFetching: false,
        isError: false,
      } as never)

      const { result } = renderHook(() => 
        usePokemonSearchGQL({ searchTerm: 'pika' })
      )

      act(() => {
        jest.advanceTimersByTime(301)
      })

      expect(result.current.suggestions).toEqual([])
    })

    it('should return empty array when pokemon_v2_pokemon is undefined', () => {
      mockUseQuery.mockReturnValue({
        data: {} as never,
        isFetching: false,
        isError: false,
      } as never)

      const { result } = renderHook(() => 
        usePokemonSearchGQL({ searchTerm: 'pika' })
      )

      act(() => {
        jest.advanceTimersByTime(301)
      })

      expect(result.current.suggestions).toEqual([])
    })
  })
})
