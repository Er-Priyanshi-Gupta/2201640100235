"use client"

import { Container, Typography, Box, AppBar, Toolbar, Button } from "@mui/material"
import { useState } from "react"
import { URLShortenerForm } from "@/components/url-shortener-form"
import { ShortenedURLsList } from "@/components/shortened-urls-list"
import type { ShortenedURL } from "@/types/url-shortener"
import Link from "next/link"

export default function HomePage() {
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([])

  const handleUrlsShortened = (newUrls: ShortenedURL[]) => {
    setShortenedUrls((prev) => [...prev, ...newUrls])
  }

  return (
    <div className="url-shortener-container">
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} href="/stats">
            Statistics
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Shorten Your URLs
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Create short, trackable links with detailed analytics. Shorten up to 5 URLs at once.
          </Typography>
        </Box>

        <URLShortenerForm onUrlsShortened={handleUrlsShortened} />

        {shortenedUrls.length > 0 && <ShortenedURLsList urls={shortenedUrls} />}
      </Container>
    </div>
  )
}
