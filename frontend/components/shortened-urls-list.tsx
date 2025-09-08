"use client"

import { Card, CardContent, Typography, Box, Chip, IconButton, Alert, Link as MuiLink, Tooltip } from "@mui/material"
import { ContentCopy, OpenInNew } from "@mui/icons-material"
import type { ShortenedURL } from "@/types/url-shortener"
import { useState } from "react"

interface ShortenedURLsListProps {
  urls: ShortenedURL[]
}

export function ShortenedURLsList({ urls }: ShortenedURLsListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${url}`)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const formatExpiryTime = (expiryDate: Date) => {
    const now = new Date()
    const diffMs = expiryDate.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins <= 0) return "Expired"
    if (diffMins < 60) return `${diffMins}m remaining`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m remaining`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ${diffHours % 24}h remaining`
  }

  if (urls.length === 0) return null

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" component="h2" gutterBottom>
          Shortened URLs
        </Typography>

        <Alert severity="success" sx={{ mb: 3 }}>
          Successfully shortened {urls.length} URL{urls.length > 1 ? "s" : ""}! Your links are ready to use.
        </Alert>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {urls.map((url) => (
            <Card key={url.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Original URL:
                    </Typography>
                    <MuiLink
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {url.originalUrl}
                      <OpenInNew sx={{ ml: 0.5, fontSize: 16 }} />
                    </MuiLink>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography variant="body2" color="text.secondary">
                      Short URL:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "monospace",
                          bgcolor: "grey.100",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        {window.location.origin}/{url.shortCode}
                      </Typography>
                      <Tooltip title={copiedId === url.id ? "Copied!" : "Copy to clipboard"}>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(url.shortCode, url.id)}
                          color={copiedId === url.id ? "success" : "default"}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={formatExpiryTime(url.expiryDate)}
                      color={new Date() > url.expiryDate ? "error" : "success"}
                      size="small"
                    />
                    {url.isCustomShortcode && (
                      <Chip label="Custom Code" color="primary" variant="outlined" size="small" />
                    )}
                    <Chip label={`${url.clickCount} clicks`} variant="outlined" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
