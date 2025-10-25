<script setup lang="ts">
import { onMounted } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'
import type { Region } from '@/types/Region'

const regionStore = useRegionStore()

onMounted(async () => {
  if (!regionStore.regions.length && !regionStore.loading) {
    await regionStore.fetchRegions()
  }
})

const emit = defineEmits<{
  (e: 'edit', region: Region): void
  (e: 'toggle', region: Region): void
  (e: 'delete', region: Region): void
  (e: 'add'): void
}>()

function handleSort(field: 'name' | 'state' | 'isActive') {
  if (regionStore.sortField === field) {
    regionStore.sortDirection = regionStore.sortDirection === 'asc' ? 'desc' : 'asc'
  } else {
    regionStore.sortField = field
    regionStore.sortDirection = 'asc'
  }
}
</script>

<template>
  <div class="region-list">
    <div class="list-header">
      <h2>Regions</h2>
      <div class="list-controls">
        <div class="search-filter-group">
          <div class="search-box">
            <input
              type="text"
              placeholder="Search by name or state..."
              v-model="regionStore.searchQuery"
              class="form-input"
              data-test-id="search-input"
            >
          </div>
          <div class="status-filter">
            <select 
              v-model="regionStore.filterActive"
              class="form-input"
              data-test-id="status-filter"
            >
              <option :value="null">All Status</option>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>
        <button 
          class="btn btn-primary" 
          @click="emit('add')"
          data-test-id="add-region"
        >
          Add Region
        </button>
      </div>
    </div>

    <div v-if="regionStore.loading" class="loading-indicator" data-test-id="loading-indicator">
      Loading regions...
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="regionStore.error" class="error-message" data-test-id="error-message">
      <span class="icon">⚠️</span>
      {{ regionStore.error }}
    </div>

    <table v-else class="region-table" data-test-id="regions-table">
      <thead>
        <tr>
          <th 
            class="sortable"
            :class="{ sorted: regionStore.sortField === 'name' }"
            @click="handleSort('name')"
          >
            Name
            <span class="sort-icon">
              {{ regionStore.sortField === 'name' ? (regionStore.sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
            </span>
          </th>
          <th 
            class="sortable"
            :class="{ sorted: regionStore.sortField === 'state' }"
            @click="handleSort('state')"
          >
            State
            <span class="sort-icon">
              {{ regionStore.sortField === 'state' ? (regionStore.sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
            </span>
          </th>
          <th 
            class="sortable"
            :class="{ sorted: regionStore.sortField === 'isActive' }"
            @click="handleSort('isActive')"
          >
            Status
            <span class="sort-icon">
              {{ regionStore.sortField === 'isActive' ? (regionStore.sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
            </span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="regionStore.sortedRegions.length === 0">
          <td colspan="4" class="text-center">No regions found</td>
        </tr>
        <tr v-for="region in regionStore.sortedRegions" :key="region.id" :data-test-id="'region-row-' + region.id">
          <td>{{ region.name }}</td>
          <td>{{ region.state }}</td>
          <td>
            <span :class="['badge', region.isActive ? 'badge-success' : 'badge-danger']">
              {{ region.isActive ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button 
                class="btn btn-sm btn-secondary"
                @click="emit('edit', region)"
                :data-test-id="'edit-region-' + region.id"
              >
                Edit
              </button>
              <button 
                class="btn btn-sm"
                :class="region.isActive ? 'btn-danger' : 'btn-success'"
                @click="emit('toggle', region)"
                :data-test-id="'toggle-region-' + region.id"
              >
                {{ region.isActive ? 'Inactivate' : 'Activate' }}
              </button>
              <button 
                class="btn btn-sm btn-outline-danger"
                @click="emit('delete', region)"
                :data-test-id="'delete-region-' + region.id"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.region-list {
  padding: 1rem;
}

.list-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.list-header h2 {
  margin: 0;
  color: var(--color-heading);
}

.list-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.search-filter-group {
  display: flex;
  gap: 1rem;
  flex-grow: 1;
}

.search-box {
  flex-grow: 1;
}

.status-filter {
  width: 150px;
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
  padding: 0.75rem;
  transition: background-color 0.2s ease;
}

.region-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: 2rem !important;
}

.region-table th.sortable:hover {
  background-color: var(--color-background-mute);
}

.region-table th.sorted {
  background-color: var(--color-background-mute);
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
  padding-right: 1.5rem;
  position: relative;
}

.sort-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.5;
  color: var(--color-text);
  margin-left: 0.5rem;
}

th.sorted .sort-icon {
  opacity: 1;
  color: var(--color-primary);
}

.region-table th.sortable:hover .sort-icon {
  opacity: 1;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-background);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  width: 400px;
}

.modal-content h3 {
  margin-top: 0;
  color: var(--color-heading);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>