"use client"
import { useState, useEffect } from "react"
import Head from "next/head"
import { Calendar, MapPin, Copy, Check } from "lucide-react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { useLanguage } from "@/hooks/use-language"

export default function HomePage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
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
        <title>{t("home.title")}</title>
        <meta name="description" content="Peter & Elizabeth's Wedding - December 20, 2025" />
      </Head>

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
              {t("home.gettingMarried")}
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
              {t("home.quote")}
            </p>

            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "1100ms" }}
            >
              <div className="border-2 border-black p-6 md:p-8 max-w-2xl mx-auto mb-8 md:mb-12">
                <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4 md:mb-6">
                  {t("home.weddingGift")}
                </h3>
                <p className="text-xs md:text-sm font-mono tracking-wider text-gray-600 mb-6">
                  {t("home.giftIntro")}
                </p>
                <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-mono tracking-wider">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium">{t("home.accountNumber")}</span>
                    <div className="flex items-center space-x-2">
                      <span>1955374567</span>
                      <button
                        onClick={() => copyToClipboard("1955374567")}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title={t("common.copyAccount")}
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
                    <span className="font-medium">{t("home.accountName")}</span>
                    <span>FAKEYE PETER AYOOLA AND EMMANUEL ELIZABETH AJOKE</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium">{t("home.bankName")}</span>
                    <span>Access Bank</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t("home.phoneNumber")}</span>
                    <span>+2348167788117</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  {t("home.receipt")}
                </p>
              </div>

              <div className="border-2 border-black p-6 md:p-8 max-w-2xl mx-auto">
                <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4 md:mb-6">
                  {t("home.dressCode")}
                </h3>
                <p className="text-xs md:text-sm font-mono tracking-wider text-gray-600 mb-8">
                  {t("home.dressIntro")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {/* Engagement */}
                  <div className="flex flex-col items-center">
                    <p className="text-xs md:text-sm font-medium tracking-widest uppercase mb-4 text-gray-700">
                      {t("home.engagement")}
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
                      {t("home.rustyGold")} &<br />
                      {t("home.burntOrange")}
                    </span>
                  </div>

                  {/* Church Wedding */}
                  <div className="flex flex-col items-center">
                    <p className="text-xs md:text-sm font-medium tracking-widest uppercase mb-4 text-gray-700">
                      {t("home.churchWedding")}
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
                      {t("home.mustardYellow")} &<br />
                      {t("home.burgundy")}
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
