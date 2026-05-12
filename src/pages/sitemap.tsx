"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Home, Heart, Calendar, ImageIcon, Mail, MessageSquare, Phone, FileText, ExternalLink } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface PageInfo {
  name: string
  path: string
  description: string
  icon: React.ReactNode
  category: "Main" | "Information" | "Interactive"
}

export default function Sitemap() {
  const [hoveredPage, setHoveredPage] = useState<string | null>(null)
  const { t } = useLanguage()

  const pages: PageInfo[] = [
    {
      name: t("nav.home"),
      path: "/",
      description: t("home.title"),
      icon: <Home className="w-5 h-5" />,
      category: "Main",
    },
    {
      name: t("nav.ourStory"),
      path: "/story",
      description: t("pages.storyTitle"),
      icon: <Heart className="w-5 h-5" />,
      category: "Information",
    },
    {
      name: t("nav.details"),
      path: "/details",
      description: t("pages.detailsTitle"),
      icon: <Calendar className="w-5 h-5" />,
      category: "Information",
    },
    {
      name: t("nav.gallery"),
      path: "/gallery",
      description: t("pages.gallerySubtitle"),
      icon: <ImageIcon className="w-5 h-5" />,
      category: "Main",
    },
    {
      name: "RSVP",
      path: "/rsvp",
      description: t("pages.rsvpSubtitle"),
      icon: <Mail className="w-5 h-5" />,
      category: "Interactive",
    },
    {
      name: t("nav.wishes"),
      path: "/wishes",
      description: t("pages.wishesSubtitle"),
      icon: <MessageSquare className="w-5 h-5" />,
      category: "Interactive",
    },
    {
      name: t("nav.contact"),
      path: "/contact",
      description: t("pages.contactSubtitle"),
      icon: <Phone className="w-5 h-5" />,
      category: "Information",
    },
    {
      name: t("pages.aboutDeveloper"),
      path: "/about-developer",
      description: t("pages.aboutDeveloperSubtitle"),
      icon: <FileText className="w-5 h-5" />,
      category: "Information",
    },
    {
      name: t("pages.specialMessage"),
      path: "/surprise-message",
      description: t("pages.specialMessageSubtitle"),
      icon: <Heart className="w-5 h-5" />,
      category: "Information",
    },
  ]

  const categories = ["Main", "Information", "Interactive"] as const

  return (
    <div className="min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-medium tracking-widest uppercase mb-4">{t("pages.siteMap")}</h1>
          <p className="text-sm font-mono tracking-wider text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("pages.siteMapSubtitle")}
          </p>
        </div>

        {/* Categories */}
        {categories.map((category, categoryIndex) => {
          const categoryPages = pages.filter((page) => page.category === category)

          return (
            <div
              key={category}
              className="mb-12 animate-fade-in"
              style={{ animationDelay: `${categoryIndex * 100}ms` }}
            >
              <h2 className="text-xl font-medium tracking-widest uppercase mb-6 border-b-2 border-black dark:border-white pb-2">
                {category === "Main"
                  ? t("pages.mainPages")
                  : category === "Information"
                    ? t("pages.informationPages")
                    : t("pages.interactivePages")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPages.map((page, pageIndex) => (
                  <Link
                    key={page.path}
                    href={page.path}
                    onMouseEnter={() => setHoveredPage(page.path)}
                    onMouseLeave={() => setHoveredPage(null)}
                    className="group"
                    style={{ animationDelay: `${categoryIndex * 100 + pageIndex * 50}ms` }}
                  >
                    <div
                      className={`border-2 border-black dark:border-white p-6 transition-all duration-300 ${
                        hoveredPage === page.path
                          ? "bg-black dark:bg-white text-white dark:text-black transform scale-105 shadow-lg"
                          : "bg-white dark:bg-black text-black dark:text-white hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`p-2 border-2 transition-colors ${
                            hoveredPage === page.path
                              ? "border-white dark:border-black"
                              : "border-black dark:border-white"
                          }`}
                        >
                          {page.icon}
                        </div>
                        <ExternalLink
                          className={`w-4 h-4 transition-all duration-300 ${
                            hoveredPage === page.path ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                          }`}
                        />
                      </div>

                      <h3 className="text-base font-medium tracking-widest uppercase mb-2">{page.name}</h3>
                      <p
                        className={`text-xs font-mono tracking-wider ${
                          hoveredPage === page.path
                            ? "text-gray-200 dark:text-gray-800"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {page.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {/* Footer Note */}
        <div className="text-center mt-16 pt-8 border-t-2 border-gray-200 dark:border-gray-800 animate-fade-in">
          <p className="text-xs font-mono tracking-wider text-gray-600 dark:text-gray-400">
            Total Pages: {pages.length} • Last Updated: October 2025
          </p>
        </div>
      </div>
    </div>
  )
}
