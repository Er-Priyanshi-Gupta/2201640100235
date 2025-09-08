import type React from "react"
import type { Metadata } from "next"
import { MaterialUIProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "URL Shortener App",
  description: "A React URL shortener with analytics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <MaterialUIProvider>{children}</MaterialUIProvider>
      </body>
    </html>
  )
}
