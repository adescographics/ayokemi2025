"use client"
import { useState, useEffect } from "react"
import { Calendar, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { trackClick } from "@/components/analytics-tracker"
import { useLanguage } from "@/hooks/use-language"

export default function AnnouncementsPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    trackClick("announcements-page-view")
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className={`relative py-12 md:py-20 px-4 md:px-8 border-b border-gray-200 transition-all duration-1000 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Heart className="w-12 h-12 md:w-16 md:h-16 text-black" />
          </div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-wider uppercase mb-4 text-balance">
            {t("pages.announcementsTitle")}
          </h1>
          <p className="text-sm md:text-base font-mono tracking-wider text-gray-600 text-pretty">
            {t("pages.announcementsSubtitle")}
          </p>
        </div>
      </section>

      {/* Announcements List */}
      <div
        className={`max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24 transition-all duration-1000 delay-300 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="space-y-12">
          {/* New Year Announcement Card */}
          <article className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="w-full h-64 md:h-auto">
                <img
                  src="/images/img-20251221-wa0008.jpg"
                  alt="Happy New Year 2026 from the couple"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4 text-xs font-mono tracking-wider text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Jan 1, 2026</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>3:39 AM</span>
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-medium tracking-wider uppercase mb-4 text-balance">
                    {t("pages.newYearTitle")}
                  </h2>

                  <p className="text-sm md:text-base font-mono leading-relaxed text-gray-800 mb-6 text-pretty">
                    {t("pages.newYearExcerpt")}
                  </p>
                </div>

                <div>
                  <Link href="/announcements/20782" onClick={() => trackClick("announcement-read-more")}>
                    <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 text-xs font-medium tracking-widest uppercase w-full md:w-auto">
                      {t("pages.readMore")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Original Announcement Card */}
          <article className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="w-full h-64 md:h-auto">
                <img
                  src="/images/img-20251221-wa0008.jpg"
                  alt="Thank you from the couple"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4 text-xs font-mono tracking-wider text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Dec 21, 2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>6:33 PM</span>
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-medium tracking-wider uppercase mb-4 text-balance">
                    {t("pages.thankYouTitle")}
                  </h2>

                  <p className="text-sm md:text-base font-mono leading-relaxed text-gray-800 mb-6 text-pretty">
                    {t("pages.thankYouP1")}
                  </p>
                </div>

                <div>
                  <Link href="/announcements/20781" onClick={() => trackClick("announcement-read-more")}>
                    <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 text-xs font-medium tracking-widest uppercase w-full md:w-auto">
                      {t("pages.readMore")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
