import { useUserStore } from '@/store/userStore'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

describe('userStore', () => {
  beforeEach(() => {
    useUserStore.getState().$reset()
  })

  describe('Initial State', () => {
    it('should have empty bookmarks', () => {
      const state = useUserStore.getState()
      expect(state.bookmarkedPokemonIds).toEqual([])
    })

    it('should have empty recent selections', () => {
      const state = useUserStore.getState()
      expect(state.recentSelections).toEqual([])
    })
  })

  describe('toggleBookmark', () => {
    it('should add bookmark when not bookmarked', () => {
      useUserStore.getState().toggleBookmark(1)

      const state = useUserStore.getState()
      expect(state.bookmarkedPokemonIds).toContain(1)
    })

    it('should remove bookmark when already bookmarked', () => {
      useUserStore.getState().toggleBookmark(1)
      useUserStore.getState().toggleBookmark(1)

      const state = useUserStore.getState()
      expect(state.bookmarkedPokemonIds).not.toContain(1)
    })

    it('should handle multiple bookmarks', () => {
      useUserStore.getState().toggleBookmark(1)
      useUserStore.getState().toggleBookmark(2)
      useUserStore.getState().toggleBookmark(3)

      const state = useUserStore.getState()
      expect(state.bookmarkedPokemonIds).toEqual([1, 2, 3])
    })
  })

  describe('addRecentSelection', () => {
    it('should add recent selection', () => {
      useUserStore.getState().addRecentSelection({ id: 1, name: 'bulbasaur' })

      const state = useUserStore.getState()
      expect(state.recentSelections).toHaveLength(1)
      expect(state.recentSelections[0].id).toBe(1)
      expect(state.recentSelections[0].name).toBe('bulbasaur')
    })

    it('should move existing selection to top', () => {
      useUserStore.getState().addRecentSelection({ id: 1, name: 'bulbasaur' })
      useUserStore.getState().addRecentSelection({ id: 2, name: 'ivysaur' })
      useUserStore.getState().addRecentSelection({ id: 1, name: 'bulbasaur' })

      const state = useUserStore.getState()
      expect(state.recentSelections[0].id).toBe(1)
    })

    it('should limit to 5 recent selections', () => {
      for (let i = 1; i <= 6; i++) {
        useUserStore.getState().addRecentSelection({ id: i, name: `pokemon${i}` })
      }

      const state = useUserStore.getState()
      expect(state.recentSelections).toHaveLength(5)
      expect(state.recentSelections[0].id).toBe(6)
    })
  })

  describe('removeRecentSelection', () => {
    it('should remove recent selection by id', () => {
      useUserStore.getState().addRecentSelection({ id: 1, name: 'bulbasaur' })
      useUserStore.getState().addRecentSelection({ id: 2, name: 'ivysaur' })
      useUserStore.getState().removeRecentSelection(1)

      const state = useUserStore.getState()
      expect(state.recentSelections).toHaveLength(1)
      expect(state.recentSelections[0].id).toBe(2)
    })
  })

  describe('$reset', () => {
    it('should reset all state', () => {
      useUserStore.getState().toggleBookmark(1)
      useUserStore.getState().addRecentSelection({ id: 1, name: 'bulbasaur' })
      useUserStore.getState().$reset()

      const state = useUserStore.getState()
      expect(state.bookmarkedPokemonIds).toEqual([])
      expect(state.recentSelections).toEqual([])
    })
  })
})
