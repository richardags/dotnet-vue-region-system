<script setup lang="ts">
import { onMounted } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'

const regionStore = useRegionStore()

onMounted(async () => {
  await regionStore.fetchRegions()
})
</script>

<template>
  <div class="regions">
    <div class="regions-header">
      <h2 class="section-title">Regions List</h2>
      <button class="btn btn-primary">
        <span class="icon">+</span> Add Region
      </button>
    </div>

    <div v-if="regionStore.loading" class="card loading-card">
      <div class="loading-spinner"></div>
      <p>Loading regions...</p>
    </div>
    
    <div v-else-if="regionStore.error" class="card error-card">
      <span class="icon">⚠️</span>
      <p>{{ regionStore.error }}</p>
    </div>
    
    <div v-else class="regions-content">
      <div class="card" v-if="regionStore.sortedRegions.length">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>State</th>
              <th>Status</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="region in regionStore.sortedRegions" :key="region.id">
              <td>{{ region.name }}</td>
              <td>{{ region.state }}</td>
              <td>
                <span :class="['badge', region.isActive ? 'badge-success' : 'badge-danger']">
                  {{ region.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="actions-column">
                <button 
                  @click="regionStore.toggleRegionActive(region.id)"
                  :class="['btn', region.isActive ? 'btn-danger' : 'btn-secondary']"
                >
                  {{ region.isActive ? 'Inactivate' : 'Activate' }}
                </button>
                <button class="btn btn-secondary">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="card empty-state">
        <span class="icon">📝</span>
        <p>No regions found. Add your first region to get started.</p>
        <button class="btn btn-primary">Add Region</button>
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
</style>