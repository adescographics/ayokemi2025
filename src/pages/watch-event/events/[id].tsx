"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/router"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

interface EventDetail {
  title: string
  date: string
  time: string
  location: string
  description: string
  videoUrl: string
}

const eventDetails: Record<string, EventDetail> = {
  "652411": {
    title: "Engagement Ceremony",
    date: "December 20, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Grand Ballroom, Lagos",
    description:
      "Celebrate our special moment as we officially announce our commitment to each other. Join us for an evening of joy, music, and togetherness as we share this beautiful occasion with our loved ones near and far.",
    videoUrl: "https://drive.google.com/file/d/1QexvBDp43Xmung447dUI5nCiE8cn8nVm/preview",
  },
  "875321": {
    title: "Wedding Ceremony",
    date: "December 22, 2025",
    time: "11:00 AM - 2:00 PM",
    location: "Cathedral, Lagos",
    description:
      "Join us as we exchange vows and begin our journey together. This sacred ceremony marks the start of our lifetime commitment, blessed by our families and witnessed by those we love most.",
    videoUrl: "https://drive.google.com/file/d/1QexvBDp43Xmung447dUI5nCiE8cn8nVm/preview",
  },
}

interface FormData {
  name: string
  email: string
  issueType: string
  details: string
}

export default function EventDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    issueType: "buffering",
    details: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  if (!id || typeof id !== "string") {
    return <div className="text-center py-16">{t("common.loading")}</div>
  }

  const event = eventDetails[id]

  if (!event) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">{t("pages.eventNotFound")}</p>
        <Link href="/watch-event">
          <button className="px-6 py-2 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-gray-800">
            {t("pages.backEvents")}
          </button>
        </Link>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/report-video-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          eventTitle: event.title,
          eventDate: event.date,
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          issueType: "buffering",
          details: "",
        })
        setTimeout(() => setSubmitStatus("idle"), 3000)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/watch-event">
          <button className="text-xs font-medium tracking-widest uppercase text-black hover:text-gray-600 transition-colors mb-8">
            &larr; {t("pages.backEvents")}
          </button>
        </Link>

        {/* Event Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-medium tracking-widest uppercase mb-4">{event.title}</h1>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium tracking-widest uppercase text-gray-600">{t("pages.dateLabel")}</span>
              <span className="text-sm font-mono tracking-wider text-gray-700">{event.date}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium tracking-widest uppercase text-gray-600">{t("pages.timeLabel")}</span>
              <span className="text-sm font-mono tracking-wider text-gray-700">{event.time}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium tracking-widest uppercase text-gray-600">{t("pages.locationLabel")}</span>
              <span className="text-sm font-mono tracking-wider text-gray-700">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="mb-12 md:mb-16">
          <div className="aspect-video w-full border-2 border-black overflow-hidden bg-black">
            <iframe
              src={`${event.videoUrl}?autoplay=0`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              title={event.title}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* About Section */}
          <div className="md:col-span-2">
            <div className="border-2 border-black p-6 md:p-8">
              <h2 className="text-lg font-medium tracking-widest uppercase mb-4">{t("pages.aboutEvent")}</h2>
              <p className="text-sm font-mono tracking-wider text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-1">
            <div className="border-2 border-black p-6">
              <h3 className="text-sm font-medium tracking-widest uppercase mb-4">{t("pages.videoIssues")}</h3>
              <div className="space-y-3 text-xs font-mono tracking-wider text-gray-700">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Phone:</p>
                  <a href="tel:+2347083913012" className="hover:text-black transition-colors">
                    +234 708 391 3012
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Email:</p>
                  <a href="mailto:adescographics2023@gmail.com" className="hover:text-black transition-colors">
                    adescographics2023@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Report Form */}
        <div className="mt-8 md:mt-12">
          <div className="border-2 border-black p-6 md:p-8 max-w-2xl">
            <h2 className="text-lg font-medium tracking-widest uppercase mb-6">{t("pages.reportIssue")}</h2>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-100 border-2 border-green-600 text-green-800 text-xs font-mono tracking-wider">
                Thank you! Your report has been sent successfully.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-100 border-2 border-red-600 text-red-800 text-xs font-mono tracking-wider">
                Error submitting form. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium tracking-widest uppercase mb-2">{t("pages.yourName")}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border-2 border-black text-xs font-mono tracking-wider focus:outline-none focus:bg-gray-50"
                  placeholder={t("pages.yourName")}
                />
              </div>

              <div>
                <label className="block text-xs font-medium tracking-widest uppercase mb-2">{t("pages.email")}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border-2 border-black text-xs font-mono tracking-wider focus:outline-none focus:bg-gray-50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium tracking-widest uppercase mb-2">{t("pages.issueType")}</label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-black text-xs font-mono tracking-wider focus:outline-none focus:bg-gray-50"
                >
                  <option value="buffering">Video Buffering</option>
                  <option value="audio">Audio Problems</option>
                  <option value="connection">Connection Issues</option>
                  <option value="loading">Video Not Loading</option>
                  <option value="other">Other Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium tracking-widest uppercase mb-2">{t("pages.details")}</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-black text-xs font-mono tracking-wider focus:outline-none focus:bg-gray-50 resize-none"
                  placeholder={t("pages.detailsPlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
              >
                {isSubmitting ? t("pages.submitting") : t("pages.submitReport")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
