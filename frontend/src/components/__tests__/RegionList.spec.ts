import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'
import { createWrapper, mockRegions } from './setup'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import ErrorMessage from '../common/ErrorMessage.vue'

describe('RegionList', () => {
    let wrapper: ReturnType<typeof createWrapper>

    beforeEach(async () => {
        vi.clearAllMocks()
        wrapper = createWrapper()
        await nextTick()
    })

    describe('Search and Filter', () => {
        beforeEach(async () => {
            wrapper = createWrapper({ regions: mockRegions })
            await nextTick()
        })

        it('allows searching regions', async () => {
            const searchInput = wrapper.find('[data-test-id="search-input"]')
            expect(searchInput.exists()).toBe(true)

            await searchInput.setValue('Test Region 1')
            const store = useRegionStore()
            expect(store.searchQuery).toBe('Test Region 1')
        })

        it('allows filtering by status', async () => {
            const statusFilter = wrapper.find('[data-test-id="status-filter"]')
            expect(statusFilter.exists()).toBe(true)

            await statusFilter.setValue('true')
            const store = useRegionStore()
            expect(store.filterActive).toBe('true')

            await statusFilter.setValue('false')
            expect(store.filterActive).toBe('false')

            await statusFilter.setValue('')
            expect(store.filterActive).toBe('')
        })
    })

    describe('Component Rendering', () => {
        it('renders the component with correct title', async () => {
            expect(wrapper.find('h2').text()).toBe('Regions')
        })

        it('displays regions in a table format', async () => {
            wrapper = createWrapper({ regions: mockRegions })
            await nextTick()

            expect(wrapper.find('[data-test-id="regions-table"]').exists()).toBe(true)
            const rows = wrapper.findAll('[data-test-id^="region-row-"]')
            expect(rows).toHaveLength(2)

            const firstRow = rows[0]
            expect(firstRow?.find('td:nth-child(1)')?.text()).toBe('Test Region 1')
            expect(firstRow?.find('td:nth-child(2)')?.text()).toBe('TR')
            expect(firstRow?.find('td:nth-child(3)')?.text()).toBe('Active')
        })

        it('shows "No regions found" when list is empty', async () => {
            wrapper = createWrapper({ regions: [] })
            await nextTick()
            
            expect(wrapper.find('tbody').text()).toContain('No regions found')
        })
    })

    describe('Loading State', () => {
        it('shows loading indicator when fetching regions', async () => {
            wrapper = createWrapper({ loading: true })
            await nextTick()

            const loadingIndicator = wrapper.findComponent(LoadingSpinner)
            expect(loadingIndicator.exists()).toBe(true)
            expect(loadingIndicator.props('message')).toBe('Loading regions...')
        })
    })

    describe('Error Handling', () => {
        it('displays error message when fetch fails', async () => {
            wrapper = createWrapper({ 
                error: 'Failed to fetch regions',
                loading: false 
            })
            await nextTick()

            const errorMessage = wrapper.findComponent(ErrorMessage)
            expect(errorMessage.exists()).toBe(true)
            expect(errorMessage.props('message')).toBe('Failed to fetch regions')
        })
    })

    describe('Interactions', () => {
        it('opens edit form when clicking edit button', async () => {
            await nextTick()

            const editButton = wrapper.find('[data-test-id="edit-region-1"]')
            expect(editButton.exists()).toBe(true)
            await editButton.trigger('click')
            await nextTick()

            expect(wrapper.emitted('edit')).toBeTruthy()
            const emitted = wrapper.emitted('edit')?.[0]?.[0] as { id: number }
            expect(emitted.id).toBe(1)
        })

        it('toggles region active state', async () => {
            const toggleButton = wrapper.find('[data-test-id="toggle-region-1"]')
            expect(toggleButton.exists()).toBe(true)
            await toggleButton.trigger('click')
            await nextTick()

            expect(wrapper.emitted('toggle')).toBeTruthy()
            const emitted = wrapper.emitted('toggle')?.[0]?.[0] as { id: number }
            expect(emitted.id).toBe(1)
        })

        it('emits add event when clicking add button', async () => {
            await wrapper.find('[data-test-id="add-region"]').trigger('click')
            await nextTick()

            expect(wrapper.emitted('add')).toBeTruthy()
        })
    })

    describe('Delete Region', () => {
        it('shows delete confirmation dialog when clicking delete button', async () => {
            const deleteButton = wrapper.find('[data-test-id="delete-region-1"]')
            expect(deleteButton.exists()).toBe(true)
            await deleteButton.trigger('click')
            await nextTick()

            expect(wrapper.emitted('delete')).toBeTruthy()
            const emitted = wrapper.emitted('delete')?.[0]?.[0] as { id: number }
            expect(emitted.id).toBe(1)
        })
    })

    describe('Data Loading', () => {
        it('emits toggle event when toggling active state', async () => {
            wrapper = createWrapper({ regions: mockRegions })
            await nextTick()

            const toggleButton = wrapper.find('[data-test-id="toggle-region-1"]')
            expect(toggleButton.exists()).toBe(true)
            await toggleButton.trigger('click')
            await nextTick()

            expect(wrapper.emitted('toggle')).toBeTruthy()
            const emitted = wrapper.emitted('toggle')?.[0]?.[0] as { id: number }
            expect(emitted.id).toBe(1)
        })
    })
})