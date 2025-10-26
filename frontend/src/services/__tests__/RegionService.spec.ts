import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RegionService } from '../RegionService'
import type { Region, CreateRegionDto, UpdateRegionDto } from '@/types/Region'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('RegionService', () => {
    beforeEach(() => {
        mockFetch.mockReset()
    })

    describe('getAll', () => {
        it('should fetch all regions', async () => {
            const mockRegions: Region[] = [
                {
                    id: 1,
                    name: 'Test Region',
                    state: 'TS',
                    isActive: true,
                    createdAt: '2025-10-25T00:00:00Z',
                    updatedAt: null
                }
            ]

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockRegions)
            })

            const result = await RegionService.getAll()
            expect(result).toEqual(mockRegions)
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/api/regions')
        })

        it('should throw error when fetch fails', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false
            })

            await expect(RegionService.getAll()).rejects.toThrow('Failed to fetch regions')
        })
    })

    describe('create', () => {
        it('should create a new region', async () => {
            const newRegion: CreateRegionDto = {
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

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(createdRegion)
            })

            const result = await RegionService.create(newRegion)
            expect(result).toEqual(createdRegion)
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/regions',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRegion)
                })
            )
        })
    })

    describe('update', () => {
        it('should update an existing region', async () => {
            const updateRegion: UpdateRegionDto = {
                name: 'Updated Region',
                state: 'UR',
                isActive: true
            }

            const updatedRegion: Region = {
                id: 1,
                ...updateRegion,
                createdAt: '2025-10-25T00:00:00Z',
                updatedAt: '2025-10-25T01:00:00Z'
            }

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(updatedRegion)
            })

            const result = await RegionService.update(1, updateRegion)
            expect(result).toEqual(updatedRegion)
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/regions/1',
                expect.objectContaining({
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateRegion)
                })
            )
        })
    })

    describe('toggleActive', () => {
        it('should toggle region status', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true
            })

            await RegionService.toggleActive(1)
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/regions/1/toggle-status',
                expect.objectContaining({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' }
                })
            )
        })

        it('should throw error when toggle fails', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false
            })

            await expect(RegionService.toggleActive(1)).rejects.toThrow('Failed to toggle region status')
        })
    })

    describe('delete', () => {
        it('should delete a region', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true
            })

            await RegionService.delete(1)
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/regions/1',
                expect.objectContaining({
                    method: 'DELETE'
                })
            )
        })

        it('should throw error when delete fails', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false
            })

            await expect(RegionService.delete(1)).rejects.toThrow('Failed to delete region')
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/regions/1',
                expect.objectContaining({
                    method: 'DELETE'
                })
            )
        })
    })
})