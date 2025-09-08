import type { ShortenedURL, ClickData } from "@/types/url-shortener"

export const saveUrlsToStorage = (urls: ShortenedURL[]): void => {
  if (typeof window === "undefined") return

  try {
    const existingUrls = getUrlsFromStorage()
    const allUrls = [...existingUrls, ...urls]
    localStorage.setItem("shortenedUrls", JSON.stringify(allUrls))
  } catch (error) {
    console.error("Failed to save URLs to storage:", error)
  }
}

export const getUrlsFromStorage = (): ShortenedURL[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("shortenedUrls")
    if (!stored) return []

    const urls = JSON.parse(stored)
    return urls.map((url: any) => ({
      ...url,
      createdAt: new Date(url.createdAt),
      expiryDate: new Date(url.expiryDate),
    }))
  } catch {
    return []
  }
}

export const updateUrlClickCount = (shortCode: string): void => {
  if (typeof window === "undefined") return

  try {
    const urls = getUrlsFromStorage()
    const updatedUrls = urls.map((url) =>
      url.shortCode === shortCode ? { ...url, clickCount: url.clickCount + 1 } : url,
    )
    localStorage.setItem("shortenedUrls", JSON.stringify(updatedUrls))
  } catch (error) {
    console.error("Failed to update click count:", error)
  }
}

export const saveClickData = (clickData: ClickData): void => {
  if (typeof window === "undefined") return

  try {
    const existing = getClickDataFromStorage()
    const allClickData = [...existing, clickData]
    localStorage.setItem("clickData", JSON.stringify(allClickData))
  } catch (error) {
    console.error("Failed to save click data:", error)
  }
}

export const getClickDataFromStorage = (): ClickData[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("clickData")
    if (!stored) return []

    const clickData = JSON.parse(stored)
    return clickData.map((data: any) => ({
      ...data,
      timestamp: new Date(data.timestamp),
    }))
  } catch {
    return []
  }
}

export const cleanupExpiredUrls = (): void => {
  if (typeof window === "undefined") return

  try {
    const urls = getUrlsFromStorage()
    const now = new Date()
    const activeUrls = urls.filter((url) => url.expiryDate > now)

    if (activeUrls.length !== urls.length) {
      localStorage.setItem("shortenedUrls", JSON.stringify(activeUrls))
    }
  } catch (error) {
    console.error("Failed to cleanup expired URLs:", error)
  }
}
