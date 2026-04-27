import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

const SUBMISSIONS_FILE = path.join(process.cwd(), "submissions-data.json")

interface RSVPSubmission {
  id: string
  type: "rsvp"
  name: string
  email: string
  guests: number
  attending: string
  message?: string
  timestamp: string
}

interface WishSubmission {
  id: string
  type: "wish"
  name: string
  message: string
  timestamp: string
}

type Submission = RSVPSubmission | WishSubmission

interface SubmissionsData {
  rsvps: RSVPSubmission[]
  wishes: WishSubmission[]
  stats: {
    totalRSVPs: number
    attendingYes: number
    attendingNo: number
    totalGuests: number
    totalWishes: number
  }
}

const getInitialData = (): SubmissionsData => ({
  rsvps: [],
  wishes: [],
  stats: {
    totalRSVPs: 0,
    attendingYes: 0,
    attendingNo: 0,
    totalGuests: 0,
    totalWishes: 0,
  },
})

const readSubmissions = (): SubmissionsData => {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("[v0] Error reading submissions:", error)
  }
  return getInitialData()
}

const writeSubmissions = (data: SubmissionsData): void => {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("[v0] Error writing submissions:", error)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.replace("Bearer ", "")

  const { verifyAuthToken } = await import("@/lib/auth-utils")
  const verified = await verifyAuthToken(token)

  if (!verified) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (req.method === "GET") {
    // Get all submissions
    const data = readSubmissions()

    // Set aggressive cache control headers
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    res.setHeader("Pragma", "no-cache")
    res.setHeader("Expires", "0")

    return res.status(200).json(data)
  }

  if (req.method === "POST") {
    // Add new submission
    const { type, data: submissionData } = req.body

    if (!type || !submissionData) {
      return res.status(400).json({ message: "Invalid request" })
    }

    const submissions = readSubmissions()
    const timestamp = new Date().toISOString()
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    if (type === "rsvp") {
      const rsvp: RSVPSubmission = {
        id,
        type: "rsvp",
        name: submissionData.name,
        email: submissionData.email,
        guests: submissionData.guests,
        attending: submissionData.attending,
        message: submissionData.message,
        timestamp,
      }

      submissions.rsvps.unshift(rsvp) // Add to beginning
      submissions.stats.totalRSVPs++
      submissions.stats.totalGuests += submissionData.guests

      if (submissionData.attending === "yes") {
        submissions.stats.attendingYes++
      } else {
        submissions.stats.attendingNo++
      }
    } else if (type === "wish") {
      const wish: WishSubmission = {
        id,
        type: "wish",
        name: submissionData.name,
        message: submissionData.message,
        timestamp,
      }

      submissions.wishes.unshift(wish) // Add to beginning
      submissions.stats.totalWishes++
    }

    writeSubmissions(submissions)

    return res.status(200).json({ message: "Submission recorded", id })
  }

  return res.status(405).json({ message: "Method not allowed" })
}
