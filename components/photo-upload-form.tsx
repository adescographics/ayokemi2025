"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"

const EVENTS = ["Engagement", "Church Wedding", "Reception", "Pre-wedding", "General"]

interface PhotoUploadFormProps {
  onUploadSuccess?: () => void
}

export default function PhotoUploadForm({ onUploadSuccess }: PhotoUploadFormProps) {
  const [uploaderName, setUploaderName] = useState("")
  const [uploaderEmail, setUploaderEmail] = useState("")
  const [event, setEvent] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setMessage("Image URL is required. Please paste the URL of your image hosted externally.")
    setMessageType("error")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      if (!uploaderName.trim()) {
        setMessageType("error")
        setMessage("Name is required")
        setIsLoading(false)
        return
      }
      if (!uploaderEmail.trim()) {
        setMessageType("error")
        setMessage("Email is required")
        setIsLoading(false)
        return
      }
      if (!event) {
        setMessageType("error")
        setMessage("Event category is required")
        setIsLoading(false)
        return
      }
      if (!photoUrl.trim()) {
        setMessageType("error")
        setMessage("Image URL is required")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploaderName: uploaderName.trim(),
          uploaderEmail: uploaderEmail.trim(),
          event,
          photoUrl: photoUrl.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessageType("success")
        setMessage(data.message || "Photo submitted successfully! Thank you for sharing.")
        setUploaderName("")
        setUploaderEmail("")
        setEvent("")
        setPhotoUrl("")

        if (onUploadSuccess) {
          onUploadSuccess()
        }
      } else {
        setMessageType("error")
        setMessage(data.error || "Failed to submit photo")
      }
    } catch (error) {
      setMessageType("error")
      setMessage("An error occurred while submitting your photo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 border-2 border-gray-300">
      <h2 className="text-xl font-medium tracking-widest uppercase mb-6">Share Your Photos</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium tracking-widest uppercase mb-2">
            Your Name <span className="text-red-600">*</span>
          </label>
          <Input
            type="text"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Enter your name"
            className="border-2 border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-widest uppercase mb-2">
            Email <span className="text-red-600">*</span>
          </label>
          <Input
            type="email"
            value={uploaderEmail}
            onChange={(e) => setUploaderEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="border-2 border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-widest uppercase mb-2">
            Event <span className="text-red-600">*</span>
          </label>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm"
            required
          >
            <option value="">Select an event</option>
            {EVENTS.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium tracking-widest uppercase mb-2">
            Image URL <span className="text-red-600">*</span>
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded p-6 text-center transition-all cursor-pointer mb-2 ${
              dragActive ? "border-black bg-gray-100" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <Upload className="w-8 h-8 mb-2 text-gray-600 mx-auto" />
            <span className="text-xs font-medium tracking-widest uppercase block">Drag and drop here</span>
            <span className="text-xs text-gray-500 mt-1 block">(or paste URL below)</span>
          </div>
          <Input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="border-2 border-gray-300"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Upload your image to Google Drive (set to visible by everyone) or a photo sharing site and paste the URL
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-medium tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit Photo"}
        </Button>

        {message && (
          <div
            className={`p-3 text-sm font-mono tracking-wider rounded ${
              messageType === "success"
                ? "bg-green-100 text-green-800 border-2 border-green-300"
                : "bg-red-100 text-red-800 border-2 border-red-300"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </Card>
  )
}
