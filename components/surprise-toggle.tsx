"use client"
import { useState, useEffect } from "react"
import { Mail, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"
import { trackClick } from "./analytics-tracker"

export default function SurpriseToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  // Don't show on the surprise message page itself
  const shouldShow = router.pathname !== "/surprise-message"

  useEffect(() => {
    // Show the toggle button after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!shouldShow) return null

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          trackClick(isOpen ? "surprise-toggle-close" : "surprise-toggle-open")
        }}
        className={`fixed bottom-6 left-6 z-[60] p-4 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        } ${isOpen ? "scale-0" : "scale-100"}`}
        aria-label="Open surprise message"
      >
        <Mail className="w-6 h-6" />
      </button>

      {/* Chat Widget Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 left-6 z-[60] w-80 md:w-96 bg-white border-2 border-black shadow-2xl transition-all duration-500 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-black text-white">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium tracking-widest uppercase">Surprise Message</span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
                trackClick("surprise-widget-close")
              }}
              className="hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm font-mono leading-relaxed text-gray-800 text-pretty">
              Please click the 'Learn More' button and read a meaningful message the couple wishes to share with you on
              this special occasion.
            </p>

            <div className="pt-4">
              <Button
                onClick={() => {
                  router.push("/surprise-message")
                  trackClick("surprise-learn-more")
                  setIsOpen(false)
                }}
                className="w-full bg-black text-white hover:bg-gray-800 text-sm font-medium tracking-widest uppercase"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
