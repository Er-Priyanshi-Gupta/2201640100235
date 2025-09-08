export interface ShortenedURL {
  id: string
  originalUrl: string
  shortCode: string
  createdAt: Date
  expiryDate: Date
  validityPeriod: number // minutes
  clickCount: number
  isCustomShortcode: boolean
}

export interface ClickData {
  id: string
  shortCodeId: string
  timestamp: Date
  source: string // referrer
  geographicalLocation: {
    country?: string
    region?: string
    city?: string
  }
  userAgent: string
}

export interface URLFormData {
  originalUrl: string
  validityPeriod: number
  customShortcode?: string
}
