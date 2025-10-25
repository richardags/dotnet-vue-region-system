export interface Region {
    id: number
    name: string
    state: string // API returns this as state
    isActive: boolean
    createdAt: string
    updatedAt: string | null
}

export interface CreateRegionDto {
    name: string
    state: string // Maps to state in the API
}

export interface UpdateRegionDto extends CreateRegionDto {
    isActive: boolean
}