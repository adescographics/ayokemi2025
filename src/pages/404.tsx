"use client"
import { useState, useEffect } from "react"
import { Home, Search, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

export default function Custom404() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`min-h-screen bg-white text-black font-mono flex items-center justify-center px-4 transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-2xl w-full text-center">
        <div
          className={`transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold tracking-widest text-black mb-4">404</h1>
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-black mr-3" />
              <span className="text-xl md:text-2xl font-medium tracking-widest uppercase">
                {t("pages.pageNotFound")}
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="mb-12">
            <p className="text-sm md:text-base font-mono tracking-wider text-gray-600 mb-4">
              {t("pages.notFoundP1")}
            </p>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500">
              {t("pages.notFoundP2")}
            </p>
          </div>

          {/* Decorative Border Box */}
          <div className="border-2 border-black p-8 mb-12 max-w-md mx-auto">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xs font-mono tracking-wider text-gray-600">
              {t("pages.notFoundQuote")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button className="bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-8 py-3 transition-all duration-300 hover:scale-105">
                <Home className="w-4 h-4 mr-2" />
                {t("pages.goHome")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-2 border-black text-black hover:bg-black hover:text-white text-xs font-medium tracking-widest uppercase px-8 py-3 transition-all duration-300 hover:scale-105 bg-transparent"
              >
                {t("pages.contactUs")}
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs font-medium tracking-widest uppercase mb-4 text-gray-500">{t("layout.quickLinks")}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {[
                { name: t("nav.ourStory"), href: "/story" },
                { name: t("nav.details"), href: "/details" },
                { name: t("nav.gallery"), href: "/gallery" },
                { name: t("nav.rsvp"), href: "/rsvp" },
                { name: t("nav.wishes"), href: "/wishes" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs font-medium tracking-widest uppercase text-gray-600 hover:text-black transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
