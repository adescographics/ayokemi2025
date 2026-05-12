"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { ImageDetailPanel } from "@/components/image-detail-panel"
import { useLanguage } from "@/hooks/use-language"

interface GuestPhoto {
  id: string
  url: string
  uploader_name: string
  uploader_email: string
  event: string
  uploaded_at: string
  title?: string
  description?: string
  location?: string
  likes?: number
  views?: number
}

export default function ImagePage() {
  const router = useRouter()
  const { id } = router.query
  const [photo, setPhoto] = useState<GuestPhoto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    if (!id) return

    const fetchPhoto = async () => {
      try {
        const response = await fetch("/api/portal/get-guest-photos")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        const foundPhoto = data.photos.find((p: GuestPhoto) => p.id === id)
        setPhoto(foundPhoto || null)
      } catch (error) {
        console.error("[v0] Error fetching photo:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhoto()
  }, [id])

  const handleClose = () => {
    router.push("/gallery")
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[70] bg-black flex items-center justify-center">
        <p className="text-white text-sm font-mono tracking-wider">{t("common.loading")}</p>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="fixed inset-0 z-[70] bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-sm font-mono tracking-wider mb-4">{t("pages.noPhotos")}</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-white text-black text-xs font-medium tracking-widest uppercase hover:bg-gray-200"
          >
            {t("pages.backGallery")}
          </button>
        </div>
      </div>
    )
  }

  return <ImageDetailPanel image={{ ...photo, title: photo.title || t("pages.untitled") }} onClose={handleClose} />
}
