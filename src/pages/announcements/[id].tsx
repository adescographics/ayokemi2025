"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Heart, Calendar, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { trackClick } from "@/components/analytics-tracker"

export default function AnnouncementDetailPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    trackClick(`announcement-detail-${id}`)
    return () => clearTimeout(timer)
  }, [id])

  // Render announcement based on ID
  if (id !== "20781" && id !== "20782") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium tracking-wider uppercase mb-4">Announcement Not Found</h1>
          <Link href="/announcements">
            <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 text-xs font-medium tracking-widest uppercase">
              Back to Announcements
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Render different content based on ID
  if (id === "20782") {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section with Image */}
        <section
          className={`relative py-12 md:py-20 px-4 md:px-8 border-b border-gray-200 transition-all duration-1000 ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Link
              href="/announcements"
              onClick={() => trackClick("announcement-back")}
              className="inline-flex items-center gap-2 mb-8 text-sm font-medium tracking-widest uppercase hover:text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Announcements
            </Link>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Image */}
              <div className="w-full md:w-1/2">
                <img
                  src="/images/img-20251221-wa0008.jpg"
                  alt="Happy New Year from Elizabeth and Peter"
                  className="w-full h-auto object-cover border border-gray-200 shadow-lg"
                />
              </div>

              {/* Title */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-6">
                  <Heart className="w-12 h-12 md:w-16 md:h-16 text-black" />
                </div>
                <h1 className="text-3xl md:text-5xl font-medium tracking-wider uppercase mb-4 text-balance">
                  Happy New Year 2026!
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-mono tracking-wider text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Jan 1, 2026</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>3:39 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <article
          className={`max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24 transition-all duration-1000 delay-300 ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="space-y-8 font-mono text-base md:text-lg leading-relaxed text-gray-800">
            <p className="text-pretty">
              As we step into a new year, we wanted to take a moment to express our heartfelt wishes to all of you. 
              Your love, support, and presence in our lives have made 2025 truly unforgettable. We are grateful for 
              the special memories we created together on our wedding day and the love you have continued to show us.
            </p>

            <p className="text-pretty">
              As we embark on this new chapter of 2026, we are filled with hope, joy, and gratitude. We wish you a 
              year filled with health, happiness, prosperity, and love. May this year bring you closer to your dreams 
              and fill your hearts with the same joy you have brought into our lives.
            </p>

            <p className="text-pretty">
              Thank you for being an important part of our story. We look forward to creating more beautiful memories 
              and celebrating life&apos;s precious moments with you.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="font-medium text-center text-lg md:text-xl text-black">With Love & Gratitude, Elizabeth & Peter</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Link href="/" onClick={() => trackClick("announcement-back-home")}>
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-medium tracking-widest uppercase">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <section
        className={`relative py-12 md:py-20 px-4 md:px-8 border-b border-gray-200 transition-all duration-1000 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            href="/announcements"
            onClick={() => trackClick("announcement-back")}
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium tracking-widest uppercase hover:text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Announcements
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Image */}
            <div className="w-full md:w-1/2">
              <img
                src="/images/img-20251221-wa0008.jpg"
                alt="Ayoola and Kemi Fakeye"
                className="w-full h-auto object-cover border border-gray-200 shadow-lg"
              />
            </div>

            {/* Title */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-6">
                <Heart className="w-12 h-12 md:w-16 md:h-16 text-black" />
              </div>
              <h1 className="text-3xl md:text-5xl font-medium tracking-wider uppercase mb-4 text-balance">
                With a Heart Full of Gratitude
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-mono tracking-wider text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Dec 21, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>6:33 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article
        className={`max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24 transition-all duration-1000 delay-300 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="space-y-8 font-mono text-base md:text-lg leading-relaxed text-gray-800">
          <p className="text-pretty">
            On behalf of my wife and me, we are sincerely grateful to everyone who celebrated with us and contributed in
            one way or another to making our wedding truly memorable. Your prayers, presence, kind words, sacrifices,
            and generous gifts meant more to us than we can adequately express.
          </p>

          <p className="text-pretty">
            We are reminded once again that the gift of people is real, and we do not take it for granted. Thank you for
            standing with us, rejoicing with us, and sharing in this special moment of our lives. These memories will
            remain with us for a long time.
          </p>

          <p className="text-pretty">
            We pray that God rewards you abundantly, and His grace continually rests upon you.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="font-medium text-center text-lg md:text-xl text-black">From Mr. & Mrs. Ayoola Fakeye</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Link href="/" onClick={() => trackClick("announcement-back-home")}>
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-medium tracking-widest uppercase">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </article>
    </div>
  )
}
