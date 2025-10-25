import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import RegionList from '../RegionList.vue'
import { useRegionStore } from '@/stores/RegionStore'
import type { Region } from '@/types/Region'

const pinia = createPinia()

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

    beforeEach(async () => {
        const pinia = createPinia()
        setActivePinia(pinia)
        const store = useRegionStore()
        store.loading = false
        store.error = null
        store.regions = []
        // Mock store methods
        store.fetchRegions = vi.fn().mockResolvedValue(undefined)
        store.toggleRegionActive = vi.fn().mockResolvedValue(undefined)
        store.createRegion = vi.fn().mockResolvedValue(undefined)
        store.updateRegion = vi.fn().mockResolvedValue(undefined)
        store.deleteRegion = vi.fn().mockResolvedValue(undefined)
        vi.clearAllMocks()

        // Mount component with Pinia
        wrapper = mount(RegionList, {
            global: {
                plugins: [pinia]
            }
        })
        await nextTick()
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
            const store = useRegionStore()
            store.regions = []
            wrapper = mount(RegionList)
            await nextTick()
            
            expect(wrapper.find('tbody').text()).toContain('No regions found')
        })
    })

    describe('Loading State', () => {
        it('shows loading indicator when fetching regions', async () => {
            const pinia = createPinia()
            setActivePinia(pinia)
            const store = useRegionStore()
            store.loading = true

            wrapper = mount(RegionList, {
                global: {
                    plugins: [pinia]
                }
            })
            await nextTick()

            const loadingIndicator = wrapper.find('[data-test-id="loading-indicator"]')
            expect(loadingIndicator.exists()).toBe(true)
            expect(loadingIndicator.text()).toBe('Loading regions')
        })
    })

    describe('Error Handling', () => {
        it('displays error message when fetch fails', async () => {
            const pinia = createPinia()
            setActivePinia(pinia)
            const store = useRegionStore()
            
            // Mount first, then set state
            wrapper = mount(RegionList, {
                global: {
                    plugins: [pinia]
                }
            })
            await nextTick()

            // Update store state
            store.error = 'Failed to fetch regions'
            store.loading = false
            await nextTick()

            const errorMessage = wrapper.find('[data-test-id="error-message"]')
            expect(errorMessage.exists()).toBe(true)
            expect(errorMessage.text()).toBe(store.error)
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
            wrapper = mount(RegionList)
            const store = useRegionStore()
            store.regions = [...mockRegions]
            await nextTick()
            await nextTick()

            const editButton = wrapper.find('[data-test-id="edit-region-1"]')
            expect(editButton.exists()).toBe(true)
            await editButton.trigger('click')
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

    describe('Delete Region', () => {
        beforeEach(async () => {
            const store = useRegionStore()
            store.regions = [...mockRegions]
            store.error = null
            store.loading = false
            wrapper = mount(RegionList)
            await nextTick()
        })

        it('shows delete confirmation dialog when clicking delete button', async () => {
            const deleteButton = wrapper.find('[data-test-id="delete-region-1"]')
            expect(deleteButton.exists()).toBe(true)
            await deleteButton.trigger('click')
            await nextTick()

            const confirmDialog = wrapper.find('[data-test-id="delete-confirm-dialog"]')
            expect(confirmDialog.exists()).toBe(true)
            expect(confirmDialog.text()).toContain('Test Region 1')
        })

        it('cancels deletion when clicking cancel button', async () => {
            const store = useRegionStore()
            const deleteButton = wrapper.find('[data-test-id="delete-region-1"]')
            await deleteButton.trigger('click')
            await nextTick()

            const cancelButton = wrapper.find('[data-test-id="delete-cancel"]')
            expect(cancelButton.exists()).toBe(true)
            await cancelButton.trigger('click')
            await nextTick()

            const confirmDialog = wrapper.find('[data-test-id="delete-confirm-dialog"]')
            expect(confirmDialog.exists()).toBe(false)
            expect(store.deleteRegion).not.toHaveBeenCalled()
        })

        it('deletes region when confirming deletion', async () => {
            const store = useRegionStore()
            const deleteButton = wrapper.find('[data-test-id="delete-region-1"]')
            await deleteButton.trigger('click')
            await nextTick()

            const confirmButton = wrapper.find('[data-test-id="delete-confirm"]')
            expect(confirmButton.exists()).toBe(true)
            await confirmButton.trigger('click')
            await nextTick()

            expect(store.deleteRegion).toHaveBeenCalledWith(1)
            expect(store.fetchRegions).toHaveBeenCalled()
            
            const confirmDialog = wrapper.find('[data-test-id="delete-confirm-dialog"]')
            expect(confirmDialog.exists()).toBe(false)
        })
    })

    describe('Data Loading', () => {
        it('fetches regions on mount', async () => {
            const store = useRegionStore()
            store.fetchRegions = vi.fn().mockResolvedValue(undefined)
            
            wrapper = mount(RegionList)
            await nextTick()

            expect(store.fetchRegions).toHaveBeenCalled()
            expect(store.fetchRegions).toHaveBeenCalledTimes(1)
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