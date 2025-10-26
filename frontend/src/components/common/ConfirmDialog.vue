<script setup lang="ts">
import { computed } from 'vue'
import type { ConfirmDialogOptions } from '@/composables/useConfirmDialog'

interface Props {
  isOpen: boolean
  options: ConfirmDialogOptions
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const confirmButtonClass = computed(() => {
  return ['btn', props.options.type ? `btn-${props.options.type}` : 'btn-primary']
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" data-test-id="confirmation-dialog">
      <div class="card confirmation-dialog">
        <h3>{{ options.title }}</h3>
        <p>{{ options.message }}</p>
        <div class="dialog-actions">
          <button 
            class="btn btn-secondary" 
            @click="emit('cancel')"
            data-test-id="cancel-action"
          >
            {{ options.cancelLabel || 'Cancel' }}
          </button>
          <button 
            :class="confirmButtonClass"
            @click="emit('confirm')"
            data-test-id="confirm-action"
          >
            {{ options.confirmLabel || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirmation-dialog {
  max-width: 400px;
  width: 90%;
}

.confirmation-dialog h3 {
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>