import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type Mock } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import RegionsView from '../RegionsView.vue'
import { useRegionStore } from '@/stores/RegionStore'
import type { Region } from '@/types/Region'
import { nextTick } from 'vue'

// Test data
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

// Module level variables
let wrapper: VueWrapper
let store: ReturnType<typeof useRegionStore>
let fetchRegionsSpy: Mock

describe('RegionsView', () => {
    /**
     * Helper function to mount component with specific state and options
     */
    async function mountComponent(options: {
        regions?: Region[]
        loading?: boolean
        error?: string | null
        actions?: {
            fetchRegions?: boolean
            toggleRegionActive?: boolean
            deleteRegion?: boolean
            createRegion?: boolean
            updateRegion?: boolean
        }
        global?: {
            plugins?: unknown[]
            stubs?: Record<string, boolean>
        }
    } = {}) {
        // Reset all mocks
        vi.clearAllMocks()
        
        // Create testing pinia with initial state
        const testingPinia = createTestingPinia({
            createSpy: vi.fn,
            initialState: {
                region: {
                    regions: options.regions ?? [],
                    loading: options.loading ?? false,
                    error: options.error ?? null
                }
            },
            stubActions: true
        })

        // Merge global options with any provided options
        const defaultStubs = {
            RegionList: false, // Don't stub RegionList by default
            RegionForm: true,
            ConfirmDialog: false, // Keep ConfirmDialog for testing dialogs
            LoadingSpinner: false,
            ErrorMessage: false
        }

        wrapper = mount(RegionsView, {
            global: {
                plugins: [testingPinia],
                stubs: {
                    ...defaultStubs,
                    ...options.global?.stubs
                }
            }
        })

        // Get store instance
        store = useRegionStore()
        fetchRegionsSpy = store.fetchRegions as Mock
        
        // Configure specific action implementations if requested
        if (options.actions?.fetchRegions) {
            fetchRegionsSpy.mockImplementation(async () => {
                if (store.loading || store.error || store.regions.length > 0) {
                    return
                }
                store.loading = true
                store.error = null
                try {
                    await new Promise(resolve => setTimeout(resolve, 0))
                    store.loading = false
                } catch (err) {
                    store.error = err instanceof Error ? err.message : 'Unknown error'
                    store.loading = false
                }
            })
        }

        // Wait for component to stabilize
        await nextTick()
        
        return {
            wrapper,
            store
        }
    }

    describe('Component Rendering', () => {
        it('renders the component with correct title', async () => {
            await mountComponent()
            expect(wrapper.find('.section-title').text()).toBe('Regions List')
        })

        it('renders region list when data is loaded', async () => {
            await mountComponent({
                regions: mockRegions,
                loading: false,
                error: null
            })

            expect(wrapper.findComponent({ name: 'RegionList' }).exists()).toBe(true)
        })

        it('shows empty state when no regions', async () => {
            await mountComponent({
                regions: []
            })
            
            expect(wrapper.text()).toContain('No regions found')
            expect(wrapper.text()).toContain('Add your first region to get started')
        })

        it('shows loading indicator when loading', async () => {
            await mountComponent({
                loading: true,
                regions: []
            })

            expect(wrapper.find('.loading-card').exists()).toBe(true)
            expect(wrapper.text()).toContain('Loading regions')
            expect(wrapper.findComponent({ name: 'RegionList' }).exists()).toBe(false)
        })

        it('displays error message when fetch fails', async () => {
            const errorMessage = 'Failed to fetch regions'
            await mountComponent({
                error: errorMessage,
                loading: false,
                regions: []
            })

            expect(wrapper.find('.error-card').exists()).toBe(true)
            expect(wrapper.text()).toContain(errorMessage)
            expect(wrapper.findComponent({ name: 'RegionList' }).exists()).toBe(false)
        })
    })

    describe('Data Loading', () => {
        beforeEach(() => {
            vi.clearAllMocks()
        })

        it('should fetch regions once when mounted with empty state', async () => {
            await mountComponent({
                actions: { fetchRegions: true },
                regions: [],
                loading: false,
                error: null
            })
            expect(store.fetchRegions).toHaveBeenCalledOnce()
        })

        it('should not fetch regions when regions already exist', async () => {
            // First mount without actions to avoid any initial fetching
            await mountComponent({
                regions: mockRegions,
                loading: false,
                error: null
            })
            
            // Clear any previous calls and add the spy
            vi.clearAllMocks()
            store.fetchRegions = vi.fn()
            
            // Trigger component update
            await wrapper.vm.$nextTick()
            
            expect(store.fetchRegions).not.toHaveBeenCalled()
        })

        it('should not fetch regions when already loading', async () => {
            await mountComponent({
                loading: true,
                error: null,
                regions: [],
                actions: { fetchRegions: true }
            })
            expect(store.fetchRegions).not.toHaveBeenCalled()
        })

        it('should not fetch regions when there is an error', async () => {
            await mountComponent({
                error: 'Previous error',
                loading: false,
                regions: [],
                actions: { fetchRegions: true }
            })
            expect(store.fetchRegions).not.toHaveBeenCalled()
        })
    })

    describe('Region Actions', () => {
        beforeEach(async () => {
            await mountComponent({
                regions: mockRegions,
                loading: false,
                error: null,
                actions: {
                    fetchRegions: true,
                    toggleRegionActive: true,
                    deleteRegion: true,
                    createRegion: true,
                    updateRegion: true
                }
            })
        })

        describe('Form Actions', () => {
            it('opens create form', async () => {
                const listComponent = wrapper.findComponent({ name: 'RegionList' })
                expect(listComponent.exists()).toBe(true)
                await listComponent.vm.$emit('add')
                await nextTick()

                expect(wrapper.find('.modal-overlay').exists()).toBe(true)
                expect(wrapper.findComponent({ name: 'RegionForm' }).exists()).toBe(true)
            })

            it('opens edit form', async () => {
                const listComponent = wrapper.findComponent({ name: 'RegionList' })
                expect(listComponent.exists()).toBe(true)
                await listComponent.vm.$emit('edit', mockRegions[0])
                await nextTick()

                expect(wrapper.find('.modal-overlay').exists()).toBe(true)
                expect(wrapper.findComponent({ name: 'RegionForm' }).exists()).toBe(true)
            })
        })

        describe('Dialog Actions', () => {
            it('shows toggle confirmation dialog', async () => {
                const listComponent = wrapper.findComponent({ name: 'RegionList' })
                expect(listComponent.exists()).toBe(true)
                await listComponent.vm.$emit('toggle', mockRegions[0])
                await nextTick()

                const dialog = wrapper.findComponent({ name: 'ConfirmDialog' })
                expect(dialog.exists()).toBe(true)
                expect(dialog.props('isOpen')).toBe(true)
                expect(dialog.props('options').title).toBe('Confirm Action')
            })

            it('shows delete confirmation dialog', async () => {
                const listComponent = wrapper.findComponent({ name: 'RegionList' })
                expect(listComponent.exists()).toBe(true)
                await listComponent.vm.$emit('delete', mockRegions[0])
                await nextTick()

                const dialog = wrapper.findComponent({ name: 'ConfirmDialog' })
                expect(dialog.exists()).toBe(true)
                expect(dialog.props('isOpen')).toBe(true)
                expect(dialog.props('options').title).toBe('Delete Region')
                expect(dialog.props('options').message).toContain('This action cannot be undone')
            })

            it('cancels deletion', async () => {
                const listComponent = wrapper.findComponent({ name: 'RegionList' })
                expect(listComponent.exists()).toBe(true)
                await listComponent.vm.$emit('delete', mockRegions[0])
                await nextTick()

                const dialog = wrapper.findComponent({ name: 'ConfirmDialog' })
                expect(dialog.exists()).toBe(true)
                await dialog.vm.$emit('cancel')
                await nextTick()

                expect(store.deleteRegion).not.toHaveBeenCalled()
                expect(dialog.props('isOpen')).toBe(false)
            })

            it('handles dialog confirmation', async () => {
                const listComponent = wrapper.findComponent({ name: 'RegionList' })
                expect(listComponent.exists()).toBe(true)
                await listComponent.vm.$emit('delete', mockRegions[0])
                await nextTick()

                const dialog = wrapper.findComponent({ name: 'ConfirmDialog' })
                expect(dialog.exists()).toBe(true)
                await dialog.vm.$emit('confirm')
                await nextTick()

                expect(store.deleteRegion).toHaveBeenCalledWith(1)
                expect(dialog.props('isOpen')).toBe(false)
            })
        })
    })
})