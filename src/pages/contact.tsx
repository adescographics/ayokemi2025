"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Mail } from "lucide-react"
import { PageSkeleton } from "@/components/page-skeleton"
import { useLanguage } from "@/hooks/use-language"

const MapWidget = ({
  title,
  lat,
  lng,
  address,
  buttonLabel,
}: {
  title: string
  lat: number
  lng: number
  address: string
  buttonLabel: string
}) => {
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div>
      <h4 className="text-xs md:text-sm font-medium tracking-wide mb-3">{title}</h4>
      <div className="border-2 border-black overflow-hidden rounded-sm bg-gray-100 relative">
        <iframe
          src={mapUrl}
          title={title}
          className="h-[350px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-3 border-black text-black hover:bg-black hover:text-white text-xs font-medium tracking-widest uppercase bg-transparent transition-colors"
        onClick={() => window.open(directionsUrl, "_blank")}
      >
        {buttonLabel}
      </Button>
    </div>
  )
}

export default function ContactPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageSkeleton />
  }

  return (
    <div
      className={`min-h-screen bg-white text-black font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <section className="px-4 md:px-8 py-12 md:py-16 pt-28 md:pt-32">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h2 className="text-lg md:text-xl font-medium tracking-widest uppercase mb-4">
              {t("pages.contactLocation")}
            </h2>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500">
              {t("pages.contactSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* Contact Information */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-6 md:mb-8">
                {t("pages.contactUs")}
              </h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center">
                  <Phone className="w-4 md:w-5 h-4 md:h-5 mr-3 md:mr-4 text-black flex-shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-medium tracking-wide">PETER</p>
                    <p className="text-xs font-mono tracking-wider text-gray-600">08167788117</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 md:w-5 h-4 md:h-5 mr-3 md:mr-4 text-black flex-shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-medium tracking-wide">ELIZABETH</p>
                    <p className="text-xs font-mono tracking-wider text-gray-600">09151553758</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 md:w-5 h-4 md:h-5 mr-3 md:mr-4 text-black flex-shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-medium tracking-wide">EMAIL</p>
                    <p className="text-xs font-mono tracking-wider text-gray-600">ayopet4real@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
                <h4 className="text-xs md:text-sm font-medium tracking-widest uppercase mb-3 md:mb-4">
                  {t("pages.venues")}
                </h4>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-xs md:text-sm font-medium tracking-wide">{t("home.engagement")}</p>
                    <p className="text-xs font-mono tracking-wider text-gray-600">
                      After VMT water factory
                      <br />
                      Powerline area, Kajola-Ijesa
                      <br />
                      Osogbo, Osun State
                      <br />
                      December 19, 2025 at 1:00 PM
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium tracking-wide">{t("home.churchWedding")}</p>
                    <p className="text-xs font-mono tracking-wider text-gray-600">
                      Trinity Baptist Church
                      <br />
                      Kilometre 1 Lameco junction to Ifon Ilobu Road
                      <br />
                      Osogbo, Osun State
                      <br />
                      December 20, 2025 at 10:00 AM
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium tracking-wide">{t("pages.reception")}</p>
                    <p className="text-xs font-mono tracking-wider text-gray-600">
                      OSBACON Events Center
                      <br />
                      Behind Baptist Girls' High School
                      <br />
                      Osogbo, Osun State
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maps */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-6 md:mb-8">
                {t("pages.locationMaps")}
              </h3>

              <div className="mb-8">
                <MapWidget
                  title="CHURCH WEDDING - Trinity Baptist Church"
                  lat={7.8014602}
                  lng={4.5389218}
                  address="Trinity Baptist Church, Osogbo, Osun State"
                  buttonLabel={t("pages.openMaps")}
                />
              </div>

              <div>
                <MapWidget
                  title="RECEPTION VENUE - OSBACON Events Center"
                  lat={7.7689187}
                  lng={4.5448757}
                  address="OSBACON Events Center, Behind Baptist Girls' High School, Osogbo"
                  buttonLabel={t("pages.openMaps")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}