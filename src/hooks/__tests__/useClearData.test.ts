import { renderHook } from '@testing-library/react-native'
import { useClearData } from '../useClearData'

jest.mock('@tamagui/toast', () => ({
  useToastController: () => ({
    show: jest.fn(),
  }),
}))

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}))

jest.mock('../../utils/storage/clearStorage', () => ({
  clearAllStoredData: jest.fn().mockResolvedValue(undefined),
}))

const mockUsePokemonDataStore = jest.fn()
const mockUsePokemonGeneralStore = jest.fn()

jest.mock('../../store/pokemonDataStore', () => ({
  usePokemonDataStore: (...args: unknown[]) => mockUsePokemonDataStore(...args),
}))

jest.mock('../../store/pokemonGeneralStore', () => ({
  usePokemonGeneralStore: (...args: unknown[]) => mockUsePokemonGeneralStore(...args),
}))

describe('useClearData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return hasStoredData true when pokemonDetails has data', () => {
    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({ pokemonDetails: { 1: { id: 1, name: 'bulbasaur' } } } as never)
      }
      return { pokemonDetails: { 1: { id: 1, name: 'bulbasaur' } } }
    })
    
    mockUsePokemonGeneralStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({ bookmarkedPokemonIds: [], recentSelections: [], pokemonByType: {} } as never)
      }
      return { bookmarkedPokemonIds: [], recentSelections: [], pokemonByType: {} }
    })

    const { result } = renderHook(() => useClearData())

    expect(result.current.hasStoredData).toBe(true)
  })

  it('should return hasStoredData true when bookmarkedPokemonIds has data', () => {
    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({ pokemonDetails: {} } as never)
      }
      return { pokemonDetails: {} }
    })
    
    mockUsePokemonGeneralStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({ bookmarkedPokemonIds: [1, 2], recentSelections: [], pokemonByType: {} } as never)
      }
      return { bookmarkedPokemonIds: [1, 2], recentSelections: [], pokemonByType: {} }
    })

    const { result } = renderHook(() => useClearData())

    expect(result.current.hasStoredData).toBe(true)
  })

  it('should return hasStoredData false when all stores are empty', () => {
    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({ pokemonDetails: {} } as never)
      }
      return { pokemonDetails: {} }
    })
    
    mockUsePokemonGeneralStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({ bookmarkedPokemonIds: [], recentSelections: [], pokemonByType: {} } as never)
      }
      return { bookmarkedPokemonIds: [], recentSelections: [], pokemonByType: {} }
    })

    const { result } = renderHook(() => useClearData())

    expect(result.current.hasStoredData).toBe(false)
  })

  it('should have handleClearData function', () => {
    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({ pokemonDetails: {} } as never)
      }
      return { pokemonDetails: {} }
    })
    
    mockUsePokemonGeneralStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({ bookmarkedPokemonIds: [], recentSelections: [], pokemonByType: {} } as never)
      }
      return { bookmarkedPokemonIds: [], recentSelections: [], pokemonByType: {} }
    })

    const { result } = renderHook(() => useClearData())

    expect(typeof result.current.handleClearData).toBe('function')
  })
})
