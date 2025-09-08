"use client"

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as MuiLink,
} from "@mui/material"
import { ExpandMore, OpenInNew } from "@mui/icons-material"
import type { ShortenedURL, ClickData } from "@/types/url-shortener"

interface URLStatisticsListProps {
  urls: ShortenedURL[]
  clickData: ClickData[]
}

export function URLStatisticsList({ urls, clickData }: URLStatisticsListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatExpiryStatus = (expiryDate: Date) => {
    const now = new Date()
    const isExpired = now > expiryDate

    if (isExpired) {
      return { label: "Expired", color: "error" as const }
    }

    const diffMs = expiryDate.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) {
      return { label: `${diffMins}m remaining`, color: "warning" as const }
    }

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) {
      return { label: `${diffHours}h remaining`, color: "success" as const }
    }

    const diffDays = Math.floor(diffHours / 24)
    return { label: `${diffDays}d remaining`, color: "success" as const }
  }

  const getClicksForUrl = (urlId: string) => {
    return clickData.filter((click) => click.shortCodeId === urlId)
  }

  if (urls.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" component="h2" gutterBottom>
          URL Statistics
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {urls.map((url) => {
            const urlClicks = getClicksForUrl(url.id)
            const expiryStatus = formatExpiryStatus(url.expiryDate)

            return (
              <Accordion key={url.id}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", flexDirection: "column", flex: 1, mr: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontFamily: "monospace", color: "primary.main" }}>
                        /{url.shortCode}
                      </Typography>
                      <Chip label={expiryStatus.label} color={expiryStatus.color} size="small" />
                      {url.isCustomShortcode && <Chip label="Custom" color="primary" variant="outlined" size="small" />}
                    </Box>

                    <Typography variant="body2" color="text.secondary" noWrap>
                      {url.originalUrl}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Created: {formatDate(url.createdAt)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expires: {formatDate(url.expiryDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Clicks: {url.clickCount}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        URL Details
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
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

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Short URL:
                          </Typography>
                          <Typography sx={{ fontFamily: "monospace" }}>
                            {typeof window !== "undefined" ? window.location.origin : "localhost:3000"}/{url.shortCode}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Validity Period: {url.validityPeriod} minutes
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Click Analytics ({urlClicks.length} total clicks)
                      </Typography>

                      {urlClicks.length === 0 ? (
                        <Typography color="text.secondary">No clicks recorded for this URL yet.</Typography>
                      ) : (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>User Agent</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {urlClicks
                                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                                .map((click) => (
                                  <TableRow key={click.id}>
                                    <TableCell>{formatDate(click.timestamp)}</TableCell>
                                    <TableCell>{click.source || "Direct"}</TableCell>
                                    <TableCell>
                                      {click.geographicalLocation.country
                                        ? `${click.geographicalLocation.city || "Unknown"}, ${click.geographicalLocation.country}`
                                        : "Unknown"}
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 200 }}>
                                      <Typography variant="body2" noWrap title={click.userAgent}>
                                        {click.userAgent}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}
