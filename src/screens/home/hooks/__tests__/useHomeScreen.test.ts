import { renderHook } from '@testing-library/react-native'
import { useHomeScreen } from '../useHomeScreen'

const mockUseHomeData = jest.fn()
const mockUseRouter = jest.fn()

jest.mock('../useHomeData', () => ({
  useHomeData: (...args: unknown[]) => mockUseHomeData(...args),
}))

jest.mock('expo-router', () => ({
  useRouter: (...args: unknown[]) => mockUseRouter(...args),
}))

describe('useHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return data and actions from useHomeData', () => {
    const mockData = {
      pokemonListDataSet: [],
      bookmarkedPokemonIds: [],
      recentSelections: [],
      typeList: [],
    }
    const mockActions = {
      getPokemonDetail: jest.fn(),
      toggleBookmark: jest.fn(),
      removeRecentSelection: jest.fn(),
      handleSelect: jest.fn(),
    }

    mockUseHomeData.mockReturnValue({ data: mockData, actions: mockActions })
    mockUseRouter.mockReturnValue({ push: jest.fn() })

    const { result } = renderHook(() => useHomeScreen())

    expect(result.current.data).toEqual(mockData)
    expect(result.current.actions.getPokemonDetail).toBe(mockActions.getPokemonDetail)
    expect(result.current.actions.toggleBookmark).toBe(mockActions.toggleBookmark)
  })

  it('should include handleTypeSelect action that navigates to typeFilter', () => {
    const mockRouterPush = jest.fn()
    mockUseHomeData.mockReturnValue({
      data: { pokemonListDataSet: [], bookmarkedPokemonIds: [], recentSelections: [], typeList: [] },
      actions: { getPokemonDetail: jest.fn(), toggleBookmark: jest.fn(), removeRecentSelection: jest.fn(), handleSelect: jest.fn() },
    })
    mockUseRouter.mockReturnValue({ push: mockRouterPush })

    const { result } = renderHook(() => useHomeScreen())

    result.current.actions.handleTypeSelect(1, 'fire')

    expect(mockRouterPush).toHaveBeenCalledWith({
      pathname: '/typeFilter',
      params: { typeId: '1', typeName: 'fire' },
    })
  })
})
