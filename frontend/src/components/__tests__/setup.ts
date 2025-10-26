import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useRegionStore } from '@/stores/RegionStore'
import type { Region } from '@/types/Region'
import RegionList from '../regions/RegionList.vue'
import { vi } from 'vitest'

export const mockRegions: Region[] = [
    {
        id: 1,
        name: 'Test Region 1',
        state: 'TR',
        isActive: true,
        createdAt: '2025-10-25T00:00:00Z',
        updatedAt: null
    },
    {
        id: 2,
        name: 'Test Region 2',
        state: 'TS',
        isActive: false,
        createdAt: '2025-10-25T00:00:00Z',
        updatedAt: null
    }
]

export function createWrapper(
    options: {
        loading?: boolean
        error?: string | null
        regions?: Region[]
        searchQuery?: string
        filterActive?: string
        fetchRegions?: () => Promise<void>
        toggleRegionActive?: (id: number) => Promise<void>
        createRegion?: (region: Region) => Promise<void>
        updateRegion?: (id: number, region: Partial<Region>) => Promise<void>
        deleteRegion?: (id: number) => Promise<void>
    } = {}
) {
    const pinia = createPinia()
    setActivePinia(pinia)
    
    const store = useRegionStore()
    
    // Mock store methods with provided functions or defaults
    store.fetchRegions = options.fetchRegions ?? vi.fn().mockResolvedValue(undefined)
    store.toggleRegionActive = options.toggleRegionActive ?? vi.fn().mockResolvedValue(undefined)
    store.createRegion = options.createRegion ?? vi.fn().mockResolvedValue(undefined)
    store.updateRegion = options.updateRegion ?? vi.fn().mockResolvedValue(undefined)
    store.deleteRegion = options.deleteRegion ?? vi.fn().mockResolvedValue(undefined)

    // Initialize the store state with defaults or provided values
    store.loading = options.loading ?? false
    store.error = options.error ?? null
    store.regions = options.regions ? [...options.regions] : [...mockRegions]
    store.searchQuery = options.searchQuery ?? ''
    store.filterActive = options.filterActive ?? ''

    // Create wrapper with global plugins
    return mount(RegionList, {
        global: {
            plugins: [pinia]
        }
    })
}