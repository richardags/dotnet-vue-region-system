<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'
import RegionForm from '@/components/RegionForm.vue'
import RegionList from '@/components/regions/RegionList.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import type { Region } from '@/types/Region'

const regionStore = useRegionStore()
const showForm = ref(false)
const selectedRegion = ref<Region | null>(null)
const { isOpen: showConfirmDialog, options: confirmOptions, open: openConfirm, confirm, cancel } = useConfirmDialog()

onMounted(async () => {
  // Only fetch if we meet all conditions (no regions, not loading, no error)
  if (!regionStore.regions.length && !regionStore.loading && !regionStore.error) {
    await regionStore.fetchRegions()
  }
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

async function handleToggleRegion(region: Region) {
  const confirmed = await openConfirm({
    title: 'Confirm Action',
    message: `Are you sure you want to ${region.isActive ? 'inactivate' : 'activate'} this region?`,
    confirmLabel: 'Confirm',
    type: region.isActive ? 'warning' : 'info'
  })

  if (confirmed) {
    try {
      await regionStore.toggleRegionActive(region.id)
    } catch (error) {
      console.error('Failed to toggle region:', error)
    }
  }
}

async function handleDeleteRegion(region: Region) {
  const confirmed = await openConfirm({
    title: 'Delete Region',
    message: `Are you sure you want to delete the region "${region.name}"? This action cannot be undone.`,
    confirmLabel: 'Delete',
    type: 'danger'
  })

  if (confirmed) {
    try {
      await regionStore.deleteRegion(region.id)
    } catch (error) {
      console.error('Failed to delete region:', error)
    }
  }
}
</script>

<template>
  <div class="regions">
    <div class="regions-header">
      <h2 class="section-title">Regions List</h2>
    </div>

    <template v-if="regionStore.loading">
      <div class="loading-card" data-test-id="loading-indicator">
        <div class="loading-spinner"></div>
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
      <template v-if="regionStore.regions.length === 0">
        <div class="empty-state">
          <h3>No regions found</h3>
          <p>Add your first region to get started</p>
          <button class="btn btn-primary" @click="openCreateForm">Add Region</button>
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
    </template>

    <!-- Region Form Modal -->
    <div v-if="showForm" class="modal-overlay">
      <RegionForm
        :region="selectedRegion"
        :onClose="closeForm"
      />
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      :is-open="showConfirmDialog"
      :options="confirmOptions"
      @confirm="confirm"
      @cancel="cancel"
    />
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