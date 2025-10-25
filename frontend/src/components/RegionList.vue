<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'
import RegionForm from './RegionForm.vue'
import type { Region } from '@/types/Region'

const regionStore = useRegionStore()
const selectedRegion = ref<Region | null>(null)
const showForm = ref(false)

onMounted(() => {
  regionStore.fetchRegions()
})

function handleEditRegion(region: Region) {
  selectedRegion.value = region
  showForm.value = true
}

function handleAddRegion() {
  selectedRegion.value = null
  showForm.value = true
}

function handleCloseForm() {
  showForm.value = false
  selectedRegion.value = null
}

async function handleToggleActive(region: Region) {
  await regionStore.toggleRegionActive(region.id)
  await regionStore.fetchRegions()
}
</script>

<template>
  <div class="region-list">
    <div class="list-header">
      <h2>Regions</h2>
      <button 
        class="btn btn-primary" 
        @click="handleAddRegion"
        data-test-id="add-region"
      >
        Add Region
      </button>
    </div>

    <div v-if="regionStore.loading" class="loading-indicator" data-test-id="loading-indicator">
      Loading...
    </div>

    <div v-else-if="regionStore.error" class="error-message" data-test-id="error-message">
      {{ regionStore.error }}
    </div>

    <table v-else class="region-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>State</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="regionStore.sortedRegions.length === 0">
          <td colspan="4" class="text-center">No regions found</td>
        </tr>
        <tr v-for="region in regionStore.sortedRegions" :key="region.id">
          <td>{{ region.name }}</td>
          <td>{{ region.state }}</td>
          <td>{{ region.isActive ? 'Active' : 'Inactive' }}</td>
          <td>
            <div class="action-buttons">
              <button 
                class="btn btn-sm btn-secondary"
                @click="handleEditRegion(region)"
                :data-test-id="'edit-region-' + region.id"
              >
                Edit
              </button>
              <button 
                class="btn btn-sm"
                :class="region.isActive ? 'btn-danger' : 'btn-success'"
                @click="handleToggleActive(region)"
                :data-test-id="'toggle-region-' + region.id"
              >
                {{ region.isActive ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <RegionForm
      v-if="showForm"
      :region="selectedRegion"
      :onClose="handleCloseForm"
    />
  </div>
</template>

<style scoped>
.region-list {
  padding: 1rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.list-header h2 {
  margin: 0;
  color: var(--color-heading);
}

.region-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.region-table th,
.region-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.region-table th {
  font-weight: 600;
  background-color: var(--color-background-soft);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}

.error-message {
  color: var(--color-danger);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  background-color: var(--color-danger-bg);
}

.text-center {
  text-align: center;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>