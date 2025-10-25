import { ref, onMounted } from 'vue'
import { useRegionStore } from '@/stores/RegionStore'

export default {
  name: 'RegionsView',
  setup() {
    const regionStore = useRegionStore()

    onMounted(async () => {
      await regionStore.fetchRegions()
    })

    return {
      regions: regionStore.sortedRegions,
      loading: regionStore.loading,
      error: regionStore.error
    }
  }
}