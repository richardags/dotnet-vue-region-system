import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRegionStore } from '../RegionStore'
import { RegionService } from '@/services/RegionService'
import type { Region } from '@/types/Region'

// Mock RegionService
vi.mock('@/services/RegionService', () => ({
    RegionService: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        toggleActive: vi.fn()
    }
}))

describe('RegionStore', () => {
    let store: ReturnType<typeof useRegionStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useRegionStore()
        vi.clearAllMocks()
    })

    describe('fetchRegions', () => {
        it('should fetch and sort regions', async () => {
            const mockRegions: Region[] = [
                {
                    id: 1,
                    name: 'Region B',
                    state: 'RB',
                    isActive: true,
                    createdAt: '2025-10-25T00:00:00Z',
                    updatedAt: null
                },
                {
                    id: 2,
                    name: 'Region A',
                    state: 'RA',
                    isActive: true,
                    createdAt: '2025-10-25T00:00:00Z',
                    updatedAt: null
                }
            ]

            vi.mocked(RegionService.getAll).mockResolvedValueOnce(mockRegions)

            await store.fetchRegions()

            expect(store.regions).toEqual(mockRegions)
            expect(store.sortedRegions[0]?.name).toBe('Region A') // Check sorting
            expect(store.error).toBeNull()
        })

        it('should handle fetch error', async () => {
            vi.mocked(RegionService.getAll).mockRejectedValueOnce(new Error('API Error'))

            await store.fetchRegions()

            expect(store.regions).toEqual([])
            expect(store.error).toBe('Failed to fetch regions')
        })
    })

    describe('createRegion', () => {
        it('should create a new region and refresh list', async () => {
            const newRegion = {
                name: 'New Region',
                state: 'NR'
            }

            const createdRegion: Region = {
                id: 1,
                name: 'New Region',
                state: 'NR',
                isActive: true,
                createdAt: '2025-10-25T00:00:00Z',
                updatedAt: null
            }

            vi.mocked(RegionService.create).mockResolvedValueOnce(createdRegion)
            vi.mocked(RegionService.getAll).mockResolvedValueOnce([createdRegion])

            await store.createRegion(newRegion)

            expect(RegionService.create).toHaveBeenCalledWith(newRegion)
            expect(RegionService.getAll).toHaveBeenCalled()
            expect(store.error).toBeNull()
        })
    })

    describe('updateRegion', () => {
        it('should update a region and refresh list', async () => {
            const updateData = {
                name: 'Updated Region',
                state: 'UR',
                isActive: true
            }

            const updatedRegion: Region = {
                id: 1,
                ...updateData,
                createdAt: '2025-10-25T00:00:00Z',
                updatedAt: '2025-10-25T01:00:00Z'
            }

            vi.mocked(RegionService.update).mockResolvedValueOnce(updatedRegion)
            vi.mocked(RegionService.getAll).mockResolvedValueOnce([updatedRegion])

            await store.updateRegion(1, updateData)

            expect(RegionService.update).toHaveBeenCalledWith(1, updateData)
            expect(RegionService.getAll).toHaveBeenCalled()
            expect(store.error).toBeNull()
        })
    })

    describe('toggleRegionActive', () => {
        it('should toggle region status and refresh list', async () => {
            const mockRegions: Region[] = [{
                id: 1,
                name: 'Test Region',
                state: 'TR',
                isActive: false,
                createdAt: '2025-10-25T00:00:00Z',
                updatedAt: '2025-10-25T01:00:00Z'
            }]

            vi.mocked(RegionService.toggleActive).mockResolvedValueOnce()
            vi.mocked(RegionService.getAll).mockResolvedValueOnce(mockRegions)

            await store.toggleRegionActive(1)

            expect(RegionService.toggleActive).toHaveBeenCalledWith(1)
            expect(RegionService.getAll).toHaveBeenCalled()
            expect(store.error).toBeNull()
        })

        it('should handle toggle error', async () => {
            vi.mocked(RegionService.toggleActive).mockRejectedValueOnce(new Error('Toggle failed'))

            await expect(store.toggleRegionActive(1)).rejects.toThrow()
            expect(store.error).toBe('Failed to toggle region status')
        })
    })
})