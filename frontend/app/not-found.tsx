"use client"

import { Container, Typography, Box, Card, CardContent, Button } from "@mui/material"
import { Home } from "@mui/icons-material"
import Link from "next/link"

export default function NotFound() {
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
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h1" component="h1" gutterBottom>
                404
              </Typography>
              <Typography variant="h4" gutterBottom>
                Page Not Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                The page you are looking for does not exist.
              </Typography>

              <Button variant="contained" component={Link} href="/" startIcon={<Home />} size="large">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </div>
  )
}
