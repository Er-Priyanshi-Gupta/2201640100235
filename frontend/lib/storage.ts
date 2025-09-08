import type { ShortenedURL, ClickData } from "@/types/url-shortener"
import { logger } from "./logger"

export const saveUrlsToStorage = (urls: ShortenedURL[]): void => {
  if (typeof window === "undefined") return

  try {
    const existingUrls = getUrlsFromStorage()
    const allUrls = [...existingUrls, ...urls]
    localStorage.setItem("shortenedUrls", JSON.stringify(allUrls))
    logger.info("URLs saved to storage", "Storage", { count: urls.length, totalUrls: allUrls.length })
  } catch (error) {
    logger.error("Failed to save URLs to storage", "Storage", {
      error: error instanceof Error ? error.message : String(error),
    })
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
    logger.info("Click count updated", "Storage", { shortCode })
  } catch (error) {
    logger.error("Failed to update click count", "Storage", {
      shortCode,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const saveClickData = (clickData: ClickData): void => {
  if (typeof window === "undefined") return

  try {
    const existing = getClickDataFromStorage()
    const allClickData = [...existing, clickData]
    localStorage.setItem("clickData", JSON.stringify(allClickData))
    logger.info("Click data saved", "Storage", {
      shortCodeId: clickData.shortCodeId,
      source: clickData.source,
      location: clickData.geographicalLocation?.city,
    })
  } catch (error) {
    logger.error("Failed to save click data", "Storage", {
      error: error instanceof Error ? error.message : String(error),
    })
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
      logger.info("Expired URLs cleaned up", "Storage", {
        removedCount: urls.length - activeUrls.length,
        remainingCount: activeUrls.length,
      })
    }
  } catch (error) {
    logger.error("Failed to cleanup expired URLs", "Storage", {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
