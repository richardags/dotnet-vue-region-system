import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import RegionsView from '../RegionsView.vue'
import { useRegionStore } from '@/stores/RegionStore'
import type { Region } from '@/types/Region'

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

// Import Pinia and remove global store mock

describe('RegionsView', () => {
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

    beforeEach(async () => {
        const pinia = createPinia()
        setActivePinia(pinia)
        const store = useRegionStore()

        // Setup store mocks
        store.fetchRegions = vi.fn().mockResolvedValue(undefined)
        store.toggleRegionActive = vi.fn().mockResolvedValue(undefined)
        store.createRegion = vi.fn().mockResolvedValue(undefined)
        store.updateRegion = vi.fn().mockResolvedValue(undefined)
        store.deleteRegion = vi.fn().mockResolvedValue(undefined)

        // Initial state
        store.loading = false
        store.error = null
        store.regions = []

        // Mount component with Pinia
        wrapper = mount(RegionsView, {
            global: {
                plugins: [pinia]
            }
        })

        await nextTick()
    })

    describe('Component Rendering', () => {
        it('renders the component with correct title', async () => {
            wrapper = mount(RegionsView)
            await nextTick()
            expect(wrapper.find('.section-title').text()).toBe('Regions List')
        })

        it('displays regions in a table format', async () => {
            const store = useRegionStore()
            
            // Set regions and wait for update
            store.regions = [...mockRegions]
            await nextTick()

            expect(wrapper.find('[data-test-id="regions-table"]').exists()).toBe(true)
            const rows = wrapper.findAll('tbody tr')
            expect(rows).toHaveLength(2)

            const firstRow = rows[0]
            expect(firstRow?.find('td:nth-child(1)')?.text()).toBe('Test Region 1')
            expect(firstRow?.find('td:nth-child(2)')?.text()).toBe('TR')
            expect(firstRow?.find('td:nth-child(3) .badge')?.text()).toBe('Active')
        })

        it('shows empty state when no regions', async () => {
            const store = useRegionStore()
            store.regions = []
            wrapper = mount(RegionsView)
            await nextTick()
            
            expect(wrapper.text()).toContain('No regions found')
            expect(wrapper.text()).toContain('Add your first region to get started')
        })
    })

    describe('Loading State', () => {
        it('shows loading indicator', async () => {
            const store = useRegionStore()
            store.loading = true
            store.regions = []
            store.error = null
            await nextTick()

            const loadingIndicator = wrapper.find('[data-test-id="loading-indicator"]')
            expect(loadingIndicator.exists()).toBe(true)
            expect(wrapper.text()).toContain('Loading regions')
        })
    })

    describe('Error Handling', () => {
        it('displays error message when fetch fails', async () => {
            const store = useRegionStore()
            store.error = 'Failed to fetch regions'
            store.loading = false
            await nextTick()

            const errorMessage = wrapper.find('[data-test-id="error-message"]')
            expect(errorMessage.exists()).toBe(true)
            expect(errorMessage.text()).toContain(store.error)
        })
    })

    describe('Region Actions', () => {
        beforeEach(async () => {
            const store = useRegionStore()
            store.regions = [...mockRegions]
            store.error = null
            store.loading = false
            wrapper = mount(RegionsView)
            await nextTick()
        })

        it('opens create form', async () => {
            await wrapper.find('.btn-primary').trigger('click')
            await nextTick()

            expect(wrapper.find('.modal-overlay').exists()).toBe(true)
            expect(wrapper.findComponent({ name: 'RegionForm' }).exists()).toBe(true)
        })

        it('opens edit form', async () => {
            const store = useRegionStore()
            store.regions = [...mockRegions]
            wrapper = mount(RegionsView)
            await nextTick()

            const editButton = wrapper.find('[data-test-id="edit-region-1"]')
            expect(editButton.exists()).toBe(true)
            await editButton.trigger('click')
            await nextTick()

            expect(wrapper.find('.modal-overlay').exists()).toBe(true)
            expect(wrapper.findComponent({ name: 'RegionForm' }).exists()).toBe(true)
        })

        it('shows toggle confirmation dialog', async () => {
            const store = useRegionStore()
            store.regions = [...mockRegions]
            wrapper = mount(RegionsView)
            await nextTick()

            const toggleButton = wrapper.find('[data-test-id="toggle-region-1"]')
            expect(toggleButton.exists()).toBe(true)
            await toggleButton.trigger('click')
            await nextTick()

            expect(wrapper.find('.confirmation-dialog').exists()).toBe(true)
            expect(wrapper.text()).toContain('Confirm Action')
        })

        it('shows delete confirmation dialog', async () => {
            const store = useRegionStore()
            store.regions = [...mockRegions]
            wrapper = mount(RegionsView)
            await nextTick()

            const deleteButton = wrapper.find('[data-test-id="delete-region-1"]')
            expect(deleteButton.exists()).toBe(true)
            await deleteButton.trigger('click')
            await nextTick()

            const dialog = wrapper.find('[data-test-id="confirmation-dialog"]')
            expect(dialog.exists()).toBe(true)
            expect(dialog.text()).toContain('Delete Region')
            expect(dialog.text()).toContain('This action cannot be undone')
        })

        it('cancels deletion', async () => {
            const store = useRegionStore()
            store.regions = [...mockRegions]
            wrapper = mount(RegionsView)
            await nextTick()

            // Open delete dialog
            await wrapper.find('[data-test-id="delete-region-1"]').trigger('click')
            await nextTick()

            // Click cancel
            const cancelButton = wrapper.find('[data-test-id="cancel-action"]')
            expect(cancelButton.exists()).toBe(true)
            await cancelButton.trigger('click')
            await nextTick()

            expect(wrapper.find('[data-test-id="confirmation-dialog"]').exists()).toBe(false)
            expect(store.deleteRegion).not.toHaveBeenCalled()
        })

        it('confirms deletion', async () => {
            const store = useRegionStore()
            store.regions = [...mockRegions]
            wrapper = mount(RegionsView)
            await nextTick()

            // Open delete dialog
            await wrapper.find('[data-test-id="delete-region-1"]').trigger('click')
            await nextTick()

            // Click confirm
            const confirmButton = wrapper.find('[data-test-id="confirm-action"]')
            expect(confirmButton.exists()).toBe(true)
            await confirmButton.trigger('click')
            await nextTick()

            expect(store.deleteRegion).toHaveBeenCalledWith(1)
            expect(wrapper.find('[data-test-id="confirmation-dialog"]').exists()).toBe(false)
        })
    })

    describe('Data Loading', () => {
        it('fetches regions on mount', async () => {
            const store = useRegionStore()
            store.fetchRegions = vi.fn()
            
            wrapper = mount(RegionsView)
            await nextTick()
            await nextTick()

            expect(store.fetchRegions).toHaveBeenCalled()
            expect(store.fetchRegions).toHaveBeenCalledTimes(1)
        })
    })
})