import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '../ConfirmDialog.vue'
import type { ConfirmDialogOptions } from '@/composables/useConfirmDialog'

describe('ConfirmDialog', () => {
  const defaultOptions: ConfirmDialogOptions = {
    title: 'Confirm Action',
    message: 'Are you sure?',
    confirmLabel: 'Yes',
    cancelLabel: 'No',
    type: 'info'
  }

  it('renders when open', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        isOpen: true,
        options: defaultOptions
      }
    })
    
    expect(wrapper.find('[data-test-id="confirmation-dialog"]').exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe(defaultOptions.title)
    expect(wrapper.find('p').text()).toBe(defaultOptions.message)
  })

  it('does not render when closed', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        isOpen: false,
        options: defaultOptions
      }
    })
    
    expect(wrapper.find('[data-test-id="confirmation-dialog"]').exists()).toBe(false)
  })

  it('emits confirm event', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        isOpen: true,
        options: defaultOptions
      }
    })
    
    await wrapper.find('[data-test-id="confirm-action"]').trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel event', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        isOpen: true,
        options: defaultOptions
      }
    })
    
    await wrapper.find('[data-test-id="cancel-action"]').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('applies correct button styles based on type', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        isOpen: true,
        options: {
          ...defaultOptions,
          type: 'danger'
        }
      }
    })
    
    const confirmButton = wrapper.find('[data-test-id="confirm-action"]')
    expect(confirmButton.classes()).toContain('btn-danger')
  })

  it('uses default labels when not provided', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        isOpen: true,
        options: {
          title: 'Test',
          message: 'Test message'
        }
      }
    })
    
    expect(wrapper.find('[data-test-id="confirm-action"]').text()).toBe('Confirm')
    expect(wrapper.find('[data-test-id="cancel-action"]').text()).toBe('Cancel')
  })
})