"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Container, Typography, Box, Card, CardContent, Button, CircularProgress, Alert } from "@mui/material"
import { OpenInNew, Home } from "@mui/icons-material"
import { getUrlsFromStorage, updateUrlClickCount, saveClickData } from "@/lib/storage"
import { getGeolocationData } from "@/lib/geolocation"
import type { ShortenedURL, ClickData } from "@/types/url-shortener"
import Link from "next/link"

export default function RedirectPage() {
  const params = useParams()
  const router = useRouter()
  const shortCode = params.shortCode as string

  const [status, setStatus] = useState<"loading" | "redirecting" | "expired" | "not-found" | "error">("loading")
  const [url, setUrl] = useState<ShortenedURL | null>(null)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Get URLs from storage
        const urls = getUrlsFromStorage()
        const foundUrl = urls.find((u) => u.shortCode.toLowerCase() === shortCode.toLowerCase())

        if (!foundUrl) {
          setStatus("not-found")
          return
        }

        setUrl(foundUrl)

        // Check if URL has expired
        const now = new Date()
        if (now > foundUrl.expiryDate) {
          setStatus("expired")
          return
        }

        // Track the click (enhanced with better geolocation)
        await trackClick(foundUrl)

        // Update click count
        updateUrlClickCount(foundUrl.shortCode)

        // Set redirecting status and start countdown
        setStatus("redirecting")

        // Start countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              // Redirect to original URL
              window.location.href = foundUrl.originalUrl
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (error) {
        console.error("Error handling redirect:", error)
        setStatus("error")
      }
    }

    if (shortCode) {
      handleRedirect()
    }
  }, [shortCode])

  const trackClick = async (url: ShortenedURL) => {
    try {
      const geographicalLocation = await getGeolocationData()

      const clickData: ClickData = {
        id: crypto.randomUUID(),
        shortCodeId: url.id,
        timestamp: new Date(),
        source: document.referrer || "Direct",
        geographicalLocation,
        userAgent: navigator.userAgent,
      }

      saveClickData(clickData)

      console.log("[v0] Click tracked:", {
        shortCode: url.shortCode,
        source: clickData.source,
        location: geographicalLocation,
        timestamp: clickData.timestamp,
      })
    } catch (error) {
      console.error("Error tracking click:", error)
    }
  }

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Processing your request...</Typography>
          </Box>
        )

      case "redirecting":
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Redirecting...
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You will be redirected to the original URL in {countdown} seconds
            </Typography>

            {url && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Destination:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: "break-all",
                    bgcolor: "grey.100",
                    p: 2,
                    borderRadius: 1,
                    fontFamily: "monospace",
                  }}
                >
                  {url.originalUrl}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                startIcon={<OpenInNew />}
                onClick={() => url && (window.location.href = url.originalUrl)}
              >
                Go Now
              </Button>
              <Button variant="outlined" component={Link} href="/" startIcon={<Home />}>
                Back to Home
              </Button>
            </Box>
          </Box>
        )

      case "expired":
        return (
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              This shortened URL has expired
            </Alert>
            <Typography variant="h4" gutterBottom>
              Link Expired
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This shortened URL has expired and is no longer valid.
            </Typography>

            {url && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original URL was:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: "break-all",
                    bgcolor: "grey.100",
                    p: 2,
                    borderRadius: 1,
                    fontFamily: "monospace",
                  }}
                >
                  {url.originalUrl}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Expired on: {url.expiryDate.toLocaleString()}
                </Typography>
              </Box>
            )}

            <Button variant="contained" component={Link} href="/" startIcon={<Home />}>
              Create New Short URL
            </Button>
          </Box>
        )

      case "not-found":
        return (
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              Shortened URL not found
            </Alert>
            <Typography variant="h4" gutterBottom>
              404 - Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The shortened URL "/{shortCode}" does not exist or may have been deleted.
            </Typography>

            <Button variant="contained" component={Link} href="/" startIcon={<Home />}>
              Create New Short URL
            </Button>
          </Box>
        )

      case "error":
        return (
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              An error occurred while processing your request
            </Alert>
            <Typography variant="h4" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please try again or contact support if the problem persists.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="contained" onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button variant="outlined" component={Link} href="/" startIcon={<Home />}>
                Back to Home
              </Button>
            </Box>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <div className="url-shortener-container">
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={{ width: "100%", maxWidth: 600 }}>
            <CardContent sx={{ p: 4 }}>{renderContent()}</CardContent>
          </Card>
        </Box>
      </Container>
    </div>
  )
}
