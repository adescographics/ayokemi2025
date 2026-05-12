"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Heart, X } from "lucide-react"
import Link from "next/link"
import { trackClick } from "@/components/analytics-tracker"
import RateLimitModal from "@/components/rate-limit-modal"
import { checkClientRateLimit } from "@/lib/rate-limit-utils"
import { FormSkeleton } from "@/components/page-skeleton"
import { useLanguage } from "@/hooks/use-language"

export default function WishesPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showWishModal, setShowWishModal] = useState(false)
  const [showRateLimitModal, setShowRateLimitModal] = useState(false)
  const [rateLimitResetTime, setRateLimitResetTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()
  const [wishForm, setWishForm] = useState({
    name: "",
    message: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackClick("wishesButton")

    const rateLimitCheck = checkClientRateLimit("wish")
    if (!rateLimitCheck.allowed) {
      setRateLimitResetTime(rateLimitCheck.resetTime)
      setShowRateLimitModal(true)
      return
    }

    try {
      const response = await fetch("/api/send-wishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wishForm),
      })

      if (response.status === 429) {
        const data = await response.json()
        setRateLimitResetTime(data.resetTime)
        setShowRateLimitModal(true)
        return
      }

      if (response.ok) {
        setShowWishModal(true)
        setWishForm({ name: "", message: "" })
      } else {
        alert(t("common.error"))
      }
    } catch (error) {
      console.error("Error submitting wishes:", error)
      alert(t("common.error"))
    }
  }

  if (isLoading) {
    return <FormSkeleton />
  }

  return (
    <div
      className={`min-h-screen bg-white text-black font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative h-full flex flex-col items-center justify-center space-y-8">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 p-2 text-black hover:text-gray-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex items-center mb-8">
              <Heart className="h-8 w-8 text-black mr-3" />
              <span className="text-xl font-medium tracking-widest uppercase">P & E</span>
            </div>

            <nav className="flex flex-col items-center space-y-6">
              {[
                { name: t("nav.home"), href: "/" },
                { name: t("nav.ourStory"), href: "/story" },
                { name: t("nav.details"), href: "/details" },
                { name: t("nav.gallery"), href: "/gallery" },
                { name: t("nav.rsvp"), href: "/rsvp" },
                { name: t("nav.wishes"), href: "/wishes" },
                { name: t("nav.contact"), href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-black hover:text-gray-500 text-lg font-medium tracking-widest uppercase transition-all duration-300 ${
                    item.href === "/wishes" ? "border-b-2 border-black pb-1" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {showWishModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowWishModal(false)} />
          <div className="relative bg-white border-2 border-black p-8 max-w-md w-full text-center">
            <button
              onClick={() => setShowWishModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <Heart className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-lg font-medium tracking-widest uppercase mb-4">{t("pages.wishesReceived")}</h3>
            <p className="text-sm font-mono tracking-wider text-gray-600 mb-6">
              {t("pages.wishesThanks")}
            </p>
            <Button
              onClick={() => setShowWishModal(false)}
              className="bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-6 py-2"
            >
              {t("common.close")}
            </Button>
          </div>
        </div>
      )}

      <RateLimitModal
        open={showRateLimitModal}
        onOpenChange={setShowRateLimitModal}
        type="wish"
        resetTime={rateLimitResetTime}
      />

      <section className="px-4 md:px-8 py-12 md:py-16 bg-gray-50 pt-28 md:pt-32">
        <div className="max-w-2xl mx-auto">
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h2 className="text-lg md:text-xl font-medium tracking-widest uppercase mb-4">{t("pages.wishesTitle")}</h2>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500">
              {t("pages.wishesSubtitle")}
            </p>
          </div>

          <form
            onSubmit={handleWishSubmit}
            className={`space-y-4 md:space-y-6 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2">{t("pages.yourName")}</label>
              <Input
                type="text"
                required
                value={wishForm.name}
                onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                className="border-black text-xs font-mono tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2">{t("pages.yourMessage")}</label>
              <Textarea
                required
                value={wishForm.message}
                onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                className="border-black text-xs font-mono tracking-wider"
                rows={6}
                placeholder={t("pages.wishesPlaceholder")}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-6 py-3 transition-all duration-300 hover:scale-105"
            >
              <Heart className="w-4 h-4 mr-2" />
              {t("pages.sendWishes")}
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
