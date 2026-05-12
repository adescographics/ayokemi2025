"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  image: string
}

const events: Event[] = [
  {
    id: "652411",
    title: "Engagement Ceremony",
    date: "December 19, 2025",
    time: "1:00 PM",
    location: "After VMT Water Factory, Powerline Area, Kajola-Ijesa Osogbo, Osun State.",
    description:
      "Celebrate our special moment as we officially announce our commitment to each other. Join us for an evening of joy, music, and togetherness.",
    image: "/engagement-ceremony.jpg",
  },
  {
    id: "875321",
    title: "Wedding Ceremony",
    date: "December 20, 2025",
    time: "10:00 AM",
    location: "Trinity Baptist Church, Kilometre 1 Lameco junction to Ifon Ilobu Road, Osogbo, Osun State",
    description:
      "Join us as we exchange vows and begin our journey together. This sacred ceremony marks the start of our lifetime commitment.",
    image: "/outdoor-wedding-ceremony.png",
  },
]

export default function WatchEventPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <h1 className="text-2xl md:text-4xl font-medium tracking-widest uppercase mb-4">{t("pages.watchLive")}</h1>
          <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500">
            {t("pages.watchSubtitle")}
          </p>
        </div>

        {/* Event Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {events.map((event) => (
            <div key={event.id} className="border-2 border-black overflow-hidden hover:shadow-lg transition-shadow">
              {/* Hero Image */}
              <div className="aspect-video overflow-hidden bg-gray-200">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Title */}
                <h2 className="text-lg md:text-xl font-medium tracking-widest uppercase mb-4">
                  {event.id === "652411" ? t("pages.engagementCeremony") : t("pages.weddingCeremony")}
                </h2>

                {/* Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-medium tracking-widest uppercase text-gray-600 min-w-fit">
                      {t("pages.dateLabel")}
                    </span>
                    <span className="text-xs font-mono tracking-wider text-gray-700">{event.date}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-medium tracking-widest uppercase text-gray-600 min-w-fit">
                      {t("pages.timeLabel")}
                    </span>
                    <span className="text-xs font-mono tracking-wider text-gray-700">{event.time}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-medium tracking-widest uppercase text-gray-600 min-w-fit">
                      {t("pages.locationLabel")}
                    </span>
                    <span className="text-xs font-mono tracking-wider text-gray-700">{event.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm font-mono tracking-wider text-gray-600 mb-6 leading-relaxed">
                  {event.description}
                </p>

                {/* Watch Now Button */}
                <Link href={`/watch-event/events/${event.id}`}>
                  <button className="w-full px-6 py-3 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors">
                    {t("pages.watchNow")}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
