"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle, X, Info } from "lucide-react"
import { trackClick } from "@/components/analytics-tracker"
import RateLimitModal from "@/components/rate-limit-modal"
import { checkClientRateLimit } from "@/lib/rate-limit-utils"
import { FormSkeleton } from "@/components/page-skeleton"

export default function RsvpPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [showRsvpModal, setShowRsvpModal] = useState(false)
  const [showInviteCodeInfo, setShowInviteCodeInfo] = useState(true)
  const [showRateLimitModal, setShowRateLimitModal] = useState(false)
  const [rateLimitResetTime, setRateLimitResetTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    email: "",
    guests: "1",
    attending: "",
    message: "",
    code: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackClick("rsvpButton")

    const rateLimitCheck = checkClientRateLimit("rsvp")
    if (!rateLimitCheck.allowed) {
      setRateLimitResetTime(rateLimitCheck.resetTime)
      setShowRateLimitModal(true)
      return
    }

    const invitationCode = process.env.NEXT_PUBLIC_INVITATION_CODE || "AYOKEMI25"
    if (rsvpForm.code !== invitationCode) {
      alert("Please enter the correct invitation code.")
      return
    }

    try {
      const response = await fetch("/api/send-rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rsvpForm),
      })

      if (response.status === 429) {
        const data = await response.json()
        setRateLimitResetTime(data.resetTime)
        setShowRateLimitModal(true)
        return
      }

      if (response.ok) {
        setShowRsvpModal(true)
        setRsvpForm({ name: "", email: "", guests: "1", attending: "", message: "", code: "" })
      } else {
        alert("Failed to send RSVP. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error)
      alert("Failed to send RSVP. Please try again.")
    }
  }

  if (isLoading) {
    return <FormSkeleton />
  }

  return (
    <>
      {showInviteCodeInfo && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInviteCodeInfo(false)} />
          <div className="relative bg-white border-2 border-black p-8 max-w-md w-full text-center">
            <button
              onClick={() => setShowInviteCodeInfo(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <Info className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h3 className="text-lg font-medium tracking-widest uppercase mb-4">INVITATION CODE</h3>
            <p className="text-sm font-mono tracking-wider text-gray-600 mb-4">Please note that the invite code is:</p>
            <div className="bg-gray-100 border-2 border-gray-300 p-4 mb-6">
              <span className="text-xl font-bold tracking-widest text-black">AYOKEMI25</span>
            </div>
            <p className="text-xs font-mono tracking-wider text-gray-500 mb-6">
              Please enter this code into the form when submitting your RSVP.
            </p>
            <Button
              onClick={() => setShowInviteCodeInfo(false)}
              className="bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-6 py-2"
            >
              GOT IT
            </Button>
          </div>
        </div>
      )}

      {showRsvpModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRsvpModal(false)} />
          <div className="relative bg-white border-2 border-black p-8 max-w-md w-full text-center">
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h3 className="text-lg font-medium tracking-widest uppercase mb-4">RSVP CONFIRMED!</h3>
            <p className="text-sm font-mono tracking-wider text-gray-600 mb-6">
              Thank you for your RSVP! We can't wait to celebrate with you on our special day.
            </p>
            <Button
              onClick={() => setShowRsvpModal(false)}
              className="bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-6 py-2"
            >
              CLOSE
            </Button>
          </div>
        </div>
      )}

      <RateLimitModal
        open={showRateLimitModal}
        onOpenChange={setShowRateLimitModal}
        type="rsvp"
        resetTime={rateLimitResetTime}
      />

      <section className="px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h2 className="text-lg md:text-xl font-medium tracking-widest uppercase mb-4">RSVP</h2>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500">
              Please confirm your attendance by December 1, 2025
            </p>
          </div>

          <form
            onSubmit={handleRsvpSubmit}
            className={`space-y-4 md:space-y-6 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs font-medium tracking-widest uppercase mb-2">FULL NAME *</label>
                <Input
                  type="text"
                  required
                  value={rsvpForm.name}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                  className="border-black text-xs font-mono tracking-wider"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-widest uppercase mb-2">EMAIL *</label>
                <Input
                  type="email"
                  required
                  value={rsvpForm.email}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                  className="border-black text-xs font-mono tracking-wider"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs font-medium tracking-widest uppercase mb-2">NUMBER OF GUESTS</label>
                <select
                  value={rsvpForm.guests}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                  className="w-full border-2 border-black px-3 py-2 text-xs font-mono tracking-wider bg-white"
                >
                  <option value="1">1 GUEST</option>
                  <option value="2">2 GUESTS</option>
                  <option value="3">3 GUESTS</option>
                  <option value="4">4 GUESTS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium tracking-widest uppercase mb-2">INVITATION CODE *</label>
                <Input
                  type="text"
                  required
                  placeholder="INVITATION CODE"
                  value={rsvpForm.code}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, code: e.target.value })}
                  className="border-black text-xs font-mono tracking-wider"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2">WILL YOU ATTEND? *</label>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    required
                    onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-xs font-mono tracking-wider">YES, I'LL BE THERE</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    required
                    onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-xs font-mono tracking-wider">SORRY, CAN'T MAKE IT</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2">MESSAGE (OPTIONAL)</label>
              <Textarea
                value={rsvpForm.message}
                onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                className="border-black text-xs font-mono tracking-wider"
                rows={4}
                placeholder="Any special requests or messages for the couple..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-6 py-3 transition-all duration-300 hover:scale-105"
            >
              <Send className="w-4 h-4 mr-2" />
              SEND RSVP
            </Button>
          </form>
        </div>
      </section>
    </>
  )
}
