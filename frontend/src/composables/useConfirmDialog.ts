import { ref } from 'vue'

export interface ConfirmDialogOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  type?: 'danger' | 'warning' | 'info'
}

export function useConfirmDialog() {
  const isOpen = ref(false)
  const options = ref<ConfirmDialogOptions>({
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    type: 'info'
  })
  let resolvePromise: ((value: boolean) => void) | null = null

  const open = (dialogOptions: ConfirmDialogOptions) => {
    options.value = {
      ...options.value,
      ...dialogOptions
    }
    isOpen.value = true
    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
  }

  const confirm = () => {
    resolvePromise?.(true)
    isOpen.value = false
  }

  const cancel = () => {
    resolvePromise?.(false)
    isOpen.value = false
  }

  return {
    isOpen,
    options,
    open,
    confirm,
    cancel
  }
}