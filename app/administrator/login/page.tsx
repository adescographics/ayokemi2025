"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

const validateInput = (input: string, maxLength: number): boolean => {
  return typeof input === "string" && input.trim().length > 0 && input.length <= maxLength
}

const generateSessionToken = (): string => {
  return btoa(Date.now().toString() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, "")
}

export default function AdminLogin() {
  const [step, setStep] = useState<"login" | "otp">("login")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuthenticated")
    const token = sessionStorage.getItem("adminAuthToken")

    if (isAuthenticated && token) {
      router.push("/administrator")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (
      !validateInput(formData.name, 100) ||
      !validateEmail(formData.email) ||
      !validateInput(formData.password, 100)
    ) {
      setError("Please enter valid information")
      setLoading(false)
      return
    }

    if (attempts >= 5) {
      setError("Too many attempts. Please wait before trying again.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStep("otp")
        setAttempts(0)
      } else {
        setError(data.message || "Login failed")
        setAttempts((prev) => prev + 1)
      }
    } catch (error) {
      setError("Network error. Please try again.")
      setAttempts((prev) => prev + 1)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        const sessionToken = generateSessionToken()
        sessionStorage.setItem("adminAuthenticated", "true")
        sessionStorage.setItem("adminEmail", formData.email)
        sessionStorage.setItem("adminLoginTime", Date.now().toString())
        sessionStorage.setItem("adminToken", sessionToken)
        sessionStorage.setItem("adminAuthToken", data.token)

        router.push("/administrator")
      } else {
        setError(data.message || "OTP verification failed")
        if (data.message?.includes("Too many")) {
          setStep("login") // Reset to login step if too many attempts
        }
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-mono tracking-widest uppercase mb-2">Admin Access</h1>
          <p className="text-gray-600 font-mono text-sm tracking-wider">
            {step === "login" ? "Enter your credentials" : "Enter verification code"}
          </p>
        </div>

        {step === "login" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-mono tracking-wider uppercase mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 100) })}
                className="w-full p-3 border-2 border-black font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter your name"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-mono tracking-wider uppercase mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.slice(0, 254) })}
                className="w-full p-3 border-2 border-black font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter admin email"
                maxLength={254}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-mono tracking-wider uppercase mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value.slice(0, 100) })}
                className="w-full p-3 border-2 border-black font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter admin password"
                maxLength={100}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-mono text-sm">{error}</div>
            )}

            {attempts >= 3 && (
              <div className="p-3 bg-yellow-100 border-2 border-yellow-500 text-yellow-700 font-mono text-sm">
                Multiple failed attempts detected. Please verify your credentials.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || attempts >= 5}
              className="w-full bg-black text-white p-3 font-mono tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/administrator/forgot-password")}
                className="text-sm font-mono tracking-wider text-gray-600 hover:text-black underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpVerification} className="space-y-6">
            <div>
              <label className="block text-sm font-mono tracking-wider uppercase mb-2">6-Digit OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full p-3 border-2 border-black font-mono tracking-widest text-center text-2xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-600 font-mono mt-2">Check your email: {formData.email}</p>
              <p className="text-xs text-gray-500 font-mono mt-1">Code expires in 5 minutes</p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-mono text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-black text-white p-3 font-mono tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("login")
                setOtp("")
                setError("")
              }}
              className="w-full border-2 border-black text-black p-3 font-mono tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
