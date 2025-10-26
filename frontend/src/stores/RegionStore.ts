import { defineStore } from 'pinia'
import type { Region, CreateRegionDto, UpdateRegionDto } from '@/types/Region'
import { RegionService } from '@/services/RegionService'

export const useRegionStore = defineStore('region', {
    state: () => ({
        regions: [] as Region[],
        loading: false,
        error: null as string | null,
        searchQuery: '',
        filterActive: '',
        sortField: 'state' as 'name' | 'state' | 'isActive',
        sortDirection: 'asc' as 'asc' | 'desc'
    }),
    
    getters: {
        filteredRegions: (state) => {
            return state.regions.filter(region => {
                // Search query filter
                const searchMatch = !state.searchQuery || 
                    region.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                    region.state.toLowerCase().includes(state.searchQuery.toLowerCase())

                // Active status filter
                const activeMatch = !state.filterActive ? true : region.isActive === (state.filterActive === 'true')

                return searchMatch && activeMatch
            })
        }
    },
    
    actions: {
        async fetchRegions() {
            if (this.loading) return // Prevent multiple simultaneous requests
            
            this.loading = true
            this.error = null
            
            try {
                const response = await RegionService.getAll()
                this.regions = response
            } catch (error) {
                console.error('Failed to fetch regions:', error)
                this.error = 'Failed to fetch regions'
                this.regions = []
            } finally {
                this.loading = false
            }
        },

        async createRegion(region: CreateRegionDto) {
            this.loading = true
            this.error = null
            try {
                await RegionService.create(region)
                await RegionService.getAll() // Get updated list
                await this.fetchRegions() // Refresh list to ensure correct sorting
            } catch (error) {
                this.error = 'Failed to create region'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateRegion(id: number, region: UpdateRegionDto) {
            this.loading = true
            this.error = null
            try {
                await RegionService.update(id, region)
                await RegionService.getAll() // Get updated list
                await this.fetchRegions() // Refresh list to ensure correct sorting
            } catch (error) {
                this.error = 'Failed to update region'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async toggleRegionActive(id: number) {
            this.loading = true
            this.error = null
            try {
                await RegionService.toggleActive(id)
                await this.fetchRegions() // Refresh the list to get updated data
            } catch (error) {
                this.error = 'Failed to toggle region status'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteRegion(id: number) {
            this.loading = true
            this.error = null
            try {
                await RegionService.delete(id)
                this.regions = this.regions.filter((region: Region) => region.id !== id)
            } catch (error) {
                this.error = 'Failed to delete region'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})