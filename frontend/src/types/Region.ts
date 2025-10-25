export interface Region {
    id: number
    name: string
    uf: string
    isActive: boolean
}

export interface CreateRegionDto {
    name: string
    uf: string
}

export interface UpdateRegionDto extends CreateRegionDto {
    isActive: boolean
}