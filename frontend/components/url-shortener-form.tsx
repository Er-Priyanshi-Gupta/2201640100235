"use client"

import { Card, CardContent, Typography, TextField, Button, Box, Grid, Alert, Chip, IconButton } from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import { useState } from "react"
import type { URLFormData, ShortenedURL } from "@/types/url-shortener"
import { validateUrl, validateShortcode } from "@/lib/validation"
import { generateShortCode, createShortenedUrl } from "@/lib/url-utils"
import { saveUrlsToStorage } from "@/lib/storage"
import { logger } from "@/lib/logger"

interface URLShortenerFormProps {
  onUrlsShortened: (urls: ShortenedURL[]) => void
}

export function URLShortenerForm({ onUrlsShortened }: URLShortenerFormProps) {
  const [urlForms, setUrlForms] = useState<URLFormData[]>([
    { originalUrl: "", validityPeriod: 30, customShortcode: "" },
  ])
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addUrlForm = () => {
    if (urlForms.length < 5) {
      setUrlForms([...urlForms, { originalUrl: "", validityPeriod: 30, customShortcode: "" }])
    }
  }

  const removeUrlForm = (index: number) => {
    if (urlForms.length > 1) {
      setUrlForms(urlForms.filter((_, i) => i !== index))
      setErrors(errors.filter((_, i) => i !== index))
    }
  }

  const updateUrlForm = (index: number, field: keyof URLFormData, value: string | number) => {
    const newForms = [...urlForms]
    newForms[index] = { ...newForms[index], [field]: value }
    setUrlForms(newForms)

    // Clear error for this form when user starts typing
    if (errors[index]) {
      const newErrors = [...errors]
      newErrors[index] = ""
      setErrors(newErrors)
    }
  }

  const validateForms = (): boolean => {
    const newErrors: string[] = []
    let isValid = true

    urlForms.forEach((form, index) => {
      let error = ""

      if (!form.originalUrl.trim()) {
        error = "URL is required"
        isValid = false
      } else if (!validateUrl(form.originalUrl)) {
        error = "Please enter a valid URL (must start with http:// or https://)"
        isValid = false
      } else if (form.validityPeriod < 1 || form.validityPeriod > 10080) {
        error = "Validity period must be between 1 and 10080 minutes (1 week)"
        isValid = false
      } else if (form.customShortcode && !validateShortcode(form.customShortcode)) {
        error = "Custom shortcode must be 3-10 alphanumeric characters"
        isValid = false
      }

      newErrors[index] = error
    })

    // Check for duplicate custom shortcodes
    const customCodes = urlForms.map((form) => form.customShortcode?.toLowerCase()).filter((code) => code)

    const duplicates = customCodes.filter((code, index) => customCodes.indexOf(code) !== index)

    if (duplicates.length > 0) {
      urlForms.forEach((form, index) => {
        if (form.customShortcode && duplicates.includes(form.customShortcode.toLowerCase())) {
          newErrors[index] = "Custom shortcode must be unique"
          isValid = false
        }
      })
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForms()) return

    setIsSubmitting(true)
    logger.info("Starting URL shortening process", "URLShortenerForm", {
      urlCount: urlForms.length,
      hasCustomCodes: urlForms.some((form) => form.customShortcode),
    })

    try {
      const shortenedUrls: ShortenedURL[] = []

      for (const form of urlForms) {
        const shortCode = form.customShortcode || generateShortCode()
        const shortenedUrl = createShortenedUrl(
          form.originalUrl,
          shortCode,
          form.validityPeriod,
          !!form.customShortcode,
        )
        shortenedUrls.push(shortenedUrl)
      }

      // Save to localStorage
      saveUrlsToStorage(shortenedUrls)

      logger.info("URLs shortened successfully", "URLShortenerForm", {
        count: shortenedUrls.length,
        shortCodes: shortenedUrls.map((url) => url.shortCode),
      })

      // Notify parent component
      onUrlsShortened(shortenedUrls)

      // Reset form
      setUrlForms([{ originalUrl: "", validityPeriod: 30, customShortcode: "" }])
      setErrors([])
    } catch (error) {
      logger.error("Error shortening URLs", "URLShortenerForm", {
        error: error instanceof Error ? error.message : String(error),
      })
      setErrors(["An error occurred while shortening URLs. Please try again."])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h2" component="h2">
            Shorten URLs
          </Typography>
          <Chip
            label={`${urlForms.length}/5 URLs`}
            color={urlForms.length === 5 ? "warning" : "primary"}
            variant="outlined"
          />
        </Box>

        {urlForms.map((form, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" component="h3">
                    URL #{index + 1}
                  </Typography>
                  {urlForms.length > 1 && (
                    <IconButton onClick={() => removeUrlForm(index)} color="error" size="small">
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Original URL"
                  placeholder="https://example.com/very-long-url"
                  value={form.originalUrl}
                  onChange={(e) => updateUrlForm(index, "originalUrl", e.target.value)}
                  error={!!errors[index] && errors[index].includes("URL")}
                  helperText={errors[index] && errors[index].includes("URL") ? errors[index] : ""}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Validity Period (minutes)"
                  type="number"
                  value={form.validityPeriod}
                  onChange={(e) => updateUrlForm(index, "validityPeriod", Number.parseInt(e.target.value) || 30)}
                  inputProps={{ min: 1, max: 10080 }}
                  error={!!errors[index] && errors[index].includes("Validity")}
                  helperText={
                    errors[index] && errors[index].includes("Validity") ? errors[index] : "Default: 30 minutes"
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Custom Shortcode (optional)"
                  placeholder="mycode123"
                  value={form.customShortcode}
                  onChange={(e) => updateUrlForm(index, "customShortcode", e.target.value)}
                  error={!!errors[index] && errors[index].includes("shortcode")}
                  helperText={
                    errors[index] && errors[index].includes("shortcode")
                      ? errors[index]
                      : "3-10 alphanumeric characters"
                  }
                />
              </Grid>
            </Grid>
          </Card>
        ))}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" startIcon={<Add />} onClick={addUrlForm} disabled={urlForms.length >= 5}>
            Add Another URL ({urlForms.length}/5)
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || urlForms.some((form) => !form.originalUrl.trim())}
            size="large"
          >
            {isSubmitting ? "Shortening..." : "Shorten URLs"}
          </Button>
        </Box>

        {errors.some(
          (error) => error && !error.includes("URL") && !error.includes("Validity") && !error.includes("shortcode"),
        ) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.find(
              (error) => error && !error.includes("URL") && !error.includes("Validity") && !error.includes("shortcode"),
            )}
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
