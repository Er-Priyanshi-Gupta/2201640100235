import type { ShortenedURL } from "@/types/url-shortener"
import { getUrlsFromStorage } from "./storage"

const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

export const generateShortCode = (): string => {
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += BASE62_CHARS.charAt(Math.floor(Math.random() * BASE62_CHARS.length))
  }

  // Check for uniqueness against existing URLs
  const existingUrls = getUrlsFromStorage()
  const existingCodes = existingUrls.map((url) => url.shortCode.toLowerCase())

  if (existingCodes.includes(result.toLowerCase())) {
    return generateShortCode() // Recursive retry
  }

  return result
}

export const createShortenedUrl = (
  originalUrl: string,
  shortCode: string,
  validityPeriod: number,
  isCustomShortcode: boolean,
): ShortenedURL => {
  const now = new Date()
  const expiryDate = new Date(now.getTime() + validityPeriod * 60 * 1000)

  return {
    id: crypto.randomUUID(),
    originalUrl,
    shortCode,
    createdAt: now,
    expiryDate,
    validityPeriod,
    clickCount: 0,
    isCustomShortcode,
  }
}

export const findUrlByShortCode = (shortCode: string): ShortenedURL | null => {
  const urls = getUrlsFromStorage()
  return urls.find((url) => url.shortCode.toLowerCase() === shortCode.toLowerCase()) || null
}

export const isShortCodeAvailable = (shortCode: string): boolean => {
  const existingUrls = getUrlsFromStorage()
  const existingCodes = existingUrls.map((url) => url.shortCode.toLowerCase())
  return !existingCodes.includes(shortCode.toLowerCase())
}
