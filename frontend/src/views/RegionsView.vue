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
    <div v-if="regionStore.loading" class="loading">
      Loading regions...
    </div>
    
    <div v-else-if="regionStore.error" class="error">
      {{ regionStore.error }}
    </div>
    
    <div v-else class="regions-content">
      <h2>Regions List</h2>
      <table v-if="regionStore.sortedRegions.length">
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="region in regionStore.sortedRegions" :key="region.id">
            <td>{{ region.name }}</td>
            <td>{{ region.state }}</td>
            <td>{{ region.isActive ? 'Active' : 'Inactive' }}</td>
            <td>
              <button @click="regionStore.toggleRegionActive(region.id)">
                {{ region.isActive ? 'Inactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No regions found.</p>
    </div>
  </div>
</template>

<style scoped>
.regions {
  width: 100%;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: red;
}

.regions-content {
  margin-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  font-weight: bold;
  background-color: var(--color-background);
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  cursor: pointer;
}

button:hover {
  background-color: var(--color-background-soft);
}
</style>