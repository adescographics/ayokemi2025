"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface SessionManagerProps {
  timeoutMinutes?: number
  onTimeout?: () => void
}

const generateSessionToken = (): string => {
  return btoa(Date.now().toString() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, "")
}

const isValidSession = (): boolean => {
  const token = sessionStorage.getItem("adminToken")
  const loginTime = sessionStorage.getItem("adminLoginTime")
  const email = sessionStorage.getItem("adminEmail")

  if (!token || !loginTime || !email) {
    return false
  }

  // Check if session is older than 2 hours
  const maxAge = 2 * 60 * 60 * 1000 // 2 hours
  const sessionAge = Date.now() - Number.parseInt(loginTime)

  return sessionAge < maxAge
}

export default function SessionManager({ timeoutMinutes = 30, onTimeout }: SessionManagerProps) {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())
  const [isClient, setIsClient] = useState(false)

  const clearSession = () => {
    sessionStorage.removeItem("adminAuthenticated")
    sessionStorage.removeItem("adminEmail")
    sessionStorage.removeItem("adminLoginTime")
    sessionStorage.removeItem("adminToken")
  }

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    lastActivityRef.current = Date.now()

    timeoutRef.current = setTimeout(
      () => {
        clearSession()

        // Call custom timeout handler if provided
        if (onTimeout) {
          onTimeout()
        } else {
          // Default: redirect to login
          router.push("/administrator/login")
        }
      },
      timeoutMinutes * 60 * 1000,
    )
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    if (!isValidSession()) {
      clearSession()
      router.push("/administrator/login")
      return
    }

    // Generate session token if not exists
    if (!sessionStorage.getItem("adminToken")) {
      sessionStorage.setItem("adminToken", generateSessionToken())
    }

    // Set initial login time if not exists
    const loginTime = sessionStorage.getItem("adminLoginTime")
    if (!loginTime) {
      sessionStorage.setItem("adminLoginTime", Date.now().toString())
    }

    // Start timeout
    resetTimeout()

    // Activity event listeners
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    const handleActivity = () => {
      if (isValidSession()) {
        resetTimeout()
      } else {
        clearSession()
        router.push("/administrator/login")
      }
    }

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    // Periodic session validation
    const validationInterval = setInterval(
      () => {
        if (!isValidSession()) {
          clearSession()
          router.push("/administrator/login")
        }
      },
      5 * 60 * 1000,
    ) // Check every 5 minutes

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      clearInterval(validationInterval)
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [timeoutMinutes, onTimeout, router, isClient])

  return null // This component doesn't render anything
}
