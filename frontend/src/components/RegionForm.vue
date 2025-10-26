<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'

import type { Region } from '@/types/Region'

const props = defineProps<{
  region: Region | null
  onClose: () => void
}>()

const emit = defineEmits(['close'])

const regionStore = useRegionStore()
const name = ref('')
const state = ref('')
const error = ref('')
const loading = ref(false)

// Initialize form if editing
watch(() => props.region, (newRegion) => {
  if (newRegion) {
    name.value = newRegion.name
    state.value = newRegion.state
  }
}, { immediate: true })

async function handleSubmit() {
  error.value = ''
  
  // Validate required fields
  if (!name.value.trim() || !state.value.trim()) {
    error.value = 'Name and State are required.'
    return
  }

  loading.value = true
  try {
    if (props.region) {
      // Update existing region
      await regionStore.updateRegion(props.region.id, {
        name: name.value.trim(),
        state: state.value.trim(),
        isActive: props.region.isActive
      })
    } else {
      // Create new region
      await regionStore.createRegion({
        name: name.value.trim(),
        state: state.value.trim()
      })
    }
    resetForm()
    emit('close')
  } catch (e) {
    error.value = (e instanceof Error ? e.message : 'Failed to save region.')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  name.value = ''
  state.value = ''
  error.value = ''
}
</script>

<template>
  <div class="region-form card" data-test-id="region-form">
    <div class="form-header">
      <h3>{{ region ? 'Edit Region' : 'Add New Region' }}</h3>
      <button class="btn btn-secondary" @click="onClose" data-test-id="close-form">×</button>
    </div>

    <form @submit.prevent="handleSubmit" data-test-id="region-form-fields">
      <div class="form-group">
        <label class="form-label" for="name">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="form-input"
          placeholder="Enter region name"
          :disabled="loading"
          data-test-id="region-name-input"
        >
      </div>

      <div class="form-group">
        <label class="form-label" for="state">State</label>
        <input
          id="state"
          v-model="state"
          type="text"
          class="form-input"
          placeholder="Enter state code"
          maxlength="2"
          style="text-transform: uppercase;"
          :disabled="loading"
          data-test-id="region-state-input"
          @input="state = ($event.target as HTMLInputElement).value.toUpperCase()"
        >
      </div>

      <div v-if="error" class="error-message" data-test-id="form-error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="onClose"
          :disabled="loading"
          data-test-id="cancel-form"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="loading"
          data-test-id="submit-form"
        >
          {{ loading ? 'Saving...' : (region ? 'Update' : 'Create') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.region-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h3 {
  margin: 0;
  color: var(--color-heading);
}

.error-message {
  color: var(--color-danger);
  margin: 1rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: var(--color-danger-bg);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

input[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>