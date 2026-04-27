export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 60 minutes
const MAX_SUBMISSIONS = 3

// Server-side rate limiting using in-memory store
const rateLimitStore = new Map<
  string,
  {
    count: number
    resetTime: number
  }
>()

export function checkRateLimit(identifier: string, type: "rsvp" | "wish"): RateLimitResult {
  const key = `${type}-${identifier}`
  const now = Date.now()

  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // Create new record
    const resetTime = now + RATE_LIMIT_WINDOW
    rateLimitStore.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: MAX_SUBMISSIONS - 1, resetTime }
  }

  if (record.count >= MAX_SUBMISSIONS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  // Increment count
  record.count++
  return { allowed: true, remaining: MAX_SUBMISSIONS - record.count, resetTime: record.resetTime }
}

// Clean up expired entries every hour
setInterval(
  () => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  },
  60 * 60 * 1000,
)

// Client-side rate limit checking
export function checkClientRateLimit(type: "rsvp" | "wish"): RateLimitResult {
  const key = `rateLimit_${type}`
  const stored = localStorage.getItem(key)

  const now = Date.now()

  if (!stored) {
    const resetTime = now + RATE_LIMIT_WINDOW
    const data = { count: 1, resetTime }
    localStorage.setItem(key, JSON.stringify(data))
    return { allowed: true, remaining: MAX_SUBMISSIONS - 1, resetTime }
  }

  const data = JSON.parse(stored)

  if (now > data.resetTime) {
    // Reset the limit
    const resetTime = now + RATE_LIMIT_WINDOW
    const newData = { count: 1, resetTime }
    localStorage.setItem(key, JSON.stringify(newData))
    return { allowed: true, remaining: MAX_SUBMISSIONS - 1, resetTime }
  }

  if (data.count >= MAX_SUBMISSIONS) {
    return { allowed: false, remaining: 0, resetTime: data.resetTime }
  }

  // Increment count
  data.count++
  localStorage.setItem(key, JSON.stringify(data))
  return { allowed: true, remaining: MAX_SUBMISSIONS - data.count, resetTime: data.resetTime }
}

export function formatTimeRemaining(resetTime: number): string {
  const now = Date.now()
  const diff = resetTime - now

  if (diff <= 0) return "now"

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""}`
  }

  return `${minutes} minute${minutes !== 1 ? "s" : ""}`
}
