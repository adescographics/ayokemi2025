import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
  return (
    <div className="px-4 md:px-8 py-12 md:py-16 pt-28 md:pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12 md:mb-16">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12 md:mb-16">
          <Skeleton className="h-8 w-32 mx-auto mb-4" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Form skeleton */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>

          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

export function GallerySkeleton() {
  return (
    <div className="px-4 md:px-8 py-12 md:py-16 pt-28 md:pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12 md:mb-16">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        {/* Gallery grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
