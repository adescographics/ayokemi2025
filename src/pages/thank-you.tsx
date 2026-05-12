"use client"
import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackClick } from "@/components/analytics-tracker"
import { useRouter } from "next/router"
import { useLanguage } from "@/hooks/use-language"

export default function ThankYouPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    trackClick("thank-you-page-view")
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <section
        className={`relative py-12 md:py-20 px-4 md:px-8 border-b border-gray-200 transition-all duration-1000 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="max-w-5xl mx-auto">
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
              <p className="text-sm md:text-base font-mono tracking-wider text-gray-600 text-pretty">Ayokemi 2025</p>
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
          <Button
            onClick={() => {
              trackClick("thank-you-back-home")
              router.push("/")
            }}
            className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-medium tracking-widest uppercase"
          >
            {t("pages.backHome")}
          </Button>
        </div>
      </article>
    </div>
  )
}
