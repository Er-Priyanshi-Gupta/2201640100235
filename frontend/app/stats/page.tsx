"use client"

import { Container, Typography, Box, AppBar, Toolbar, Button, Alert } from "@mui/material"
import { useEffect, useState } from "react"
import { URLStatisticsList } from "@/components/url-statistics-list"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import type { ShortenedURL, ClickData } from "@/types/url-shortener"
import { getUrlsFromStorage, getClickDataFromStorage } from "@/lib/storage"
import Link from "next/link"
import { ArrowBack } from "@mui/icons-material"

export default function StatsPage() {
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([])
  const [clickData, setClickData] = useState<ClickData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from localStorage
    const urls = getUrlsFromStorage()
    const clicks = getClickDataFromStorage()

    setShortenedUrls(urls)
    setClickData(clicks)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="url-shortener-container">
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Button color="inherit" component={Link} href="/" startIcon={<ArrowBack />}>
              Back to Shortener
            </Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
              URL Statistics
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography>Loading statistics...</Typography>
          </Box>
        </Container>
      </div>
    )
  }

  return (
    <div className="url-shortener-container">
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Button color="inherit" component={Link} href="/" startIcon={<ArrowBack />}>
            Back to Shortener
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            URL Statistics
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Detailed statistics and analytics for all your shortened URLs
          </Typography>
        </Box>

        {shortenedUrls.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            No shortened URLs found. <Link href="/">Create your first shortened URL</Link> to see statistics here.
          </Alert>
        ) : (
          <>
            <AnalyticsDashboard urls={shortenedUrls} clickData={clickData} />
            <URLStatisticsList urls={shortenedUrls} clickData={clickData} />
          </>
        )}
      </Container>
    </div>
  )
}
