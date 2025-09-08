"use client"

import { Card, CardContent, Typography, Grid, Box, Chip } from "@mui/material"
import { Link as LinkIcon, TrendingUp, Schedule, Public } from "@mui/icons-material"
import type { ShortenedURL, ClickData } from "@/types/url-shortener"
import { getAnalyticsData } from "@/lib/analytics"
import { useEffect, useState } from "react"

interface AnalyticsDashboardProps {
  urls: ShortenedURL[]
  clickData: ClickData[]
}

export function AnalyticsDashboard({ urls, clickData }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState(getAnalyticsData())

  useEffect(() => {
    setAnalytics(getAnalyticsData())
  }, [urls, clickData])

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h2" component="h2" gutterBottom>
        Analytics Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <LinkIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {analytics.totalUrls}
              </Typography>
              <Typography color="text.secondary">Total URLs</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {analytics.totalClicks}
              </Typography>
              <Typography color="text.secondary">Total Clicks</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Schedule color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {analytics.activeUrls}
              </Typography>
              <Typography color="text.secondary">Active URLs</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Public color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {analytics.clicksLast24h}
              </Typography>
              <Typography color="text.secondary">Clicks (24h)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" component="div" gutterBottom color="primary">
                {analytics.averageClicksPerUrl}
              </Typography>
              <Typography color="text.secondary">Avg Clicks/URL</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" component="div" gutterBottom color="success.main">
                {analytics.conversionRate}%
              </Typography>
              <Typography color="text.secondary">URLs with Clicks</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" component="div" gutterBottom color="info.main">
                {analytics.clicksLast7d}
              </Typography>
              <Typography color="text.secondary">Clicks (7 days)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" component="h3" gutterBottom>
                Top Performing URLs
              </Typography>
              {analytics.topUrls.length === 0 ? (
                <Typography color="text.secondary">No URLs with clicks yet</Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {analytics.topUrls.map(({ url, clicks }, index) => (
                    <Box key={url.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontFamily: "monospace", color: "primary.main" }}>
                          /{url.shortCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {url.originalUrl}
                        </Typography>
                      </Box>
                      <Chip label={`${clicks} clicks`} color={index === 0 ? "primary" : "default"} size="small" />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h3" component="h3" gutterBottom>
                Traffic Sources
              </Typography>
              {analytics.clicksBySources.length === 0 ? (
                <Typography color="text.secondary">No traffic data available</Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {analytics.clicksBySources.map(({ source, clicks }) => (
                    <Box key={source} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body1">{source}</Typography>
                      <Chip label={`${clicks} clicks`} variant="outlined" size="small" />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
