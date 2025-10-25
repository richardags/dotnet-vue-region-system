import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import RegionList from '../RegionList.vue'
import { useRegionStore } from '@/stores/RegionStore'
import type { Region } from '@/types/Region'

// Mock the store actions
vi.mock('@/stores/RegionStore', () => {
    const mockStore = {
        regions: [] as Region[],
        loading: false,
        error: null as string | null,
        fetchRegions: vi.fn(),
        toggleRegionActive: vi.fn(),
        createRegion: vi.fn(),
        updateRegion: vi.fn(),
        get sortedRegions() {
            return [...this.regions].sort((a, b) => {
                // First sort by state
                const stateCompare = a.state.localeCompare(b.state)
                if (stateCompare !== 0) return stateCompare
                // Then by name
                return a.name.localeCompare(b.name)
            })
        }
    }

    return {
        useRegionStore: () => mockStore
    }
})

describe('RegionList', () => {
    let wrapper: ReturnType<typeof mount>

    const mockRegions: Region[] = [
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

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    describe('Component Rendering', () => {
        it('renders the component with correct title', async () => {
            wrapper = mount(RegionList)
            await nextTick()
            expect(wrapper.find('h2').text()).toBe('Regions')
        })

        it('displays regions in a table format', async () => {
            const store = useRegionStore()
            store.regions = [...mockRegions]
            wrapper = mount(RegionList)
            await nextTick()
            await nextTick() // Additional tick for store updates

            const rows = wrapper.findAll('tbody tr')
            expect(rows).toHaveLength(2)

            const firstRow = rows[0]
            // Adding null checks to handle potential undefined values
            expect(firstRow?.find('td:nth-child(1)')?.text()).toBe('Test Region 1')
            expect(firstRow?.find('td:nth-child(2)')?.text()).toBe('TR')
            expect(firstRow?.find('td:nth-child(3)')?.text()).toBe('Active')
        })

        it('shows "No regions found" when list is empty', async () => {
            const store = useRegionStore()
            store.regions = []
            wrapper = mount(RegionList)
            await nextTick()
            
            expect(wrapper.find('tbody').text()).toContain('No regions found')
        })
    })

    describe('Loading State', () => {
        it('shows loading indicator when fetching regions', async () => {
            const store = useRegionStore()
            store.loading = true
            store.regions = []
            store.error = null

            wrapper = mount(RegionList)
            await nextTick()

            const loadingIndicator = wrapper.find('[data-test-id="loading-indicator"]')
            expect(loadingIndicator.exists()).toBe(true)
            expect(loadingIndicator.text()).toBe('Loading...')
        })
    })

    describe('Error Handling', () => {
        it('displays error message when fetch fails', async () => {
            const store = useRegionStore()
            store.error = 'Failed to fetch regions'
            store.loading = false
            store.regions = []
            
            wrapper = mount(RegionList)
            await nextTick()

            const errorMessage = wrapper.find('[data-test-id="error-message"]')
            expect(errorMessage.exists()).toBe(true)
            expect(errorMessage.text()).toBe('Failed to fetch regions')
        })
    })

    describe('Interactions', () => {
        beforeEach(async () => {
            const store = useRegionStore()
            store.regions = [...mockRegions]
            store.error = null
            store.loading = false
            wrapper = mount(RegionList)
            await nextTick()
        })

        it('opens edit form when clicking edit button', async () => {
            const editButton = wrapper.find('[data-test-id="edit-region-1"]')
            expect(editButton.exists()).toBe(true)
            await editButton.trigger('click')
            await nextTick()
            await nextTick()
            expect(wrapper.findComponent({ name: 'RegionForm' }).exists()).toBe(true)
        })

        it('toggles region active state', async () => {
            const store = useRegionStore()
            const toggleButton = wrapper.find('[data-test-id="toggle-region-1"]')
            expect(toggleButton.exists()).toBe(true)
            await toggleButton.trigger('click')
            await nextTick()
            await nextTick()
            expect(store.toggleRegionActive).toHaveBeenCalledWith(1)
        })

        it('opens create form when clicking add button', async () => {
            await wrapper.find('[data-test-id="add-region"]').trigger('click')
            await nextTick()
            await nextTick()
            expect(wrapper.findComponent({ name: 'RegionForm' }).exists()).toBe(true)
        })

        it('closes form when clicking cancel', async () => {
            await wrapper.find('[data-test-id="add-region"]').trigger('click')
            await nextTick()
            await nextTick()
            expect(wrapper.findComponent({ name: 'RegionForm' }).exists()).toBe(true)

            const form = wrapper.findComponent({ name: 'RegionForm' })
            await form.vm.$emit('close')
            await nextTick()
            await nextTick()
            
            expect(wrapper.findComponent({ name: 'RegionForm' }).exists()).toBe(false)
        })
    })

    describe('Data Loading', () => {
        it('fetches regions on mount', async () => {
            const store = useRegionStore()
            vi.mocked(store.fetchRegions).mockClear() // Clear any previous calls
            
            wrapper = mount(RegionList)
            await nextTick() // Wait for onMounted hook

            expect(store.fetchRegions).toHaveBeenCalled()
        })

        it('refreshes regions after toggling active state', async () => {
            const store = useRegionStore()
            vi.mocked(store.fetchRegions).mockClear() // Clear any previous calls
            
            // Mount component and setup initial state
            wrapper = mount(RegionList)
            store.regions = [...mockRegions]
            store.error = null
            store.loading = false
            await nextTick()

            // Find and click toggle button
            const toggleButton = wrapper.find('[data-test-id="toggle-region-1"]')
            expect(toggleButton.exists()).toBe(true)
            await toggleButton.trigger('click')
            await nextTick()

            // Check that both actions were called
            expect(store.toggleRegionActive).toHaveBeenCalledWith(1)
            expect(store.fetchRegions).toHaveBeenCalledTimes(2) // Once on mount, once after toggle
        })
    })
})