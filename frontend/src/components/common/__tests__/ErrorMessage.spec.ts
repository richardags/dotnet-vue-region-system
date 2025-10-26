import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ErrorMessage from '../ErrorMessage.vue'

describe('ErrorMessage', () => {
  it('renders error message with default type', () => {
    const message = 'Test error message'
    const wrapper = mount(ErrorMessage, {
      props: {
        message
      }
    })
    
    const messageEl = wrapper.find('[data-test-id="error-message"]')
    expect(messageEl.exists()).toBe(true)
    expect(messageEl.text()).toContain(message)
    expect(messageEl.classes()).toContain('message-error')
  })

  it('renders warning message', () => {
    const wrapper = mount(ErrorMessage, {
      props: {
        message: 'Warning message',
        type: 'warning'
      }
    })
    
    expect(wrapper.find('.message-warning').exists()).toBe(true)
  })

  it('renders info message', () => {
    const wrapper = mount(ErrorMessage, {
      props: {
        message: 'Info message',
        type: 'info'
      }
    })
    
    expect(wrapper.find('.message-info').exists()).toBe(true)
  })

  it('shows appropriate icon based on type', async () => {
    const wrapper = mount(ErrorMessage, {
      props: {
        message: 'Test message',
        type: 'info'
      }
    })

    expect(wrapper.find('.icon').text()).toBe('ℹ️')

    await wrapper.setProps({ type: 'error' })
    await nextTick()
    expect(wrapper.find('.icon').text()).toBe('⚠️')

    await wrapper.setProps({ type: 'warning' })
    await nextTick()
    expect(wrapper.find('.icon').text()).toBe('⚠️')
  })
})