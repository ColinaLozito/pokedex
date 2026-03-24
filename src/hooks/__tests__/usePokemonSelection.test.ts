import { renderHook, act } from '@testing-library/react-native'
import { usePokemonSelection } from '../usePokemonSelection'

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@tamagui/toast', () => ({
  useToastController: () => ({
    show: jest.fn(),
  }),
}))

jest.mock('src/utils/ui/toast', () => ({
  setToastController: jest.fn(),
}))

jest.mock('@/modals/constants', () => ({
  NAVIGATION_DELAY: 0,
}))

describe('usePokemonSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const defaultProps = {
    pokemonList: [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
    ],
    addRecentSelection: jest.fn(),
    fetchPokemonDetail: jest.fn().mockResolvedValue({ id: 1, name: 'bulbasaur' }),
    getPokemonDetail: jest.fn(),
  }

  it('should return initial state with isLoading false', () => {
    const { result } = renderHook(() => usePokemonSelection(defaultProps))

    expect(result.current.isLoading).toBe(false)
  })

  it('should return pokemonListDataSet from props', () => {
    const propsWithDataSet = {
      ...defaultProps,
      pokemonListDataSet: [{ id: '1', title: 'bulbasaur' }],
    }

    const { result } = renderHook(() => usePokemonSelection(propsWithDataSet))

    expect(result.current.pokemonListDataSet).toEqual([{ id: '1', title: 'bulbasaur' }])
  })

  it('should have handleSelect function', () => {
    const { result } = renderHook(() => usePokemonSelection(defaultProps))

    expect(typeof result.current.handleSelect).toBe('function')
  })
})
