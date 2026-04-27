"use client"
import { useState, useEffect } from "react"
import Head from "next/head"
import { Calendar, MapPin, Copy, Check, X } from "lucide-react"
import { ImageWithLoading } from "@/components/image-with-loading"

export default function HomePage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showNewYearModal, setShowNewYearModal] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("ayokemi-new-year-modal-shown")
    if (!hasSeenModal) {
      const modalTimer = setTimeout(() => {
        sessionStorage.setItem("ayokemi-new-year-modal-shown", "true")
      }, 500)
      return () => clearTimeout(modalTimer)
    } else {
      setShowNewYearModal(false)
    }
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <>
      <Head>
        <title>Welcome to Our Wedding Website! | Elizabeth & Peter</title>
        <meta name="description" content="Peter & Elizabeth's Wedding - December 20, 2025" />
      </Head>

      {showNewYearModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowNewYearModal(false)}
        >
          <div
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-sm bg-white shadow-2xl overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowNewYearModal(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center text-center">
              {/* Thank You Image */}
              <div className="w-full aspect-square overflow-hidden bg-gray-100">
                <ImageWithLoading
                  src="/images/design-mode/IMG-20251027-WA0016.jpg"
                  alt="Elizabeth & Peter"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Message */}
              <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-widest uppercase">
                  Happy New Year 2026!
                </h2>
                <p className="text-xs sm:text-sm md:text-base font-medium tracking-widest uppercase text-gray-700">
                  Elizabeth & Peter
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm font-mono tracking-wider text-gray-600 leading-relaxed">
                  Wishing you a blessed and prosperous new year filled with love, joy, and cherished moments together.
                </p>
                <button
                  onClick={() => setShowNewYearModal(false)}
                  className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-black text-white text-[11px] sm:text-xs font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors rounded"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="px-4 md:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="mb-8 md:mb-12">
              <ImageWithLoading
                src="/images/design-mode/IMG-20251027-WA0016.jpg"
                alt="Peter and Elizabeth"
                className="w-full max-w-xl md:max-w-2xl mx-auto h-auto object-cover rounded-none shadow-lg"
              />
            </div>

            <h1 className="text-3xl md:text-6xl font-medium tracking-widest uppercase mb-6 md:mb-8">
              Elizabeth <span className="text-gray-400">&</span> Peter
            </h1>

            <p className="text-sm md:text-xl font-medium tracking-widest uppercase mb-6 md:mb-8 text-gray-600">
              ARE GETTING MARRIED
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-8 md:mb-12">
              <div className="flex items-center">
                <Calendar className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 text-black" />
                <span className="text-xs md:text-sm font-medium tracking-widest uppercase">DECEMBER 20, 2025</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 text-black" />
                <span className="text-xs md:text-sm font-medium tracking-widest uppercase">OSOGBO, OSUN STATE</span>
              </div>
            </div>

            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500 max-w-2xl mx-auto px-4 mb-12 md:mb-16">
              "Two hearts, one love, forever united. Join us as we celebrate the beginning of our beautiful journey
              together."
            </p>

            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "1100ms" }}
            >
              <div className="border-2 border-black p-6 md:p-8 max-w-2xl mx-auto mb-8 md:mb-12">
                <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4 md:mb-6">
                  WEDDING GIFT
                </h3>
                <p className="text-xs md:text-sm font-mono tracking-wider text-gray-600 mb-6">
                  You can kindly send a gift to the couples using the details below
                </p>
                <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-mono tracking-wider">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium">Account Number:</span>
                    <div className="flex items-center space-x-2">
                      <span>1955374567</span>
                      <button
                        onClick={() => copyToClipboard("1955374567")}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy account number"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium">Account Name:</span>
                    <span>FAKEYE PETER AYOOLA AND EMMANUEL ELIZABETH AJOKE</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium">Bank Name:</span>
                    <span>Access Bank</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Phone Number:</span>
                    <span>+2348167788117</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Kindly send receipt for confirmation to the phone number above
                </p>
              </div>

              <div className="border-2 border-black p-6 md:p-8 max-w-2xl mx-auto">
                <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4 md:mb-6">DRESS CODE</h3>
                <p className="text-xs md:text-sm font-mono tracking-wider text-gray-600 mb-8">
                  Please dress in the following colors for each event
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {/* Engagement */}
                  <div className="flex flex-col items-center">
                    <p className="text-xs md:text-sm font-medium tracking-widest uppercase mb-4 text-gray-700">
                      ENGAGEMENT
                    </p>
                    <div className="flex gap-3 md:gap-4 mb-4">
                      <div
                        className="w-20 h-20 md:w-24 md:h-24 border-2 border-black shadow-lg"
                        style={{ backgroundColor: "#B76E15" }}
                        title="Rusty Gold"
                      />
                      <div
                        className="w-20 h-20 md:w-24 md:h-24 border-2 border-black shadow-lg"
                        style={{ backgroundColor: "#CC5500" }}
                        title="Burnt Orange"
                      />
                    </div>
                    <span className="text-xs font-medium tracking-widest uppercase text-center">
                      Rusty Gold &<br />
                      Burnt Orange
                    </span>
                  </div>

                  {/* Church Wedding */}
                  <div className="flex flex-col items-center">
                    <p className="text-xs md:text-sm font-medium tracking-widest uppercase mb-4 text-gray-700">
                      Church Wedding
                    </p>
                    <div className="flex gap-3 md:gap-4 mb-4">
                      <div
                        className="w-20 h-20 md:w-24 md:h-24 border-2 border-black shadow-lg"
                        style={{ backgroundColor: "#FFD700" }}
                        title="Mustard Yellow"
                      />
                      <div
                        className="w-20 h-20 md:w-24 md:h-24 border-2 border-black shadow-lg"
                        style={{ backgroundColor: "#800020" }}
                        title="Burgundy"
                      />
                    </div>
                    <span className="text-xs font-medium tracking-widest uppercase text-center">
                      Mustard Yellow &<br />
                      Burgundy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
