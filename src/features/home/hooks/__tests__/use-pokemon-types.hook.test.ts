import { renderHook, act } from '@testing-library/react-native'
import { usePokemonTypesGQL } from '../use-pokemon-types.hook'
import { useQuery } from '@tanstack/react-query'

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>

describe('usePokemonTypesGQL', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading state', () => {
    it('should return isLoading true initially', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonTypesGQL())

      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('Success state', () => {
    it('should return transformed type list on success', () => {
      const mockResponse = {
        pokemon_v2_type: [
          { id: 1, name: 'fire' },
          { id: 2, name: 'water' },
          { id: 3, name: 'grass' },
          { id: 1000, name: 'unknown' },
          { id: 1001, name: 'shadow' },
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonTypesGQL())

      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toHaveLength(3)
      expect(result.current.data).toContainEqual({ id: 1, name: 'fire' })
      expect(result.current.data).toContainEqual({ id: 2, name: 'water' })
      expect(result.current.data).toContainEqual({ id: 3, name: 'grass' })
    })

    it('should exclude unknown, shadow, and stellar types', () => {
      const mockResponse = {
        pokemon_v2_type: [
          { id: 1, name: 'fire' },
          { id: 1000, name: 'unknown' },
          { id: 1001, name: 'shadow' },
          { id: 1002, name: 'stellar' },
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonTypesGQL())

      expect(result.current.data).toHaveLength(1)
      expect(result.current.data![0].name).toBe('fire')
    })

    it('should sort types alphabetically', () => {
      const mockResponse = {
        pokemon_v2_type: [
          { id: 3, name: 'grass' },
          { id: 1, name: 'fire' },
          { id: 2, name: 'water' },
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockResponse as never,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonTypesGQL())

      expect(result.current.data![0].name).toBe('fire')
      expect(result.current.data![1].name).toBe('grass')
      expect(result.current.data![2].name).toBe('water')
    })
  })

  describe('Error state', () => {
    it('should return isError true when query fails', () => {
      const mockError = new Error('Network error')

      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: mockError,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonTypesGQL())

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBe(mockError)
    })

    it('should return empty array when data is undefined', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as never)

      const { result } = renderHook(() => usePokemonTypesGQL())

      expect(result.current.data).toEqual([])
    })
  })

  describe('refetch', () => {
    it('should expose refetch function', () => {
      const mockRefetch = jest.fn()

      mockUseQuery.mockReturnValue({
        data: { pokemon_v2_type: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      } as never)

      const { result } = renderHook(() => usePokemonTypesGQL())

      result.current.refetch()
      expect(mockRefetch).toHaveBeenCalled()
    })
  })
})
