"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Clock } from "lucide-react"
import { formatTimeRemaining } from "@/lib/rate-limit-utils"

interface RateLimitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "rsvp" | "wish"
  resetTime: number
}

export default function RateLimitModal({ open, onOpenChange, type, resetTime }: RateLimitModalProps) {
  const typeLabel = type === "rsvp" ? "RSVP" : "Wish"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-black font-mono max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-lg md:text-xl tracking-widest uppercase">
            Submission Limit Reached
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4 pt-4 text-gray-700">
            <p className="text-sm md:text-base">
              You've reached the maximum of <strong className="text-black">3 {typeLabel} submissions</strong> per hour.
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              This limit helps us prevent spam and ensure all submissions are genuine.
            </p>
            <div className="bg-gray-50 border-2 border-gray-300 p-4 rounded">
              <p className="text-xs md:text-sm font-medium text-gray-700">You can submit again in:</p>
              <p className="text-base md:text-lg font-bold mt-2 tracking-wider text-black">
                {formatTimeRemaining(resetTime)}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction className="w-full border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-mono tracking-wider uppercase text-sm">
            Understood
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
