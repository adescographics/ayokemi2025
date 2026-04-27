"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

const EVENTS = ["Engagement", "Church Wedding", "Reception", "Guest Photos"]

export default function PhotoUploadForm({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [uploaderName, setUploaderName] = useState("")
  const [uploaderEmail, setUploaderEmail] = useState("")
  const [event, setEvent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessageType("error")
      setMessage("Please select an image file")
      return
    }

    if (file.size > 5242880) {
      setMessageType("error")
      setMessage("Image too large. Maximum size is 5MB")
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
    setMessage("")
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (!uploaderName.trim()) {
      setMessageType("error")
      setMessage("Please enter your name")
      setIsLoading(false)
      return
    }

    if (!uploaderEmail.trim()) {
      setMessageType("error")
      setMessage("Please enter your email")
      setIsLoading(false)
      return
    }

    if (!event) {
      setMessageType("error")
      setMessage("Please select an event")
      setIsLoading(false)
      return
    }

    if (!selectedFile) {
      setMessageType("error")
      setMessage("Please select an image file")
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", uploaderName.trim())
      formData.append("email", uploaderEmail.trim())
      formData.append("event", event)
      formData.append("file", selectedFile)

      console.log("[v0] Uploading photo:", { name: uploaderName, email: uploaderEmail, event })

      const response = await fetch("/api/portal/upload-guest-photo", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Upload response status:", response.status)
      const data = await response.json()
      console.log("[v0] Upload response data:", data)

      if (response.ok) {
        setMessageType("success")
        setMessage("Photo uploaded successfully! Thank you for sharing your memories.")
        setUploaderName("")
        setUploaderEmail("")
        setEvent("")
        setSelectedFile(null)
        setPreviewUrl(null)

        if (onUploadSuccess) {
          setTimeout(() => onUploadSuccess(), 1000)
        }
      } else {
        setMessageType("error")
        setMessage(data.error || "Failed to upload photo")
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setMessageType("error")
      setMessage("An error occurred while uploading. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 border-2 border-gray-300">
      <h2 className="text-xl font-medium tracking-widest uppercase mb-6">Share Your Photos</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium tracking-widest uppercase mb-2">Your Name</label>
          <Input
            type="text"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Enter your name"
            required
            className="border-2 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-widest uppercase mb-2">Email</label>
          <Input
            type="email"
            value={uploaderEmail}
            onChange={(e) => setUploaderEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="border-2 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-widest uppercase mb-2">Event</label>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            required
            className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm"
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
          <label className="block text-xs font-medium tracking-widest uppercase mb-2">Upload Photo</label>
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-black bg-gray-50" : "border-gray-300"
            }`}
          >
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="max-h-64 mx-auto rounded" />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm font-mono tracking-wider text-gray-600 mb-2">
                  Drag and drop your image here, or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-medium tracking-widest uppercase cursor-pointer rounded transition-colors"
                >
                  Choose File
                </label>
                <p className="text-xs text-gray-500 mt-2">Maximum file size: 5MB</p>
              </>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-medium tracking-widest uppercase hover:bg-gray-800"
        >
          {isLoading ? "Uploading..." : "Upload Photo"}
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
