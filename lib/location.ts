export interface LocationCoordinates {
  latitude: number
  longitude: number
}

export interface LocationResult {
  coordinates: LocationCoordinates
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export class LocationError extends Error {
  constructor(message: string, public code: number) {
    super(message)
    this.name = 'LocationError'
  }
}

export async function getCurrentLocation(): Promise<LocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new LocationError('Geolocation is not supported by this browser', 1))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }

        try {
          // In a real app, you'd use a geocoding service like Google Maps API
          // For demo purposes, we'll return mock data
          const result: LocationResult = {
            coordinates,
            address: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105'
          }
          resolve(result)
        } catch (error) {
          resolve({ coordinates })
        }
      },
      (error) => {
        let message = 'Unknown error occurred'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            message = 'Location request timed out'
            break
        }
        reject(new LocationError(message, error.code))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function formatDistance(distance: number): string {
  if (distance < 0.1) {
    return 'Less than 0.1 miles'
  } else if (distance < 1) {
    return `${Math.round(distance * 10) / 10} miles`
  } else {
    return `${distance.toFixed(1)} miles`
  }
}

// Mock geocoding function - in real app would use actual geocoding service
export async function geocodeAddress(address: string): Promise<LocationCoordinates | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock coordinates for common cities
  const mockCoordinates: Record<string, LocationCoordinates> = {
    'san francisco': { latitude: 37.7749, longitude: -122.4194 },
    'new york': { latitude: 40.7128, longitude: -74.0060 },
    'los angeles': { latitude: 34.0522, longitude: -118.2437 },
    'chicago': { latitude: 41.8781, longitude: -87.6298 },
    'seattle': { latitude: 47.6062, longitude: -122.3321 }
  }

  const normalizedAddress = address.toLowerCase().trim()
  return mockCoordinates[normalizedAddress] || null
} 