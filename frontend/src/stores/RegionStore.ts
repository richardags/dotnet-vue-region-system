import { defineStore } from 'pinia'
import type { Region, CreateRegionDto, UpdateRegionDto } from '@/types/Region'
import { RegionService } from '@/services/RegionService'

export const useRegionStore = defineStore('region', {
    state: () => ({
        regions: [] as Region[],
        loading: false,
        error: null as string | null,
        searchQuery: '',
        filterActive: null as boolean | null
    }),
    
    getters: {
        filteredRegions: (state) => {
            if (!state.regions || !Array.isArray(state.regions) || state.regions.length === 0) {
                return []
            }

            return state.regions.filter(region => {
                // Search query filter
                const searchMatch = !state.searchQuery || 
                    region.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                    region.state.toLowerCase().includes(state.searchQuery.toLowerCase())

                // Active status filter
                const activeMatch = state.filterActive === null || region.isActive === state.filterActive

                return searchMatch && activeMatch
            })
        },
        sortedRegions: (state) => {
            const store = useRegionStore()
            return [...store.filteredRegions].sort((a, b) => {
                // Ensure both objects have the required properties
                if (!a || !b || !a.state || !b.state || !a.name || !b.name) {
                    return 0
                }
                // Sort by state first
                const stateCompare = a.state.localeCompare(b.state)
                if (stateCompare !== 0) return stateCompare
                // If states are equal, sort by region name
                return a.name.localeCompare(b.name)
            })
        }
    },
    
    actions: {
        async fetchRegions() {
            this.loading = true
            this.error = null
            try {
                const response = await RegionService.getAll()
                console.log('API Response:', response)  // Debug log
                
                // Validate that we received an array
                if (!Array.isArray(response)) {
                    console.warn('Response is not an array:', response)  // Debug log
                    throw new Error('Invalid response format')
                }
                
                // Log before filtering
                console.log('Before filtering:', response.length, 'items')  // Debug log
                
                // Validate each region object
                this.regions = response.filter(region => {
                    const isValid = region &&
                        typeof region.id === 'number' &&
                        typeof region.name === 'string' &&
                        typeof region.state === 'string' &&
                        typeof region.isActive === 'boolean' &&
                        typeof region.createdAt === 'string' &&
                        (region.updatedAt === null || typeof region.updatedAt === 'string')
                    
                    if (!isValid) {
                        console.warn('Invalid region object:', region)  // Debug log
                    }
                    return isValid
                })
                
                // Log after filtering
                console.log('After filtering:', this.regions.length, 'items')  // Debug log
                console.log('Filtered regions:', this.regions)  // Debug log
            } catch (error) {
                this.error = 'Failed to fetch regions'
                console.error('Fetch error:', error)  // Debug log
                this.regions = [] // Reset to empty array on error
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
                await this.fetchRegions() // Refetch all regions to get updated state
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