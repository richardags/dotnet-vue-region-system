import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders without message', () => {
    const wrapper = mount(LoadingSpinner)
    
    expect(wrapper.find('[data-test-id="loading-spinner"]').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders with message', () => {
    const message = 'Loading data...'
    const wrapper = mount(LoadingSpinner, {
      props: {
        message
      }
    })
    
    expect(wrapper.find('[data-test-id="loading-spinner"]').exists()).toBe(true)
    expect(wrapper.find('p').text()).toBe(message)
  })
})