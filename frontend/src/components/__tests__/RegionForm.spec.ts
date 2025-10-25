import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RegionForm from '../RegionForm.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useRegionStore } from '@/stores/RegionStore'
import type { Region } from '@/types/Region'

// Mock the store actions
vi.mock('@/stores/RegionStore', () => {
    const mockStore = {
        createRegion: vi.fn(),
        updateRegion: vi.fn(),
        error: null
    }
    return { useRegionStore: vi.fn(() => mockStore) }
})

describe('RegionForm', () => {
    let wrapper: ReturnType<typeof mount>
    const mockOnClose = vi.fn()

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    describe('Create Mode', () => {
        beforeEach(() => {
            wrapper = mount(RegionForm, {
                props: {
                    region: null,
                    onClose: mockOnClose
                }
            })
        })

        it('renders create form correctly', () => {
            expect(wrapper.find('h3').text()).toBe('Add New Region')
            expect(wrapper.find('button[type="submit"]').text()).toBe('Create')
        })

        it('validates required fields', async () => {
            await wrapper.find('form').trigger('submit')
            expect(wrapper.text()).toContain('Name and State are required')
        })

        it('handles successful region creation', async () => {
            const store = useRegionStore()
            
            await wrapper.find('#name').setValue('Test Region')
            await wrapper.find('#state').setValue('TS')
            await wrapper.find('form').trigger('submit')

            expect(store.createRegion).toHaveBeenCalledWith({
                name: 'Test Region',
                state: 'TS'
            })
            expect(mockOnClose).toHaveBeenCalled()
        })

        it('converts state code to uppercase', async () => {
            await wrapper.find('#state').setValue('ts')
            expect((wrapper.find('#state').element as HTMLInputElement).value).toBe('TS')
        })
    })

    describe('Edit Mode', () => {
        const mockRegion: Region = {
            id: 1,
            name: 'Existing Region',
            state: 'ER',
            isActive: true,
            createdAt: '2025-10-25T00:00:00Z',
            updatedAt: null
        }

        beforeEach(() => {
            wrapper = mount(RegionForm, {
                props: {
                    region: mockRegion,
                    onClose: mockOnClose
                }
            })
        })

        it('renders edit form correctly', () => {
            expect(wrapper.find('h3').text()).toBe('Edit Region')
            expect(wrapper.find('button[type="submit"]').text()).toBe('Update')
            expect((wrapper.find('#name').element as HTMLInputElement).value).toBe('Existing Region')
            expect((wrapper.find('#state').element as HTMLInputElement).value).toBe('ER')
        })

        it('handles successful region update', async () => {
            const store = useRegionStore()
            
            await wrapper.find('#name').setValue('Updated Region')
            await wrapper.find('#state').setValue('UR')
            await wrapper.find('form').trigger('submit')

            expect(store.updateRegion).toHaveBeenCalledWith(1, {
                name: 'Updated Region',
                state: 'UR',
                isActive: true
            })
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    describe('Error Handling', () => {
        beforeEach(() => {
            wrapper = mount(RegionForm, {
                props: {
                    region: null,
                    onClose: mockOnClose
                }
            })
        })

        it('displays error message when creation fails', async () => {
            const store = useRegionStore()
            vi.mocked(store.createRegion).mockRejectedValueOnce(new Error('Creation failed'))

            await wrapper.find('#name').setValue('Test Region')
            await wrapper.find('#state').setValue('TS')
            await wrapper.find('form').trigger('submit')
            await nextTick()
            await nextTick() // Wait for error to be displayed

            // Find the error message element
            const errorMessage = wrapper.find('.error-message')
            expect(errorMessage.exists()).toBe(true)
            expect(errorMessage.text()).toBe('Creation failed')
        })

        it('keeps form enabled during error state', async () => {
            const store = useRegionStore()
            vi.mocked(store.createRegion).mockRejectedValueOnce(new Error('Creation failed'))

            await wrapper.find('#name').setValue('Test Region')
            await wrapper.find('#state').setValue('TS')
            await wrapper.find('form').trigger('submit')

            expect(wrapper.find('#name').attributes('disabled')).toBeFalsy()
            expect(wrapper.find('#state').attributes('disabled')).toBeFalsy()
            expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeFalsy()
        })
    })

    describe('Form Controls', () => {
        let mountingPoint: HTMLElement

        beforeEach(() => {
            // Create a div to mount the component to
            mountingPoint = document.createElement('div')
            document.body.appendChild(mountingPoint)

            wrapper = mount(RegionForm, {
                props: {
                    region: null,
                    onClose: mockOnClose
                },
                attachTo: mountingPoint // Attach the component to the DOM
            })
        })

        afterEach(() => {
            // Clean up mounted element after each test
            mountingPoint.remove()
        })

        it('handles cancel button click', async () => {
            await wrapper.find('button.btn-secondary').trigger('click')
            expect(mockOnClose).toHaveBeenCalled()
        })

        it('disables form controls during submission', async () => {
            const store = useRegionStore()
            // Create a promise that won't resolve to keep the form in loading state
            const submissionPromise = new Promise<void>(() => {})
            vi.mocked(store.createRegion).mockReturnValueOnce(submissionPromise)

            // Fill out the form
            await wrapper.find('#name').setValue('Test Region')
            await wrapper.find('#state').setValue('TS')

            // Verify initial state - no elements should have disabled attribute
            expect(wrapper.find('#name[disabled]').exists()).toBe(false)
            expect(wrapper.find('#state[disabled]').exists()).toBe(false)
            expect(wrapper.find('button[type="submit"][disabled]').exists()).toBe(false)
            expect(wrapper.find('button.btn-secondary[disabled]').exists()).toBe(false)

            // Trigger form submission which should disable controls
            await wrapper.find('form').trigger('submit')
            await nextTick()

            // First verify the loading state was set in the component
            const vm = wrapper.vm as unknown as { loading: boolean }
            expect(vm.loading).toBe(true)
            expect(wrapper.find('button[type="submit"]').text()).toBe('Saving...')

            // Then verify all controls have the disabled attribute
            expect(wrapper.find('#name[disabled]').exists()).toBe(true)
            expect(wrapper.find('#state[disabled]').exists()).toBe(true)
            expect(wrapper.find('button[type="submit"][disabled]').exists()).toBe(true)
            expect(wrapper.find('button.btn-secondary[disabled]').exists()).toBe(true)
        })

        it('limits state code to 2 characters', async () => {
            const stateInput = wrapper.find('#state')
            expect(stateInput.attributes('maxlength')).toBe('2')
        })
    })
})