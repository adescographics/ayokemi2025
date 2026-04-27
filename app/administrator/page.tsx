"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, Clock, LogOut, Mail, CheckCircle, XCircle, Calendar, RefreshCw } from "lucide-react"
import SessionManager from "@/components/session-manager"

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

export default function AdministratorPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [submissions, setSubmissions] = useState<SubmissionsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const loadSubmissions = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true)
      try {
        const token = sessionStorage.getItem("adminAuthToken")

        if (!token) {
          console.error("[Ayokemi2025] No auth token found")
          router.push("/administrator/login")
          return
        }

        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/admin/submissions?t=${timestamp}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
          cache: "no-store",
        })

        if (response.ok) {
          const data: SubmissionsData = await response.json()
          setSubmissions(data)
          setLastRefresh(new Date())
          setError("")
        } else if (response.status === 401) {
          console.error("[Ayokemi2025] Unauthorized - redirecting to login")
          sessionStorage.removeItem("adminAuthToken")
          sessionStorage.removeItem("adminAuthenticated")
          router.push("/administrator/login")
        } else {
          const errorText = await response.text()
          console.error("[Ayokemi2025] API error:", response.status, errorText)
          setError(`Failed to load data (${response.status})`)
        }
      } catch (error) {
        console.error("[Ayokemi2025] Network error:", error)
        setError("Network error - check your connection")
      } finally {
        if (showLoading) setLoading(false)
      }
    },
    [router],
  )

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuthenticated")
    if (!isAuthenticated) {
      router.push("/administrator/login")
      return
    }

    loadSubmissions(true)

    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [router, loadSubmissions])

  useEffect(() => {
    if (!autoRefresh) {
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
      return
    }

    const interval = setInterval(() => {
      loadSubmissions(false)
    }, 2000)

    setRefreshInterval(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, loadSubmissions])

  const handleManualRefresh = () => {
    loadSubmissions(false)
  }

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  const handleLogout = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    sessionStorage.removeItem("adminAuthenticated")
    sessionStorage.removeItem("adminEmail")
    sessionStorage.removeItem("adminAuthToken")
    router.push("/administrator/login")
  }

  const handleSessionTimeout = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    alert("Your session has expired due to inactivity. You will be redirected to the login page.")
    router.push("/administrator/login")
  }

  const stats = submissions?.stats || {
    totalRSVPs: 0,
    attendingYes: 0,
    attendingNo: 0,
    totalGuests: 0,
    totalWishes: 0,
  }

  const attendanceRate = stats.totalRSVPs > 0 ? Math.round((stats.attendingYes / stats.totalRSVPs) * 100) : 0

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div
      className={`min-h-screen bg-background font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <SessionManager timeoutMinutes={60} onTimeout={handleSessionTimeout} />

      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div
            className={`transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-medium tracking-widest uppercase mb-2">Wedding Dashboard</h1>
                <p className="text-sm font-mono tracking-wider text-muted-foreground">Ayo & Kemi - December 20, 2025</p>
              </div>
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                <div className="flex items-center space-x-4 border-2 border-gray-200 px-4 py-2 bg-white">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${autoRefresh ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                    ></div>
                    <span className="text-sm font-medium tracking-widest uppercase">
                      {autoRefresh ? "LIVE" : "PAUSED"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleManualRefresh}
                      className="text-xs font-mono tracking-wider uppercase px-2 py-1 border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-1"
                      disabled={loading}
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                      {loading ? "REFRESHING..." : "REFRESH"}
                    </button>
                    <button
                      onClick={toggleAutoRefresh}
                      className={`text-xs font-mono tracking-wider uppercase px-2 py-1 border transition-colors ${
                        autoRefresh
                          ? "border-red-300 text-red-600 hover:bg-red-50"
                          : "border-green-300 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {autoRefresh ? "PAUSE" : "START"}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-mono tracking-wider uppercase text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 text-red-700 text-sm font-mono">{error}</div>
        )}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium tracking-widest uppercase">Total RSVPs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{stats.totalRSVPs}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-xs font-mono">
                  {attendanceRate}% Attending
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium tracking-widest uppercase">Attending</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-green-600">{stats.attendingYes}</div>
              <p className="text-xs text-muted-foreground font-mono mt-2">{stats.totalGuests} total guests</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium tracking-widest uppercase">Not Attending</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-red-600">{stats.attendingNo}</div>
              <p className="text-xs text-muted-foreground font-mono mt-2">Declined invitations</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium tracking-widest uppercase">Wishes Received</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{stats.totalWishes}</div>
              <p className="text-xs text-muted-foreground font-mono mt-2">Messages received</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card
            className={`border-2 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium tracking-widest uppercase">Recent RSVPs</CardTitle>
              <CardDescription className="font-mono text-xs tracking-wider">
                Latest RSVP submissions from guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {submissions?.rsvps && submissions.rsvps.length > 0 ? (
                  submissions.rsvps.slice(0, 10).map((rsvp) => (
                    <div key={rsvp.id} className="border-2 p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium tracking-wider uppercase text-sm">{rsvp.name}</h3>
                            <Badge
                              variant={rsvp.attending === "yes" ? "default" : "secondary"}
                              className="text-xs font-mono"
                            >
                              {rsvp.attending === "yes" ? "ATTENDING" : "NOT ATTENDING"}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground font-mono">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{rsvp.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>
                                {rsvp.guests} guest{rsvp.guests > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground font-mono">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(rsvp.timestamp)}</span>
                        </div>
                      </div>
                      {rsvp.message && (
                        <div className="mt-2 p-2 bg-gray-100 border-l-2 border-gray-400 text-xs font-mono">
                          {rsvp.message}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground font-mono text-sm">
                    No RSVP submissions yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-2 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium tracking-widest uppercase">Recent Wishes</CardTitle>
              <CardDescription className="font-mono text-xs tracking-wider">
                Latest wishes and prayers from guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {submissions?.wishes && submissions.wishes.length > 0 ? (
                  submissions.wishes.slice(0, 10).map((wish) => (
                    <div key={wish.id} className="border-2 p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium tracking-wider uppercase text-sm">{wish.name}</h3>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground font-mono">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(wish.timestamp)}</span>
                        </div>
                      </div>
                      <div className="mt-2 p-3 bg-gray-100 border-l-2 border-gray-400 text-xs font-mono leading-relaxed">
                        {wish.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground font-mono text-sm">
                    No wishes submitted yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-sm font-medium tracking-widest uppercase">RSVP Progress</CardTitle>
              <CardDescription className="font-mono text-xs tracking-wider">Target: 250 guests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono">{Math.round((stats.totalRSVPs / 250) * 100)}%</div>
                <p className="text-xs text-muted-foreground font-mono">{stats.totalRSVPs} of 250</p>
              </div>
              <Progress value={(stats.totalRSVPs / 250) * 100} className="h-3" />
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-sm font-medium tracking-widest uppercase">Guest Count</CardTitle>
              <CardDescription className="font-mono text-xs tracking-wider">Total attending guests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono">{stats.totalGuests}</div>
                <p className="text-xs text-muted-foreground font-mono">Confirmed guests</p>
              </div>
              <Progress value={Math.min((stats.totalGuests / 300) * 100, 100)} className="h-3" />
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-sm font-medium tracking-widest uppercase">Days Until Wedding</CardTitle>
              <CardDescription className="font-mono text-xs tracking-wider">December 20, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono">
                  {Math.ceil((new Date("2025-12-20").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <p className="text-xs text-muted-foreground font-mono">Days remaining</p>
              </div>
              <Progress value={85} className="h-3" />
            </CardContent>
          </Card>
        </div>

        <Card
          className={`border-2 mt-8 transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-medium tracking-widest uppercase">System Status</CardTitle>
            <CardDescription className="font-mono text-xs tracking-wider">
              Real-time submission tracking - Updates every 2 seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${autoRefresh ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                ></div>
                <span className="font-mono text-sm tracking-wider">
                  {autoRefresh ? "Dashboard Active - Auto-refresh every 2s" : "Dashboard Paused"}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground font-mono">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
