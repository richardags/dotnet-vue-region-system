<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'
import RegionForm from '@/components/RegionForm.vue'
import RegionList from '@/components/RegionList.vue'
import type { Region } from '@/types/Region'

const regionStore = useRegionStore()
const showForm = ref(false)
const selectedRegion = ref<Region | null>(null)
const showConfirmDialog = ref(false)

const regionToToggle = ref<number | null>(null)
const regionToDelete = ref<Region | null>(null)
const confirmationType = ref<'toggle' | 'delete'>('toggle')

onMounted(() => {
  regionStore.fetchRegions()
})

function openCreateForm() {
  selectedRegion.value = null
  showForm.value = true
}

function openEditForm(region: Region) {
  selectedRegion.value = region
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  selectedRegion.value = null
}

async function handleConfirmAction() {
  try {
    if (confirmationType.value === 'toggle' && regionToToggle.value !== null) {
      await regionStore.toggleRegionActive(regionToToggle.value)
      await regionStore.fetchRegions() // Ensure data is refreshed
    } else if (confirmationType.value === 'delete' && regionToDelete.value !== null) {
      await regionStore.deleteRegion(regionToDelete.value.id)
      await regionStore.fetchRegions() // Ensure data is refreshed
    }
  } finally {
    showConfirmDialog.value = false
    regionToToggle.value = null
    regionToDelete.value = null
  }
}

async function handleToggleRegion(region: Region) {
  regionToToggle.value = region.id
  confirmationType.value = 'toggle'
  showConfirmDialog.value = true
}

async function handleDeleteRegion(region: Region) {
  regionToDelete.value = region
  confirmationType.value = 'delete'
  showConfirmDialog.value = true
}
</script>

<template>
  <div class="regions">
    <div class="regions-header">
      <h2 class="section-title">Regions List</h2>
    </div>

    <template v-if="regionStore.loading">
      <div class="loading-spinner" data-test-id="loading-indicator">
        <div class="spinner"></div>
        <p>Loading regions</p>
      </div>
    </template>
    
    <template v-else-if="regionStore.error">
      <div class="error-card" data-test-id="error-message">
        <span class="icon">⚠️</span>
        <p>{{ regionStore.error }}</p>
      </div>
    </template>
    
    <template v-else>
      <RegionList
        @edit="openEditForm"
        @toggle="handleToggleRegion"
        @delete="handleDeleteRegion"
        @add="openCreateForm"
      />
    </template>

    <!-- Region Form Modal -->
    <div v-if="showForm" class="modal-overlay">
      <RegionForm
        :region="selectedRegion"
        :onClose="closeForm"
      />
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="modal-overlay">
      <div class="card confirmation-dialog" data-test-id="confirmation-dialog">
        <h3>{{ confirmationType === 'delete' ? 'Delete Region' : 'Confirm Action' }}</h3>
        <p v-if="confirmationType === 'delete'">
          Are you sure you want to delete the region "{{ regionToDelete?.name }}"?<br>
          This action cannot be undone.
        </p>
        <p v-else>
          Are you sure you want to {{ regionStore.regions.find((r: Region) => r.id === regionToToggle)?.isActive ? 'inactivate' : 'activate' }} this region?
        </p>
        <div class="dialog-actions">
          <button 
            class="btn btn-secondary" 
            @click="showConfirmDialog = false"
            data-test-id="cancel-action"
          >
            Cancel
          </button>
          <button 
            :class="['btn', confirmationType === 'delete' ? 'btn-danger' : 'btn-primary']"
            @click="handleConfirmAction"
            data-test-id="confirm-action"
          >
            {{ confirmationType === 'delete' ? 'Delete' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.regions {
  width: 100%;
}

.regions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.loading-card,
.error-card,
.empty-state {
  text-align: center;
  padding: 3rem !important;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-card {
  color: var(--color-danger);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.actions-column {
  text-align: right;
  min-width: 200px;
}

.actions-column .btn {
  margin-left: 0.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

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
  text-align: center;
}

.confirmation-dialog h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>