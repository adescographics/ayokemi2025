"use client"
import { useState, useEffect } from "react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { ImageDetailPanel } from "@/components/image-detail-panel"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface GalleryImage {
  src: string
  caption: string
  category: string
}

interface GuestPhoto {
  id: string
  url: string
  uploader_name: string
  uploader_email: string
  event: string
  uploaded_at: string
  display: boolean
  title?: string
  description?: string
  location?: string
  likes?: number
  views?: number
}

const galleryImages: GalleryImage[] = [
  {
    src: "/images/dsc-2522.jpg",
    caption: "IMAGE 2891",
    category: "Pre-wedding",
  },
  {
    src: "/images/dsc-2966.jpg",
    caption: "IMAGE 4167",
    category: "Pre-wedding",
  },
  {
    src: "/images/dsc-3092.jpg",
    caption: "IMAGE 7543",
    category: "Engagement",
  },
  {
    src: "/images/dsc-3058.jpg",
    caption: "IMAGE 6289",
    category: "Engagement",
  },
  {
    src: "/images/dsc-2928.jpg",
    caption: "IMAGE 5634",
    category: "Pre-wedding",
  },
  {
    src: "/images/dsc-3131.jpg",
    caption: "IMAGE 3827",
    category: "Pre-wedding",
  },
  {
    src: "/images/dsc-3154.jpg",
    caption: "IMAGE 8156",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3167.jpg",
    caption: "IMAGE 9241",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-2897.jpg",
    caption: "IMAGE 6712",
    category: "Engagement",
  },
  {
    src: "/images/dsc-3135.jpg",
    caption: "IMAGE 4928",
    category: "Church wedding",
  },
  {
    src: "/images/image2.jpg",
    caption: "IMAGE 7365",
    category: "Pre-wedding",
  },
  {
    src: "/images/jpgng.jpg",
    caption: "IMAGE 2546",
    category: "Pre-wedding",
  },
  {
    src: "/images/image3.jpg",
    caption: "IMAGE 8734",
    category: "Pre-wedding",
  },
  {
    src: "/images/image.jpg",
    caption: "IMAGE 5821",
    category: "Pre-wedding",
  },
  {
    src: "/images/image1.jpg",
    caption: "IMAGE 3194",
    category: "Pre-wedding",
  },
  {
    src: "/images/img.jpg",
    caption: "IMAGE 9467",
    category: "Pre-wedding",
  },
  {
    src: "/images/img-20251221-wa0018.jpg",
    caption: "IMAGE 6083",
    category: "Church wedding",
  },
  {
    src: "/images/img-20251221-wa0008.jpg",
    caption: "IMAGE 7924",
    category: "Engagement",
  },
  {
    src: "/images/img-20251221-wa0020.jpg",
    caption: "IMAGE 4352",
    category: "Reception",
  },
  {
    src: "/images/img-20251221-wa0023.jpg",
    caption: "IMAGE 8615",
    category: "Reception",
  },
  {
    src: "/images/img-20251221-wa0021.jpg",
    caption: "IMAGE 5493",
    category: "Reception",
  },
  {
    src: "/images/img-20251221-wa0011.jpg",
    caption: "IMAGE 2637",
    category: "Reception",
  },
  {
    src: "/images/dsc-3421.jpg",
    caption: "IMAGE 7821",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3388.jpg",
    caption: "IMAGE 5429",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3470.jpg",
    caption: "IMAGE 3146",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3406.jpg",
    caption: "IMAGE 8904",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3432.jpg",
    caption: "IMAGE 6237",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3437.jpg",
    caption: "IMAGE 4561",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3340.jpg",
    caption: "IMAGE 2738",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3403.jpg",
    caption: "IMAGE 9012",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3463.jpg",
    caption: "IMAGE 5847",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3339.jpg",
    caption: "IMAGE 7194",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3540.jpg",
    caption: "IMAGE 2847",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3519.jpg",
    caption: "IMAGE 5961",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3658.jpg",
    caption: "IMAGE 3284",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3549.jpg",
    caption: "IMAGE 7156",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3525.jpg",
    caption: "IMAGE 4829",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3567.jpg",
    caption: "IMAGE 6392",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3672.jpg",
    caption: "IMAGE 8574",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3675.jpg",
    caption: "IMAGE 1456",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3522.jpg",
    caption: "IMAGE 9238",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3538.jpg",
    caption: "IMAGE 5673",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3679.jpg",
    caption: "IMAGE 6284",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3694.jpg",
    caption: "IMAGE 9572",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3729.jpg",
    caption: "IMAGE 4183",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3692.jpg",
    caption: "IMAGE 7649",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3718.jpg",
    caption: "IMAGE 2915",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3691.jpg",
    caption: "IMAGE 8367",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3690.jpg",
    caption: "IMAGE 5704",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3712.jpg",
    caption: "IMAGE 3891",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3680.jpg",
    caption: "IMAGE 7523",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3786.jpg",
    caption: "IMAGE 3786",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3667.jpg",
    caption: "IMAGE 3667",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3575.jpg",
    caption: "IMAGE 3575",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3651.jpg",
    caption: "IMAGE 3651",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3797.jpg",
    caption: "IMAGE 3797",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3785.jpg",
    caption: "IMAGE 3785",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3669.jpg",
    caption: "IMAGE 3669",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3568.jpg",
    caption: "IMAGE 3568",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3772.jpg",
    caption: "IMAGE 3772",
    category: "Church wedding",
  },
  {
    src: "/images/dsc-3792.jpg",
    caption: "IMAGE 3792",
    category: "Church wedding",
  },
]

const GALLERY_CATEGORIES = ["Pre-wedding", "Engagement", "Church wedding", "Reception"]
const IMAGES_PER_PAGE = 10
const GUEST_PHOTOS_PER_PAGE = 7

export default function GalleryPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [filter, setFilter] = useState<string>("All")
  const [guestPhotos, setGuestPhotos] = useState<GuestPhoto[]>([])
  const [selectedGuestPhoto, setSelectedGuestPhoto] = useState<GuestPhoto | null>(null)
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true)
  const [galleryPage, setGalleryPage] = useState(1)
  const [guestPhotoPage, setGuestPhotoPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    fetchGuestPhotos()
  }, [])

  const fetchGuestPhotos = async () => {
    try {
      const response = await fetch("/api/portal/get-guest-photos")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      console.log("[Ayokemi2025] Guest photos fetched:", data.photos?.length || 0)
      setGuestPhotos(data.photos || [])
    } catch (error) {
      console.error("[Ayokemi2025] Error fetching guest photos:", error)
      setGuestPhotos([])
    } finally {
      setIsLoadingPhotos(false)
    }
  }

  const categories = ["All", ...GALLERY_CATEGORIES]
  const filteredImages = filter === "All" ? galleryImages : galleryImages.filter((img) => img.category === filter)

  const totalGalleryPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE)
  const paginatedGalleryImages = filteredImages.slice(
    (galleryPage - 1) * IMAGES_PER_PAGE,
    galleryPage * IMAGES_PER_PAGE,
  )

  const uploaderList = Array.from(new Set(guestPhotos.map((p) => p.uploader_name)))

  const renderPaginationNumbers = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
    const items = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(i)
              }}
              isActive={currentPage === i}
              className="text-xs"
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(1)
            }}
            isActive={currentPage === 1}
            className="text-xs"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      )

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(i)
              }}
              isActive={currentPage === i}
              className="text-xs"
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(totalPages)
            }}
            isActive={currentPage === totalPages}
            className="text-xs"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  const handleFilterChange = (category: string) => {
    setFilter(category)
    setGalleryPage(1)
    setGuestPhotoPage(1)
  }

  return (
    <>
      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors text-sm font-medium tracking-widest uppercase"
            >
              CLOSE ✕
            </button>
            <ImageWithLoading
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.caption}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="mt-4 text-center">
              <p className="text-white text-sm font-mono tracking-wider">{selectedImage.caption}</p>
              <p className="text-gray-400 text-xs font-medium tracking-widest uppercase mt-2">
                {selectedImage.category}
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h2 className="text-lg md:text-xl font-medium tracking-widest uppercase mb-4">OUR GALLERY</h2>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500">
              Moments captured, memories cherished forever
            </p>
          </div>

          {/* Filter Buttons */}
          <div
            className={`flex flex-wrap justify-center gap-3 mb-8 md:mb-12 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-4 py-2 text-xs font-medium tracking-widest uppercase transition-all duration-300 ${
                  filter === category
                    ? "bg-black text-white border-2 border-black"
                    : "bg-white text-black border-2 border-black hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            {paginatedGalleryImages.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setSelectedImage(image)}
              >
                <div className="border-2 border-black overflow-hidden bg-white">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithLoading
                      src={image.src || "/placeholder.svg"}
                      alt={image.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 border-t-2 border-black">
                    <p className="text-xs font-mono tracking-wider text-gray-700 mb-2">{image.caption}</p>
                    <p className="text-[10px] font-medium tracking-widest uppercase text-gray-500">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {paginatedGalleryImages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm font-mono tracking-wider text-gray-500">No images found in this category</p>
            </div>
          )}

          {/* Gallery Pagination */}
          {totalGalleryPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={galleryPage > 1 ? `/gallery/page-${galleryPage - 1}` : "#"}
                      onClick={(e) => {
                        e.preventDefault()
                        if (galleryPage > 1) setGalleryPage(galleryPage - 1)
                      }}
                      className={galleryPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {renderPaginationNumbers(galleryPage, totalGalleryPages, setGalleryPage)}

                  <PaginationItem>
                    <PaginationNext
                      href={galleryPage < totalGalleryPages ? `/gallery/page-${galleryPage + 1}` : "#"}
                      onClick={(e) => {
                        e.preventDefault()
                        if (galleryPage < totalGalleryPages) setGalleryPage(galleryPage + 1)
                      }}
                      className={galleryPage === totalGalleryPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* Guest Photo Section */}
      <section className="px-4 md:px-8 py-12 md:py-16 bg-gray-50 border-t-2 border-black">
        <div className="max-w-7xl mx-auto">
          {/* Guest Gallery Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-lg md:text-xl font-medium tracking-widest uppercase mb-4">GUEST PHOTOS</h2>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500">
              Check out these images uploaded by our wedding guests
            </p>
          </div>

          {!isLoadingPhotos && guestPhotos.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8"></div>
          )}

          {isLoadingPhotos ? (
            <div className="text-center py-12">
              <p className="text-sm font-mono tracking-wider text-gray-500">Loading photos...</p>
            </div>
          ) : guestPhotos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-mono tracking-wider text-gray-500">No photos yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {(() => {
                const filtered = guestPhotos
                const paged = filtered.slice(
                  (guestPhotoPage - 1) * GUEST_PHOTOS_PER_PAGE,
                  guestPhotoPage * GUEST_PHOTOS_PER_PAGE,
                )
                const totalPages = Math.ceil(filtered.length / GUEST_PHOTOS_PER_PAGE)

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {paged.map((photo) => (
                        <div
                          key={photo.id}
                          className="border-2 border-gray-300 overflow-hidden hover:border-gray-400 cursor-pointer transition-all hover:shadow-lg"
                          onClick={() => setSelectedGuestPhoto(photo)}
                        >
                          <div className="aspect-square overflow-hidden bg-gray-100">
                            <ImageWithLoading
                              src={photo.url || "/placeholder.svg"}
                              alt={photo.title || `Photo by ${photo.uploader_name}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-medium tracking-wide mb-1">{photo.title || "Untitled"}</p>
                            <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">
                              By: {photo.uploader_name || "Anonymous"}
                            </p>
                            <p className="text-xs font-mono tracking-wider text-gray-500">{photo.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center mb-8">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href={guestPhotoPage > 1 ? `/gallery/page-${guestPhotoPage - 1}` : "#"}
                                onClick={(e) => {
                                  e.preventDefault()
                                  if (guestPhotoPage > 1) setGuestPhotoPage(guestPhotoPage - 1)
                                }}
                                className={guestPhotoPage === 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>

                            {renderPaginationNumbers(guestPhotoPage, totalPages, setGuestPhotoPage)}

                            <PaginationItem>
                              <PaginationNext
                                href={guestPhotoPage < totalPages ? `/gallery/page-${guestPhotoPage + 1}` : "#"}
                                onClick={(e) => {
                                  e.preventDefault()
                                  if (guestPhotoPage < totalPages) setGuestPhotoPage(guestPhotoPage + 1)
                                }}
                                className={guestPhotoPage === totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )
              })()}
            </>
          )}
        </div>
      </section>

      {/* Guest Photo Detail Modal */}
      {selectedGuestPhoto && (
        <ImageDetailPanel
          image={{
            id: selectedGuestPhoto.id,
            url: selectedGuestPhoto.url,
            title: selectedGuestPhoto.title || "Untitled",
            uploader_name: selectedGuestPhoto.uploader_name,
            uploader_email: selectedGuestPhoto.uploader_email,
            event: selectedGuestPhoto.event,
            uploaded_at: selectedGuestPhoto.uploaded_at,
            description: selectedGuestPhoto.description,
            location: selectedGuestPhoto.location,
          }}
          onClose={() => setSelectedGuestPhoto(null)}
        />
      )}
    </>
  )
}
