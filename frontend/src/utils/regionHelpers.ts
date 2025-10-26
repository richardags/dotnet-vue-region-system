import type { Region } from '@/types/Region'

export function formatDate(date: string | null): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function validateRegion(region: Partial<Region>): string[] {
  const errors: string[] = []
  
  if (!region.name?.trim()) {
    errors.push('Name is required')
  }
  
  if (!region.state?.trim()) {
    errors.push('State is required')
  } else if (region.state.length !== 2) {
    errors.push('State must be exactly 2 characters')
  }
  
  return errors
}