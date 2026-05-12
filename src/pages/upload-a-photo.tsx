"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/hooks/use-language"

interface FormErrors {
  name?: string
  email?: string
  image?: string
  puzzle?: string
  submit?: string
}

interface SecurityPuzzle {
  question: string
  answer: number
  num1: number
  num2: number
}

export default function UploadPhotoPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [puzzleAnswer, setPuzzleAnswer] = useState("")
  const [puzzle, setPuzzle] = useState<SecurityPuzzle | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitMessage, setSubmitMessage] = useState("")
  const [isDragActive, setIsDragActive] = useState(false)
  const { t } = useLanguage()

  // Current date and time
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  useEffect(() => {
    setIsPageLoaded(true)
    generatePuzzle()
  }, [])

  const generatePuzzle = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setPuzzle({
      question: `What is ${num1} + ${num2}?`,
      answer: num1 + num2,
      num1,
      num2,
    })
    setPuzzleAnswer("")
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!image) {
      newErrors.image = "Please upload an image"
    }

    if (!puzzleAnswer.trim()) {
      newErrors.puzzle = "Please answer the security question"
    } else if (Number.parseInt(puzzleAnswer) !== puzzle?.answer) {
      newErrors.puzzle = "Incorrect answer. Please try again."
      generatePuzzle()
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        setImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})
    setSubmitMessage("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("date", currentDate)
      formDataToSend.append("time", currentTime)
      formDataToSend.append("event", "Guest Photos")
      if (image) {
        formDataToSend.append("image", image)
      }

      const response = await fetch("/api/portal/upload-guest-photo-submit", {
        method: "POST",
        body: formDataToSend,
      })

      const result = await response.json()

      if (!response.ok) {
        setErrors({ submit: result.message || "Failed to upload photo" })
        return
      }

      setSubmitMessage("Photo uploaded successfully! Thank you for sharing your memories.")
      setFormData({ name: "", email: "", description: "" })
      setImage(null)
      setImagePreview("")
      setPuzzleAnswer("")
      generatePuzzle()

      setTimeout(() => {
        setSubmitMessage("")
      }, 5000)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setErrors({ submit: "An error occurred while uploading. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <section className="px-4 md:px-8 py-12 md:py-16 min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <h1 className="text-3xl md:text-4xl font-medium tracking-widest uppercase mb-4">
              {t("pages.uploadPhotoTitle")}
            </h1>
            <p className="text-sm md:text-base font-mono tracking-wider text-gray-600">
              {t("pages.uploadPhotoSubtitle")}
            </p>
          </div>

          {/* Success Message */}
          {submitMessage && (
            <Alert className="mb-6 border-2 border-green-500 bg-green-50">
              <AlertDescription className="text-green-800 font-medium">{submitMessage}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <label className="block text-sm font-medium tracking-widest uppercase mb-2">{t("pages.nameRequired")}</label>
              <Input
                type="text"
                placeholder={t("pages.fullName")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-2 border-black rounded-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {errors.name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <label className="block text-sm font-medium tracking-widest uppercase mb-2">{t("pages.emailRequired")}</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-2 border-black rounded-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Date & Time Fields (Read-only) */}
            <div
              className={`grid grid-cols-2 gap-4 transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div>
                <label className="block text-sm font-medium tracking-widest uppercase mb-2">{t("pages.date")}</label>
                <Input
                  type="text"
                  value={currentDate}
                  disabled
                  className="w-full border-2 border-gray-300 bg-gray-100 rounded-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium tracking-widest uppercase mb-2">{t("pages.time")}</label>
                <Input
                  type="text"
                  value={currentTime}
                  disabled
                  className="w-full border-2 border-gray-300 bg-gray-100 rounded-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Event Category (Read-only) */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <label className="block text-sm font-medium tracking-widest uppercase mb-2">{t("pages.eventCategory")}</label>
              <Input
                type="text"
                value="Guest Photos"
                disabled
                className="w-full border-2 border-gray-300 bg-gray-100 rounded-none cursor-not-allowed"
              />
            </div>

            {/* Image Upload */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <label className="block text-sm font-medium tracking-widest uppercase mb-2">{t("pages.uploadImage")}</label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-none p-8 text-center transition-all duration-300 ${
                  isDragActive ? "border-black bg-gray-50" : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded border-2 border-black"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null)
                        setImagePreview("")
                      }}
                      className="text-xs font-medium tracking-widest uppercase text-red-600 hover:text-red-700"
                    >
                      {t("common.cancel")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-4xl">📸</div>
                    <div>
                      <p className="text-sm font-medium tracking-wider mb-2">{t("pages.uploadImage")}</p>
                      <p className="text-xs font-mono text-gray-600 mb-4">or</p>
                      <label className="inline-block">
                        <span className="px-6 py-2 border-2 border-black bg-white text-black text-xs font-medium tracking-widest uppercase hover:bg-black hover:text-white transition-all cursor-pointer">
                          {t("pages.chooseImage")}
                        </span>
                        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                      </label>
                    </div>
                  </div>
                )}
              </div>
              {errors.image && <p className="text-red-600 text-xs mt-1 font-medium">{errors.image}</p>}
            </div>

            {/* Description Field */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <label className="block text-sm font-medium tracking-widest uppercase mb-2">
                {t("pages.photoDescription")}
              </label>
              <Textarea
                placeholder={t("pages.photoDescriptionPlaceholder")}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border-2 border-black rounded-none focus:ring-2 focus:ring-black focus:border-transparent min-h-[100px]"
              />
            </div>

            {/* Security Puzzle */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <label className="block text-sm font-medium tracking-widest uppercase mb-2">
                {t("pages.securityQuestion")} *
              </label>
              <div className="bg-blue-50 border-2 border-blue-300 rounded-none p-4 mb-3">
                <p className="text-sm font-medium text-blue-900 mb-3">{puzzle?.question}</p>
                <Input
                  type="number"
                  placeholder={t("pages.securityPlaceholder")}
                  value={puzzleAnswer}
                  onChange={(e) => setPuzzleAnswer(e.target.value)}
                  className="w-full border-2 border-blue-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.puzzle && <p className="text-red-600 text-xs mt-1 font-medium">{errors.puzzle}</p>}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <Alert className="border-2 border-red-500 bg-red-50">
                <AlertDescription className="text-red-800 font-medium">{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div
              className={`flex gap-4 transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "900ms" }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all font-medium tracking-widest uppercase rounded-none h-12"
              >
                {isLoading ? t("pages.submitting") : t("pages.submitPhoto")}
              </Button>
              <Link href="/gallery" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-2 border-black text-black hover:bg-gray-100 font-medium tracking-widest uppercase rounded-none h-12 bg-transparent"
                >
                  {t("pages.backGallery")}
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
