import { ref, computed } from 'vue'

export interface SortOptions<T extends string> {
  field: T
  direction: 'asc' | 'desc'
}

export function useSortable<T extends Record<string, any>, K extends keyof T>(
  items: T[] | (() => T[]),
  defaultSort: SortOptions<K & string>
) {
  const sortOptions = ref<SortOptions<K & string>>(defaultSort)

  const sortedItems = computed(() => {
    const currentItems = typeof items === 'function' ? items() : items || []
    return [...currentItems].sort((a, b) => {
      const aVal = a[sortOptions.value.field]
      const bVal = b[sortOptions.value.field]
      
      const direction = sortOptions.value.direction === 'asc' ? 1 : -1
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction * aVal.localeCompare(bVal)
      }
      
      return direction * (Number(aVal) - Number(bVal))
    })
  })

  const toggleSort = (field: K & string) => {
    if (sortOptions.value.field === field) {
      sortOptions.value.direction = sortOptions.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
      sortOptions.value = {
        field,
        direction: 'asc'
      }
    }
  }

  return {
    sortOptions,
    sortedItems,
    toggleSort
  }
}