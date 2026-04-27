"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { Heart, MapPin, Calendar, Menu, X, Bell } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import AnalyticsTracker, { trackClick } from "../../components/analytics-tracker"
import SurpriseToggle from "../../components/surprise-toggle"
import CountdownModal from "./countdown-modal"

interface LayoutProps {
  children: React.ReactNode
}

const CookieIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
      fill="currentColor"
    />
    <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
    <circle cx="15" cy="9" r="1" fill="currentColor" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
  </svg>
)

export default function Layout({ children }: LayoutProps) {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCookieConsent, setShowCookieConsent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

    const cookieConsent = localStorage.getItem("cookieConsent")
    if (!cookieConsent) {
      setTimeout(() => setShowCookieConsent(true), 2000)
    }

    return () => clearTimeout(timer)
  }, [])

  const handleCookieConsent = () => {
    localStorage.setItem("cookieConsent", "true")
    setShowCookieConsent(false)
  }

  const navigationItems = [
    { name: "HOME", href: "/" },
    { name: "OUR STORY", href: "/story" },
    { name: "DETAILS", href: "/details" },
    { name: "GALLERY", href: "/gallery" },
    { name: "RSVP", href: "/rsvp" },
    { name: "WISHES", href: "/wishes" },
    { name: "CONTACT", href: "/contact" },
    { name: "THANK YOU", href: "/thank-you" },
  ]

  return (
    <div
      className={`min-h-screen font-mono transition-all duration-1000 bg-white text-black ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <AnalyticsTracker />
      <SurpriseToggle />
      <CountdownModal />

      <header
        className={`px-4 md:px-8 py-6 border-b transition-all duration-700 fixed w-full z-50 backdrop-blur-sm bg-white/95 border-gray-200 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Heart className="h-6 md:h-8 w-6 md:w-8 mr-2 md:mr-3 text-black" />
              <span className="text-base md:text-lg font-medium tracking-widest uppercase">AYOKEMI25</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-6 lg:space-x-8">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => trackClick(`nav-${item.name.toLowerCase().replace(" ", "-")}`)}
                    className={`hover:text-gray-500 text-xs font-medium tracking-widest uppercase transition-all duration-500 ${
                      router.pathname === item.href ? "text-gray-600" : "text-black"
                    } ${isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Notification bell */}
              <Link
                href="/announcements"
                onClick={() => trackClick("nav-announcements")}
                className="p-2 hover:text-gray-500 transition-colors text-black relative"
                aria-label="View announcements"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(true)
                  trackClick("mobile-menu-open")
                }}
                className="md:hidden p-2 hover:text-gray-500 transition-colors text-black"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 backdrop-blur-md bg-white/90" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative h-full flex flex-col items-center justify-center space-y-8">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                trackClick("mobile-menu-close")
              }}
              className="absolute top-8 right-8 p-2 hover:text-gray-500 transition-colors text-black"
              aria-label="Close mobile menu"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex items-center mb-8">
              <Heart className="h-8 w-8 mr-3 text-black" />
              <span className="text-xl font-medium tracking-widest uppercase">AYOKEMI25</span>
            </div>

            <nav className="flex flex-col items-center space-y-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    trackClick(`mobile-nav-${item.name.toLowerCase().replace(" ", "-")}`)
                  }}
                  className={`hover:text-gray-500 text-lg font-medium tracking-widest uppercase transition-all duration-300 ${
                    router.pathname === item.href ? "text-gray-600" : "text-black"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {showCookieConsent && (
        <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-[70]">
          <div className="max-w-md mx-auto p-4 border-2 shadow-lg backdrop-blur-sm bg-white/95 border-black text-black">
            <div className="flex items-start space-x-3">
              <CookieIcon />
              <div className="flex-1">
                <p className="text-xs font-mono tracking-wider mb-3">
                  We use cookies to enhance your browsing experience and remember your preferences. By continuing to use
                  our website, you consent to our use of cookies.
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      handleCookieConsent()
                      trackClick("cookie-accept")
                    }}
                    className="text-xs font-medium tracking-widest uppercase px-4 py-2 bg-black text-white hover:bg-gray-800"
                  >
                    ACCEPT
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCookieConsent(false)
                      trackClick("cookie-decline")
                    }}
                    className="text-xs font-medium tracking-widest uppercase px-4 py-2 border-black text-black hover:bg-gray-100"
                  >
                    DECLINE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 md:pt-24">{children}</main>

      <footer className="border-t mt-20 border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Logo and Tagline */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Heart className="h-6 w-6 mr-3 text-black" />
                <span className="text-lg font-medium tracking-widest uppercase">Elizabeth & Peter</span>
              </div>
              <p className="text-xs font-mono tracking-wider text-gray-600">Two hearts, one love, forever united.</p>
            </div>

            {/* Navigation Links */}
            <div className="text-center">
              <h3 className="text-sm font-medium tracking-widest uppercase mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => trackClick(`footer-${item.name.toLowerCase().replace(" ", "-")}`)}
                    className="text-xs font-medium tracking-widest uppercase hover:text-gray-500 transition-colors text-gray-700"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/changelog"
                  onClick={() => trackClick("footer-changelog")}
                  className="text-xs font-medium tracking-widest uppercase hover:text-gray-500 transition-colors text-gray-700"
                >
                  CHANGELOG
                </Link>
                <Link
                  href="/about-developer"
                  onClick={() => trackClick("footer-developer")}
                  className="text-xs font-medium tracking-widest uppercase hover:text-gray-500 transition-colors text-gray-700"
                >
                  DEVELOPER
                </Link>
              </div>
            </div>

            {/* Wedding Info */}
            <div className="text-center md:text-right">
              <h3 className="text-sm font-medium tracking-widest uppercase mb-4">Wedding Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-end">
                  <Calendar className="w-4 h-4 mr-2 text-black" />
                  <span className="text-xs font-medium tracking-widest uppercase">Dec 20, 2025</span>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <MapPin className="w-4 h-4 mr-2 text-black" />
                  <span className="text-xs font-medium tracking-widest uppercase">Osogbo, Osun State</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bible Verse */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs font-mono tracking-wider italic mb-2 text-gray-600">
              "My beloved is mine, and I am my beloved's."
            </p>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-500">Song of Solomon 6:3</p>
          </div>

          {/* Privacy and Terms Links */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Link
                href="/privacy"
                onClick={() => trackClick("footer-privacy")}
                className="text-xs font-medium tracking-widest uppercase hover:text-gray-500 transition-colors text-gray-700"
              >
                PRIVACY
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/terms"
                onClick={() => trackClick("footer-terms")}
                className="text-xs font-medium tracking-widest uppercase hover:text-gray-500 transition-colors text-gray-700"
              >
                TERMS
              </Link>
            </div>
            <p className="text-xs font-mono tracking-wider text-gray-500">Made with ❤️ for our special day</p>
            <p className="text-xs font-mono tracking-wider text-gray-500 mt-2">
              © 2026 Elizabeth & Peter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
