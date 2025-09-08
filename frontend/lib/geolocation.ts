export interface GeolocationData {
  country?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
}

export const getGeolocationData = async (): Promise<GeolocationData> => {
  // Try browser geolocation first
  if (navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          enableHighAccuracy: false,
        })
      })

      // In a real application, you would use the coordinates to get location data
      // from a service like ipapi.co, ipgeolocation.io, or similar
      // For demo purposes, we'll return mock data based on common locations
      return {
        country: "United States",
        region: "California",
        city: "San Francisco",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
    } catch (error) {
      console.log("Geolocation permission denied or unavailable")
    }
  }

  // Fallback: Try to get location from IP (mock implementation)
  try {
    // In a real app, you would call an IP geolocation service here
    // const response = await fetch('https://ipapi.co/json/')
    // const data = await response.json()

    // Mock data for demo
    const mockLocations = [
      { country: "United States", region: "California", city: "San Francisco" },
      { country: "United States", region: "New York", city: "New York" },
      { country: "United Kingdom", region: "England", city: "London" },
      { country: "Canada", region: "Ontario", city: "Toronto" },
      { country: "Germany", region: "Berlin", city: "Berlin" },
      { country: "France", region: "Île-de-France", city: "Paris" },
      { country: "Japan", region: "Tokyo", city: "Tokyo" },
      { country: "Australia", region: "New South Wales", city: "Sydney" },
    ]

    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)]
    return randomLocation
  } catch (error) {
    console.error("Failed to get IP-based location:", error)
  }

  // Final fallback
  return {
    country: "Unknown",
    region: "Unknown",
    city: "Unknown",
  }
}
