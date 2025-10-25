import type { Region, CreateRegionDto, UpdateRegionDto } from '@/types/Region'
import api from './api'

export const RegionService = {
    async getAll(): Promise<Region[]> {
        try {
            const response = await fetch(`${api.API_BASE_URL}/regions`)
            if (!response.ok) {
                throw new Error(`Failed to fetch regions: ${response.status} ${response.statusText}`)
            }
            const data = await response.json()
            if (!Array.isArray(data)) {
                throw new Error('Invalid response format: expected an array')
            }
            return data
        } catch (error) {
            console.error('Error fetching regions:', error)
            throw error
        }
    },

    async create(region: CreateRegionDto): Promise<Region> {
        const response = await fetch(`${api.API_BASE_URL}/regions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(region)
        })
        if (!response.ok) {
            throw new Error('Failed to create region')
        }
        return response.json()
    },

    async update(id: number, region: UpdateRegionDto): Promise<Region> {
        const response = await fetch(`${api.API_BASE_URL}/regions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(region)
        })
        if (!response.ok) {
            throw new Error('Failed to update region')
        }
        return response.json()
    },

    async toggleActive(id: number): Promise<void> {
        const response = await fetch(`${api.API_BASE_URL}/regions/${id}/toggle-status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error('Failed to toggle region status')
        }
    },

    async delete(id: number): Promise<void> {
        const response = await fetch(`${api.API_BASE_URL}/regions/${id}`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw new Error('Failed to delete region')
        }
    }
}