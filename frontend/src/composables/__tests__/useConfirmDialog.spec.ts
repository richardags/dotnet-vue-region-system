import { describe, it, expect } from 'vitest'
import { useConfirmDialog } from '../useConfirmDialog'

describe('useConfirmDialog', () => {
  it('initializes with default values', () => {
    const { isOpen, options } = useConfirmDialog()
    
    expect(isOpen.value).toBe(false)
    expect(options.value).toEqual({
      title: '',
      message: '',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      type: 'info'
    })
  })

  it('opens dialog with custom options', () => {
    const { isOpen, options, open } = useConfirmDialog()
    
    const dialogOptions = {
      title: 'Test Title',
      message: 'Test Message',
      confirmLabel: 'Yes',
      cancelLabel: 'No',
      type: 'danger' as const
    }
    
    open(dialogOptions)
    
    expect(isOpen.value).toBe(true)
    expect(options.value).toEqual(dialogOptions)
  })

  it('resolves promise with true when confirmed', async () => {
    const { open, confirm } = useConfirmDialog()
    
    const promise = open({
      title: 'Test',
      message: 'Test message'
    })
    
    confirm()
    
    const result = await promise
    expect(result).toBe(true)
  })

  it('resolves promise with false when cancelled', async () => {
    const { open, cancel } = useConfirmDialog()
    
    const promise = open({
      title: 'Test',
      message: 'Test message'
    })
    
    cancel()
    
    const result = await promise
    expect(result).toBe(false)
  })

  it('closes dialog after confirmation', () => {
    const { isOpen, open, confirm } = useConfirmDialog()
    
    open({
      title: 'Test',
      message: 'Test message'
    })
    
    expect(isOpen.value).toBe(true)
    
    confirm()
    
    expect(isOpen.value).toBe(false)
  })

  it('closes dialog after cancellation', () => {
    const { isOpen, open, cancel } = useConfirmDialog()
    
    open({
      title: 'Test',
      message: 'Test message'
    })
    
    expect(isOpen.value).toBe(true)
    
    cancel()
    
    expect(isOpen.value).toBe(false)
  })
})