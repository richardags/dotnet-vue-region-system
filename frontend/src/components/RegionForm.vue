<script setup>
import { ref, watch } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'

const props = defineProps({
  region: {
    type: Object,
    default: null
  },
  onClose: {
    type: Function,
    required: true
  }
})

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
    error.value = e.message || 'Failed to save region.'
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
  <div class="region-form card">
    <div class="form-header">
      <h3>{{ region ? 'Edit Region' : 'Add New Region' }}</h3>
      <button class="btn btn-secondary" @click="onClose">×</button>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label" for="name">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="form-input"
          placeholder="Enter region name"
          :disabled="loading"
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
          @input="state = $event.target.value.toUpperCase()"
        >
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="onClose"
          :disabled="loading"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="loading"
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