import { defineStore } from 'pinia'
import type { Region, CreateRegionDto, UpdateRegionDto } from '@/types/Region'
import { RegionService } from '@/services/RegionService'

export const useRegionStore = defineStore('region', {
    state: () => ({
        regions: [] as Region[],
        loading: false,
        error: null as string | null,
        searchQuery: '',
        filterActive: null as boolean | null,
        sortField: 'state' as 'name' | 'state' | 'isActive',
        sortDirection: 'asc' as 'asc' | 'desc'
    }),
    
    getters: {
        filteredRegions: (state) => {
            if (!state.regions || !Array.isArray(state.regions) || state.regions.length === 0) {
                return []
            }

            const filtered = state.regions.filter(region => {
                // Search query filter
                const searchMatch = !state.searchQuery || 
                    region.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                    region.state.toLowerCase().includes(state.searchQuery.toLowerCase())

                // Active status filter
                const activeMatch = state.filterActive === null || region.isActive === state.filterActive

                return searchMatch && activeMatch
            })

            return filtered
        },
        sortedRegions: (state) => {
            // First filter the regions
            const filtered = state.regions.filter(region => {
                // Search query filter
                const searchMatch = !state.searchQuery || 
                    region.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                    region.state.toLowerCase().includes(state.searchQuery.toLowerCase())

                // Active status filter
                const activeMatch = state.filterActive === null || region.isActive === state.filterActive

                return searchMatch && activeMatch
            })

            // Then sort the filtered results
            return filtered.sort((a, b) => {
                const direction = state.sortDirection === 'asc' ? 1 : -1
                
                switch (state.sortField) {
                    case 'name':
                        return direction * a.name.localeCompare(b.name)
                    case 'state':
                        return direction * a.state.localeCompare(b.state)
                    case 'isActive':
                        return direction * (Number(a.isActive) - Number(b.isActive))
                    default:
                        return 0
                }
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
                this.error = error instanceof Error ? error.message : 'Failed to fetch regions'
                this.regions = []
            } finally {
                this.loading = false
            }
        },

        async createRegion(region: CreateRegionDto) {
            this.loading = true
            this.error = null
            try {
                const newRegion = await RegionService.create(region)
                this.regions.push(newRegion)
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
                const updatedRegion = await RegionService.update(id, region)
                const index = this.regions.findIndex((r: Region) => r.id === id)
                if (index !== -1) {
                    this.regions[index] = updatedRegion
                }
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
                // Update local state immediately
                const region = this.regions.find(r => r.id === id)
                if (region) {
                    region.isActive = !region.isActive
                }
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