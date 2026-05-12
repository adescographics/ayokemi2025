"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Heart, Calendar, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { trackClick } from "@/components/analytics-tracker"
import { useLanguage } from "@/hooks/use-language"

export default function AnnouncementDetailPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const { t } = useLanguage()

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
          <h1 className="text-2xl font-medium tracking-wider uppercase mb-4">{t("pages.announcementNotFound")}</h1>
          <Link href="/announcements">
            <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 text-xs font-medium tracking-widest uppercase">
              {t("pages.backAnnouncements")}
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
              {t("pages.backAnnouncements")}
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
                  {t("pages.newYearTitle")}
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
              {t("pages.newYearP1")}
            </p>

            <p className="text-pretty">
              {t("pages.newYearP2")}
            </p>

            <p className="text-pretty">
              {t("pages.newYearP3")}
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="font-medium text-center text-lg md:text-xl text-black">{t("pages.withLove")}</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Link href="/" onClick={() => trackClick("announcement-back-home")}>
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-medium tracking-widest uppercase">
                {t("pages.backHome")}
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
            {t("pages.backAnnouncements")}
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
                {t("pages.thankYouTitle")}
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
            {t("pages.thankYouP1")}
          </p>

          <p className="text-pretty">
            {t("pages.thankYouP2")}
          </p>

          <p className="text-pretty">
            {t("pages.thankYouP3")}
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="font-medium text-center text-lg md:text-xl text-black">{t("pages.fromCouple")}</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Link href="/" onClick={() => trackClick("announcement-back-home")}>
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-medium tracking-widest uppercase">
              {t("pages.backHome")}
            </Button>
          </Link>
        </div>
      </article>
    </div>
  )
}
