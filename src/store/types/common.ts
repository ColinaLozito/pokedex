// Generic store primitives for consistency across stores
export interface StoreSlice<T> {
  value: T
  loading: boolean
  error?: string | null
}
