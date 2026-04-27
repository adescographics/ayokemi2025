import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

const ANALYTICS_FILE = path.join(process.cwd(), "analytics-data.json")

const getInitialAnalyticsData = () => {
  const now = new Date()
  const today = now.toISOString().split("T")[0]

  return {
    pageViews: {
      total: 0,
      home: 0,
      rsvp: 0,
      wishes: 0,
      gallery: 0,
      "surprise-message": 0,
      sitemap: 0,
      daily: {
        [today]: 0,
      },
    },
    submissions: {
      rsvp: {
        total: 0,
        attending: 0,
        notAttending: 0,
        totalGuests: 0,
      },
      wishes: {
        total: 0,
      },
    },
    clicks: {
      rsvpButton: 0,
      wishesButton: 0,
      galleryImages: 0,
      socialLinks: 0,
    },
    hourlyTraffic: Array(24).fill(0),
    lastUpdated: now.toISOString(),
  }
}

const readAnalyticsData = () => {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const data = fs.readFileSync(ANALYTICS_FILE, "utf8")
      const parsedData = JSON.parse(data)
      console.log("[v0] Analytics data loaded from file:", {
        totalViews: parsedData.pageViews?.total || 0,
        totalRSVPs: parsedData.submissions?.rsvp?.total || 0,
        lastUpdated: parsedData.lastUpdated,
      })
      return parsedData
    }
  } catch (error) {
    console.error("[v0] Error reading analytics file:", error)
  }

  console.log("[v0] Creating new analytics data file with zeros")
  const initialData = getInitialAnalyticsData()
  writeAnalyticsData(initialData)
  return initialData
}

const writeAnalyticsData = (data: any) => {
  try {
    data.lastUpdated = new Date().toISOString()
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2))
    console.log("[v0] Analytics data saved successfully at:", data.lastUpdated)
  } catch (error) {
    console.error("[v0] Error writing analytics file:", error)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("[v0] Analytics API called:", req.method, new Date().toISOString())

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[v0] Analytics API: Unauthorized access attempt - missing or invalid auth header")
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.replace("Bearer ", "")

  const { verifyAuthToken } = await import("@/lib/auth-utils")
  const verified = await verifyAuthToken(token)

  if (!verified) {
    console.log("[v0] Analytics API: Unauthorized access attempt - invalid token")
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (req.method === "GET") {
    try {
      const analyticsData = readAnalyticsData()

      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
      res.setHeader("Pragma", "no-cache")
      res.setHeader("Expires", "0")

      console.log("[v0] Returning analytics data:", {
        totalViews: analyticsData.pageViews?.total || 0,
        totalRSVPs: analyticsData.submissions?.rsvp?.total || 0,
      })

      res.status(200).json(analyticsData)
    } catch (error) {
      console.error("[v0] Error reading analytics:", error)
      res.status(500).json({ message: "Failed to load analytics" })
    }
  } else if (req.method === "POST") {
    try {
      const { type, data } = req.body
      console.log("[v0] Analytics update request:", type, data)

      const analyticsData = readAnalyticsData()

      switch (type) {
        case "pageView":
          const today = new Date().toISOString().split("T")[0]
          const hour = new Date().getHours()

          if (!analyticsData.pageViews) {
            analyticsData.pageViews = {
              total: 0,
              home: 0,
              rsvp: 0,
              wishes: 0,
              gallery: 0,
              "surprise-message": 0,
              sitemap: 0,
              daily: {},
            }
          }

          analyticsData.pageViews.total = (analyticsData.pageViews.total || 0) + 1

          const pageName = data.page as keyof typeof analyticsData.pageViews
          if (typeof analyticsData.pageViews[pageName] === "number") {
            analyticsData.pageViews[pageName] = (analyticsData.pageViews[pageName] as number) + 1
          } else {
            analyticsData.pageViews[pageName] = 1 as any
          }

          if (!analyticsData.pageViews.daily) {
            analyticsData.pageViews.daily = {}
          }
          analyticsData.pageViews.daily[today] = (analyticsData.pageViews.daily[today] || 0) + 1

          if (!Array.isArray(analyticsData.hourlyTraffic) || analyticsData.hourlyTraffic.length !== 24) {
            analyticsData.hourlyTraffic = Array(24).fill(0)
          }
          analyticsData.hourlyTraffic[hour] = (analyticsData.hourlyTraffic[hour] || 0) + 1

          console.log("[v0] Page view tracked:", {
            page: pageName,
            total: analyticsData.pageViews.total,
            pageTotal: analyticsData.pageViews[pageName],
          })
          break

        case "click":
          if (!analyticsData.clicks) {
            analyticsData.clicks = {
              rsvpButton: 0,
              wishesButton: 0,
              galleryImages: 0,
              socialLinks: 0,
            }
          }
          const elementName = data.element as keyof typeof analyticsData.clicks
          analyticsData.clicks[elementName] = (analyticsData.clicks[elementName] || 0) + 1
          console.log("[v0] Click tracked:", elementName, analyticsData.clicks[elementName])
          break

        case "rsvpSubmission":
          if (!analyticsData.submissions) {
            analyticsData.submissions = {
              rsvp: { total: 0, attending: 0, notAttending: 0, totalGuests: 0 },
              wishes: { total: 0 },
            }
          }
          if (!analyticsData.submissions.rsvp) {
            analyticsData.submissions.rsvp = { total: 0, attending: 0, notAttending: 0, totalGuests: 0 }
          }

          analyticsData.submissions.rsvp.total = (analyticsData.submissions.rsvp.total || 0) + 1
          if (data.attending === "yes") {
            analyticsData.submissions.rsvp.attending = (analyticsData.submissions.rsvp.attending || 0) + 1
            analyticsData.submissions.rsvp.totalGuests =
              (analyticsData.submissions.rsvp.totalGuests || 0) + (Number(data.guests) || 1)
          } else {
            analyticsData.submissions.rsvp.notAttending = (analyticsData.submissions.rsvp.notAttending || 0) + 1
          }
          console.log("[v0] RSVP submission tracked:", analyticsData.submissions.rsvp)
          break

        case "wishSubmission":
          if (!analyticsData.submissions) {
            analyticsData.submissions = {
              rsvp: { total: 0, attending: 0, notAttending: 0, totalGuests: 0 },
              wishes: { total: 0 },
            }
          }
          if (!analyticsData.submissions.wishes) {
            analyticsData.submissions.wishes = { total: 0 }
          }

          analyticsData.submissions.wishes.total = (analyticsData.submissions.wishes.total || 0) + 1
          console.log("[v0] Wish submission tracked:", analyticsData.submissions.wishes.total)
          break
      }

      writeAnalyticsData(analyticsData)

      console.log("[v0] Analytics updated and saved successfully")

      res.status(200).json(analyticsData)
    } catch (error) {
      console.error("[v0] Error updating analytics:", error)
      res.status(500).json({ message: "Failed to update analytics" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
