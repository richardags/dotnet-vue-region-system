import { ref, computed } from 'vue'

export interface SortOptions<T> {
  field: T
  direction: 'asc' | 'desc'
}

export function useSortable<T>(
  items: T[] | (() => T[]),
  defaultSort: SortOptions<keyof T>
) {
  const sortOptions = ref<SortOptions<keyof T>>(defaultSort)

  const sortedItems = computed(() => {
    const currentItems = typeof items === 'function' ? items() : items || []
    return [...currentItems].sort((a, b) => {
      const field = sortOptions.value.field
      const aVal = a[field as keyof T]
      const bVal = b[field as keyof T]
      
      const direction = sortOptions.value.direction === 'asc' ? 1 : -1
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction * aVal.localeCompare(bVal)
      }
      
      if (aVal instanceof Date && bVal instanceof Date) {
        return direction * (aVal.getTime() - bVal.getTime())
      }
      
      return direction * (Number(aVal ?? 0) - Number(bVal ?? 0))
    })
  })

  const toggleSort = (field: keyof T) => {
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