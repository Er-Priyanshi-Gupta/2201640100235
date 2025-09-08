import type { ShortenedURL } from "@/types/url-shortener"
import { getUrlsFromStorage, getClickDataFromStorage } from "./storage"

export interface AnalyticsData {
  totalUrls: number
  totalClicks: number
  activeUrls: number
  expiredUrls: number
  clicksLast24h: number
  clicksLast7d: number
  topUrls: Array<{ url: ShortenedURL; clicks: number }>
  clicksByHour: Array<{ hour: number; clicks: number }>
  clicksByCountry: Array<{ country: string; clicks: number }>
  clicksBySources: Array<{ source: string; clicks: number }>
  averageClicksPerUrl: number
  conversionRate: number
}

export const getAnalyticsData = (): AnalyticsData => {
  const urls = getUrlsFromStorage()
  const clickData = getClickDataFromStorage()
  const now = new Date()

  // Basic metrics
  const totalUrls = urls.length
  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0)
  const activeUrls = urls.filter((url) => url.expiryDate > now).length
  const expiredUrls = totalUrls - activeUrls

  // Time-based metrics
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const clicksLast24h = clickData.filter((click) => click.timestamp > last24Hours).length
  const clicksLast7d = clickData.filter((click) => click.timestamp > last7Days).length

  // Top performing URLs
  const topUrls = urls
    .map((url) => ({ url, clicks: url.clickCount }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  // Clicks by hour (last 24 hours)
  const clicksByHour = Array.from({ length: 24 }, (_, i) => {
    const hour = (now.getHours() - i + 24) % 24
    const hourStart = new Date(now)
    hourStart.setHours(hour, 0, 0, 0)
    const hourEnd = new Date(hourStart)
    hourEnd.setHours(hour + 1, 0, 0, 0)

    const clicks = clickData.filter((click) => click.timestamp >= hourStart && click.timestamp < hourEnd).length

    return { hour, clicks }
  }).reverse()

  // Geographic distribution
  const countryClicks = clickData.reduce(
    (acc, click) => {
      const country = click.geographicalLocation.country || "Unknown"
      acc[country] = (acc[country] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const clicksByCountry = Object.entries(countryClicks)
    .map(([country, clicks]) => ({ country, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)

  // Traffic sources
  const sourceClicks = clickData.reduce(
    (acc, click) => {
      const source =
        click.source === ""
          ? "Direct"
          : click.source.includes("google")
            ? "Google"
            : click.source.includes("facebook")
              ? "Facebook"
              : click.source.includes("twitter")
                ? "Twitter"
                : click.source.includes("linkedin")
                  ? "LinkedIn"
                  : new URL(click.source || "direct://").hostname || "Direct"
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const clicksBySources = Object.entries(sourceClicks)
    .map(([source, clicks]) => ({ source, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)

  // Additional metrics
  const averageClicksPerUrl = totalUrls > 0 ? totalClicks / totalUrls : 0
  const urlsWithClicks = urls.filter((url) => url.clickCount > 0).length
  const conversionRate = totalUrls > 0 ? (urlsWithClicks / totalUrls) * 100 : 0

  return {
    totalUrls,
    totalClicks,
    activeUrls,
    expiredUrls,
    clicksLast24h,
    clicksLast7d,
    topUrls,
    clicksByHour,
    clicksByCountry,
    clicksBySources,
    averageClicksPerUrl: Math.round(averageClicksPerUrl * 100) / 100,
    conversionRate: Math.round(conversionRate * 100) / 100,
  }
}

export const getUrlAnalytics = (urlId: string) => {
  const clickData = getClickDataFromStorage()
  const urlClicks = clickData.filter((click) => click.shortCodeId === urlId)

  if (urlClicks.length === 0) {
    return {
      totalClicks: 0,
      clicksByDay: [],
      topSources: [],
      topCountries: [],
      averageClicksPerDay: 0,
    }
  }

  // Clicks by day (last 7 days)
  const now = new Date()
  const clicksByDay = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    const clicks = urlClicks.filter((click) => click.timestamp >= date && click.timestamp < nextDay).length

    return {
      date: date.toISOString().split("T")[0],
      clicks,
    }
  }).reverse()

  // Top sources for this URL
  const sourceClicks = urlClicks.reduce(
    (acc, click) => {
      const source = click.source || "Direct"
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topSources = Object.entries(sourceClicks)
    .map(([source, clicks]) => ({ source, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  // Top countries for this URL
  const countryClicks = urlClicks.reduce(
    (acc, click) => {
      const country = click.geographicalLocation.country || "Unknown"
      acc[country] = (acc[country] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topCountries = Object.entries(countryClicks)
    .map(([country, clicks]) => ({ country, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  const averageClicksPerDay = urlClicks.length / 7

  return {
    totalClicks: urlClicks.length,
    clicksByDay,
    topSources,
    topCountries,
    averageClicksPerDay: Math.round(averageClicksPerDay * 100) / 100,
  }
}
