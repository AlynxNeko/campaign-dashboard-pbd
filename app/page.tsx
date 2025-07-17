"use client"

import { useState } from "react"
import MarketingDashboard from "./marketing-dashboard"
import IntroScreen from "@/components/intro-screen" // Updated import path and name

export default function Page() {
  const [showDashboard, setShowDashboard] = useState(false)

  if (!showDashboard) {
    return <IntroScreen onFinish={() => setShowDashboard(true)} />
  }

  return <MarketingDashboard />
}
