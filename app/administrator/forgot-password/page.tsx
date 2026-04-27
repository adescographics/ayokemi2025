"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

const validateInput = (input: string, maxLength: number): boolean => {
  return typeof input === "string" && input.trim().length > 0 && input.length <= maxLength
}

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Password reset code sent to your email")
        setStep("otp")
      } else {
        setError(data.message || "Failed to send reset code")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit code")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep("reset")
      } else {
        setError(data.message || "Invalid or expired code")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!validateInput(newPassword, 100)) {
      setError("Password is required")
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Password reset successfully! Redirecting to login...")
        setTimeout(() => {
          router.push("/administrator/login")
        }, 2000)
      } else {
        setError(data.message || "Failed to reset password")
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
          <h1 className="text-2xl font-mono tracking-widest uppercase mb-2">Reset Password</h1>
          <p className="text-gray-600 font-mono text-sm tracking-wider">
            {step === "email" && "Enter your admin email"}
            {step === "otp" && "Enter verification code"}
            {step === "reset" && "Create new password"}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div>
              <label className="block text-sm font-mono tracking-wider uppercase mb-2">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.slice(0, 254))}
                className="w-full p-3 border-2 border-black font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter your admin email"
                maxLength={254}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-mono text-sm">{error}</div>
            )}

            {success && (
              <div className="p-3 bg-green-100 border-2 border-green-500 text-green-700 font-mono text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-3 font-mono tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/administrator/login")}
              className="w-full border-2 border-black text-black p-3 font-mono tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-mono tracking-wider uppercase mb-2">6-Digit Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full p-3 border-2 border-black font-mono tracking-widest text-center text-2xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-600 font-mono mt-2">Check your email: {email}</p>
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
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email")
                setOtp("")
                setError("")
              }}
              className="w-full border-2 border-black text-black p-3 font-mono tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-mono tracking-wider uppercase mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value.slice(0, 100))}
                className="w-full p-3 border-2 border-black font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter new password"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 font-mono mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-mono tracking-wider uppercase mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.slice(0, 100))}
                className="w-full p-3 border-2 border-black font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Confirm new password"
                maxLength={100}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-mono text-sm">{error}</div>
            )}

            {success && (
              <div className="p-3 bg-green-100 border-2 border-green-500 text-green-700 font-mono text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-3 font-mono tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
