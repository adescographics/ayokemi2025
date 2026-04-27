"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        const page = pathname === "/" ? "home" : pathname.replace("/", "")

        const token = sessionStorage.getItem("adminAuthToken")

        if (!token) {
          console.log("[Ayokemi2025] Analytics tracking skipped - no auth token")
          return
        }

        await fetch("/api/admin/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: "pageView",
            data: { page },
          }),
        })
      } catch (error) {
        console.error("[Ayokemi2025] Analytics tracking error:", error)
      }
    }

    trackPageView()
  }, [pathname])

  return null
}

// Helper function to track clicks
export const trackClick = async (element: string) => {
  try {
    const token = sessionStorage.getItem("adminAuthToken")

    if (!token) {
      console.log("[Ayokemi2025] Click tracking skipped - no auth token")
      return
    }

    await fetch("/api/admin/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: "click",
        data: { element },
      }),
    })
  } catch (error) {
    console.error("[Ayokemi2025] Click tracking error:", error)
  }
}
