<script setup lang="ts">
import { onMounted } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'
import type { Region } from '@/types/Region'
import { useSortable } from '@/composables/useSortable'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { formatDate } from '@/utils/regionHelpers'

const regionStore = useRegionStore()

// Initialize sorting
const { sortOptions, sortedItems, toggleSort } = useSortable(
  () => regionStore.filteredRegions,
  { field: 'name', direction: 'asc' }
)

const emit = defineEmits<{
  (e: 'edit', region: Region): void
  (e: 'toggle', region: Region): void
  (e: 'delete', region: Region): void
  (e: 'add'): void
}>()
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
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
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

    <LoadingSpinner 
      v-if="regionStore.loading"
      message="Loading regions..."
    />

    <ErrorMessage
      v-else-if="regionStore.error"
      :message="regionStore.error"
    />

    <table v-else class="region-table" data-test-id="regions-table">
      <thead>
        <tr>
          <th 
            v-for="(label, field) in {
              name: 'Name',
              state: 'State',
              isActive: 'Status',
              createdAt: 'Created At'
            }"
            :key="field"
            class="sortable"
            :class="{ sorted: sortOptions.field === field }"
            @click="toggleSort(field)"
          >
            {{ label }}
            <span class="sort-icon">
              {{ sortOptions.field === field 
                ? (sortOptions.direction === 'asc' ? '↑' : '↓') 
                : '↕' }}
            </span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="sortedItems.length === 0">
          <td colspan="5" class="text-center">
            No regions found
            <p>Add your first region to get started</p>
          </td>
        </tr>
        <tr v-for="region in sortedItems" :key="region.id" :data-test-id="'region-row-' + region.id">
          <td>{{ region.name }}</td>
          <td>{{ region.state }}</td>
          <td>
            <span :class="['badge', region.isActive ? 'badge-success' : 'badge-danger']">
              {{ region.isActive ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>{{ formatDate(region.createdAt) }}</td>
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

.sort-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

th.sorted .sort-icon {
  opacity: 1;
  color: var(--color-primary);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.text-center {
  text-align: center;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>