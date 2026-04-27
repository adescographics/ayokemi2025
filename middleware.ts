import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMITS = {
  "/api/admin/login": { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  "/api/admin/verify-otp": { requests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  "/api/send-rsvp": { requests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour
  "/api/send-wishes": { requests: 5, windowMs: 60 * 60 * 1000 }, // 5 requests per hour
}

function getRateLimitKey(ip: string, pathname: string): string {
  return `${ip}:${pathname}`
}

function isRateLimited(key: string, limit: { requests: number; windowMs: number }): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + limit.windowMs,
    })
    return false
  }

  if (record.count >= limit.requests) {
    return true
  }

  record.count++
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  // Apply rate limiting to specific endpoints
  const rateLimit = RATE_LIMITS[pathname as keyof typeof RATE_LIMITS]
  if (rateLimit) {
    const key = getRateLimitKey(ip, pathname)

    if (isRateLimited(key, rateLimit)) {
      return NextResponse.json(
        {
          message: "Too many requests. Please try again later.",
          retryAfter: Math.ceil(rateLimit.windowMs / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.windowMs / 1000).toString(),
            "X-RateLimit-Limit": rateLimit.requests.toString(),
            "X-RateLimit-Remaining": "0",
          },
        },
      )
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()

  // Additional security headers
  response.headers.set("X-DNS-Prefetch-Control", "off")
  response.headers.set("X-Download-Options", "noopen")
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none")

  return response
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/send-rsvp", "/api/send-wishes"],
}
