"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface AnalyticsData {
  pageViews: {
    total: number
    home: number
    rsvp: number
    wishes: number
    gallery: number
    "surprise-message": number
    sitemap: number
    daily: Record<string, number>
  }
  submissions: {
    rsvp: {
      total: number
      attending: number
      notAttending: number
      totalGuests: number
    }
    wishes: {
      total: number
    }
  }
  clicks: {
    rsvpButton: number
    wishesButton: number
    galleryImages: number
    socialLinks: number
  }
  hourlyTraffic: number[]
  lastUpdated: string
}

const COLORS = ["#000000", "#666666", "#999999", "#CCCCCC", "#E5E5E5"]

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuthAndFetchAnalytics = async () => {
      try {
        const token = sessionStorage.getItem("adminAuthToken")
        if (!token) {
          router.push("/administrator/login")
          return
        }

        const response = await fetch("/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })

        if (response.status === 401) {
          sessionStorage.removeItem("adminAuthToken")
          router.push("/administrator/login")
          return
        }

        if (response.ok) {
          const data = await response.json()
          console.log("[Ayokemi2025] Analytics data loaded:", data)
          setAnalytics(data)
          setIsAuthorized(true)
        }
      } catch (error) {
        console.error("[Ayokemi2025] Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchAnalytics()

    // Auto-refresh analytics every 30 seconds
    const interval = setInterval(checkAuthAndFetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [router])

  if (!isAuthorized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono tracking-wider">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono tracking-wider">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  const pageViewsData = Object.entries(analytics.pageViews.daily || {}).map(([date, views]) => ({
    date,
    views,
  }))

  const hourlyTrafficData = analytics.hourlyTraffic.map((views, hour) => ({
    hour: `${hour}:00`,
    views,
  }))

  const topPages = [
    { page: "Home", views: analytics.pageViews.home },
    { page: "RSVP", views: analytics.pageViews.rsvp },
    { page: "Wishes", views: analytics.pageViews.wishes },
    { page: "Gallery", views: analytics.pageViews.gallery },
    { page: "Surprise Message", views: analytics.pageViews["surprise-message"] },
  ]
    .filter((p) => p.views > 0)
    .sort((a, b) => b.views - a.views)

  const rsvpStatusData = [
    { status: "Attending", count: analytics.submissions.rsvp.attending },
    { status: "Not Attending", count: analytics.submissions.rsvp.notAttending },
  ].filter((r) => r.count > 0)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-medium tracking-widest uppercase mb-2">Analytics Dashboard</h1>
        <p className="text-sm font-mono tracking-wider text-gray-600">Real-time website statistics and insights</p>
        <p className="text-xs font-mono tracking-wider text-gray-500 mt-2">
          Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="p-6 border-2 border-gray-300">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">Total Page Views</p>
          <p className="text-3xl font-medium tracking-widest">{analytics.pageViews.total}</p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">Total Submissions</p>
          <p className="text-3xl font-medium tracking-widest">{analytics.submissions.rsvp.total}</p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">RSVP - Yes</p>
          <p className="text-3xl font-medium tracking-widest text-green-600">{analytics.submissions.rsvp.attending}</p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">Total Guests</p>
          <p className="text-3xl font-medium tracking-widest">{analytics.submissions.rsvp.totalGuests}</p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">Wishes Received</p>
          <p className="text-3xl font-medium tracking-widest">{analytics.submissions.wishes.total}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Page Views Over Time */}
        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-lg font-medium tracking-widest uppercase mb-4">Page Views by Day</h2>
          {pageViewsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pageViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#000000" name="Views" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">No page view data yet</p>
          )}
        </Card>

        {/* Traffic by Hour */}
        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-lg font-medium tracking-widest uppercase mb-4">Traffic by Hour</h2>
          {hourlyTrafficData.some((h) => h.views > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyTrafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#000000" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">No hourly traffic data yet</p>
          )}
        </Card>
      </div>

      {/* Top Pages and RSVP Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-lg font-medium tracking-widest uppercase mb-4">Page Views by Section</h2>
          <div className="space-y-3">
            {topPages.length > 0 ? (
              topPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <p className="text-sm font-mono tracking-wider">{page.page}</p>
                  <p className="text-sm font-medium">{page.views}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No page views yet</p>
            )}
          </div>
        </Card>

        {/* RSVP Status Distribution */}
        <Card className="p-6 border-2 border-gray-300">
          <h2 className="text-lg font-medium tracking-widest uppercase mb-4">RSVP Status</h2>
          {rsvpStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={rsvpStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#000000"
                  dataKey="count"
                >
                  {rsvpStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">No RSVP data yet</p>
          )}
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card className="p-6 border-2 border-gray-300">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">RSVP - No</p>
          <p className="text-3xl font-medium tracking-widest text-red-600">{analytics.submissions.rsvp.notAttending}</p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">RSVP Button Clicks</p>
          <p className="text-3xl font-medium tracking-widest">{analytics.clicks.rsvpButton}</p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">Wishes Button Clicks</p>
          <p className="text-3xl font-medium tracking-widest">{analytics.clicks.wishesButton}</p>
        </Card>

        <Card className="p-6 border-2 border-gray-300">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">Gallery Views</p>
          <p className="text-3xl font-medium tracking-widest">{analytics.pageViews.gallery}</p>
        </Card>
      </div>
    </div>
  )
}
