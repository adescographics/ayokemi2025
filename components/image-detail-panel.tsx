"use client"
import { useState } from "react"
import { Download, Share2, Calendar, Clock, MapPin, User, Mail, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

interface ImageDetailPanelProps {
  image: {
    id: string
    url: string
    title: string
    uploader_name: string
    uploader_email: string
    event: string
    uploaded_at: string
    description?: string
    location?: string
  }
  onClose: () => void
}

export function ImageDetailPanel({ image, onClose }: ImageDetailPanelProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { t } = useLanguage()

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${image.title || "photo"}-${image.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("[Ayokemi2025] Download failed:", error)
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/gallery/image/${image.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: `Check out this photo: ${image.title}`,
          url: shareUrl,
        })
      } catch (error) {
        console.error("[Ayokemi2025] Share failed:", error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (error) {
        console.error("[Ayokemi2025] Copy failed:", error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full flex flex-col lg:flex-row" onClick={(e) => e.stopPropagation()}>
        {/* Left side - Image */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Right side - Details Panel */}
        <div className="w-full lg:w-[420px] bg-white overflow-y-auto">
          {/* Close Button */}
          <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4 flex justify-between items-center">
            <h3 className="text-sm font-medium tracking-widest uppercase">{t("pages.photoDetails")}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-colors rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-xl font-medium tracking-wide mb-2">{image.title}</h2>
              {image.description && (
                <p className="text-sm text-gray-600 font-mono tracking-wider">{image.description}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleDownload} variant="outline" className="flex-1 gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                <span className="text-xs tracking-wider">{t("pages.download")}</span>
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1 gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                <span className="text-xs tracking-wider">{isCopied ? t("pages.copied") : t("pages.share")}</span>
              </Button>
            </div>

            {/* Uploader Info */}
            <div className="pt-4 border-t-2 border-gray-200 space-y-3">
              <h4 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-3">
                {t("pages.uploaderInfo")}
              </h4>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-gray-500">{t("pages.yourName")}</p>
                  <p className="text-sm font-mono tracking-wider">{image.uploader_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-gray-500">Email</p>
                  <p className="text-sm font-mono tracking-wider">{image.uploader_email}</p>
                </div>
              </div>
            </div>

            {/* Photo Details */}
            <div className="pt-4 border-t-2 border-gray-200 space-y-3">
              <h4 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-3">
                {t("pages.photoDetails")}
              </h4>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-gray-500">{t("pages.date")}</p>
                  <p className="text-sm font-mono tracking-wider">{formatDate(image.uploaded_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-gray-500">{t("pages.time")}</p>
                  <p className="text-sm font-mono tracking-wider">{formatTime(image.uploaded_at)}</p>
                </div>
              </div>
              {image.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-gray-500">{t("pages.locationLabel")}</p>
                    <p className="text-sm font-mono tracking-wider">{image.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-gray-500">{t("pages.eventCategory")}</p>
                  <p className="text-sm font-mono tracking-wider">{image.event}</p>
                </div>
              </div>
            </div>

            {/* Share Link */}
            <div className="pt-4 border-t-2 border-gray-200">
              <p className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-2">{t("pages.shareLink")}</p>
              <div className="bg-gray-50 p-3 rounded border-2 border-gray-200">
                <p className="text-xs font-mono text-gray-600 break-all">
                  {`${typeof window !== "undefined" ? window.location.origin : ""}/gallery/image/${image.id}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
