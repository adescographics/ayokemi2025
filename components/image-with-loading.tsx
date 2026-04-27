"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageWithLoadingProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  onLoad?: () => void
  priority?: boolean
}

export function ImageWithLoading({
  src,
  alt,
  className,
  placeholder = "/loading-screen-animation.png",
  onLoad,
  priority = false,
}: ImageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className="relative overflow-hidden bg-gray-100 w-full h-full">
      {isLoading && (
        <div
          className={cn("absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10", className)}
        >
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={hasError ? placeholder : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500 w-full h-full object-cover",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  )
}
