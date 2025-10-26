import { describe, it, expect } from 'vitest'
import { useSortable } from '../useSortable'

interface TestItem {
  id: number
  name: string
  value: number
}

describe('useSortable', () => {
  const testItems: TestItem[] = [
    { id: 1, name: 'B Item', value: 2 },
    { id: 2, name: 'A Item', value: 3 },
    { id: 3, name: 'C Item', value: 1 }
  ]

  it('initializes with default sort options', () => {
    const defaultSort = { field: 'name' as const, direction: 'asc' as const }
    const { sortOptions } = useSortable(testItems, defaultSort)
    
    expect(sortOptions.value).toEqual(defaultSort)
  })

  it('sorts string values in ascending order', () => {
    const { sortedItems } = useSortable(testItems, {
      field: 'name',
      direction: 'asc'
    })
    
    expect(sortedItems.value.map(item => item.name)).toEqual([
      'A Item',
      'B Item',
      'C Item'
    ])
  })

  it('sorts string values in descending order', () => {
    const { sortedItems } = useSortable(testItems, {
      field: 'name',
      direction: 'desc'
    })
    
    expect(sortedItems.value.map(item => item.name)).toEqual([
      'C Item',
      'B Item',
      'A Item'
    ])
  })

  it('sorts number values in ascending order', () => {
    const { sortedItems } = useSortable(testItems, {
      field: 'value',
      direction: 'asc'
    })
    
    expect(sortedItems.value.map(item => item.value)).toEqual([1, 2, 3])
  })

  it('sorts number values in descending order', () => {
    const { sortedItems } = useSortable(testItems, {
      field: 'value',
      direction: 'desc'
    })
    
    expect(sortedItems.value.map(item => item.value)).toEqual([3, 2, 1])
  })

  it('toggles sort direction when clicking same field', () => {
    const { sortOptions, toggleSort } = useSortable(testItems, {
      field: 'name',
      direction: 'asc'
    })
    
    toggleSort('name')
    expect(sortOptions.value.direction).toBe('desc')
    
    toggleSort('name')
    expect(sortOptions.value.direction).toBe('asc')
  })

  it('resets direction to asc when changing sort field', () => {
    const { sortOptions, toggleSort } = useSortable(testItems, {
      field: 'name',
      direction: 'desc'
    })
    
    toggleSort('value')
    
    expect(sortOptions.value).toEqual({
      field: 'value',
      direction: 'asc'
    })
  })
})