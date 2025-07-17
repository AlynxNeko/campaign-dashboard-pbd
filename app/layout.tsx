import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google" // Import Inter font

// Configure Inter font with subsets
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Apply the font variable to the body */}
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  )
}
