import { defineStore } from 'pinia'
import type { Region, CreateRegionDto, UpdateRegionDto } from '@/types/Region'
import { RegionService } from '@/services/RegionService'

export const useRegionStore = defineStore('region', {
    state: () => ({
        regions: [] as Region[],
        loading: false,
        error: null as string | null
    }),
    
    getters: {
        sortedRegions: (state) => {
            return [...state.regions].sort((a, b) => {
                // First sort by UF
                const ufCompare = a.uf.localeCompare(b.uf)
                if (ufCompare !== 0) return ufCompare
                // Then sort by name
                return a.name.localeCompare(b.name)
            })
        }
    },
    
    actions: {
        async fetchRegions() {
            this.loading = true
            this.error = null
            try {
                this.regions = await RegionService.getAll()
            } catch (error) {
                this.error = 'Failed to fetch regions'
                console.error(error)
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
                const index = this.regions.findIndex(r => r.id === id)
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
                const updatedRegion = await RegionService.toggleActive(id)
                const index = this.regions.findIndex(r => r.id === id)
                if (index !== -1) {
                    this.regions[index] = updatedRegion
                }
            } catch (error) {
                this.error = 'Failed to toggle region status'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})