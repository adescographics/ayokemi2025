"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/router"
import { Trash2, LogOut, Upload, X } from "lucide-react"

interface GuestPhoto {
  id: string
  name: string
  email: string
  event: string
  url: string
  uploadedAt: string
}

const ADMIN_PASSWORD = "AXZ-441-AYOKEMI-234!"

export default function AdminGuestPhotoPortal() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [photos, setPhotos] = useState<GuestPhoto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    event: "Pre-wedding",
  })
  const [uploadMessage, setUploadMessage] = useState("")
  const [uploadError, setUploadError] = useState("")

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchPhotos()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuthenticated", "true")
      setIsAuthenticated(true)
      setPassword("")
      fetchPhotos()
    } else {
      setUploadError("Invalid password. Please try again.")
      setPassword("")
    }
  }

  const fetchPhotos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/portal/get-guest-photos")
      if (!response.ok) throw new Error("Failed to fetch photos")
      const data = await response.json()
      setPhotos(data.photos || [])
    } catch (error) {
      console.error("[v0] Error fetching photos:", error)
      setUploadError("Failed to load photos")
    } finally {
      setIsLoading(false)
    }
  }

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        setUploadError("")
      } else {
        setUploadError("Please drop an image file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        setUploadError("")
      } else {
        setUploadError("Please select an image file")
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadMessage("")
    setUploadError("")

    if (!formData.name || !formData.email || !selectedFile) {
      setUploadError("Please fill in all required fields and select an image")
      return
    }

    setIsLoading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = event.target?.result as string

        try {
          const response = await fetch("/api/portal/upload-guest-photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              event: formData.event,
              imageData: base64,
              fileName: selectedFile.name,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Upload failed")
          }

          setUploadMessage("Photo uploaded successfully!")
          setFormData({ name: "", email: "", event: "Pre-wedding" })
          setSelectedFile(null)
          setTimeout(() => {
            fetchPhotos()
            setUploadMessage("")
          }, 1500)
        } catch (error) {
          console.error("[v0] Upload error:", error)
          setUploadError(error instanceof Error ? error.message : "Failed to upload photo. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }
      reader.readAsDataURL(selectedFile)
    } catch (error) {
      console.error("[v0] File read error:", error)
      setUploadError("Failed to read file")
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/portal/delete-guest-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error("Delete failed")

      setUploadMessage("Photo deleted successfully!")
      setTimeout(() => {
        fetchPhotos()
        setUploadMessage("")
      }, 1500)
    } catch (error) {
      console.error("[v0] Delete error:", error)
      setUploadError("Failed to delete photo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated")
    setIsAuthenticated(false)
    setPassword("")
    setPhotos([])
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full border-2 border-black p-8">
          <h1 className="text-2xl font-medium tracking-widest uppercase text-center mb-2">ADMIN PORTAL</h1>
          <p className="text-xs font-mono tracking-wider text-gray-600 text-center mb-8">Guest Photo Management</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-medium tracking-widest uppercase block mb-2">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2 border-2 border-black font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-xs font-medium tracking-widest uppercase text-gray-600"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {uploadError && <div className="text-xs text-red-600 font-mono">{uploadError}</div>}

            <button
              type="submit"
              className="w-full bg-black text-white py-2 font-medium tracking-widest uppercase text-xs hover:bg-gray-800 transition-colors"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium tracking-widest uppercase mb-2">Guest Photo Manager</h1>
            <p className="text-xs font-mono tracking-wider text-gray-600">
              Upload and manage guest photos for the gallery
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-black font-medium tracking-widest uppercase text-xs hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>

        {/* Messages */}
        {uploadMessage && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-600 font-mono text-xs tracking-wider text-green-700">
            ✓ {uploadMessage}
          </div>
        )}
        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-600 font-mono text-xs tracking-wider text-red-700">
            ✗ {uploadError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="border-2 border-black p-6">
              <h2 className="text-lg font-medium tracking-widest uppercase mb-4">Upload Photo</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="text-xs font-medium tracking-widest uppercase block mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Uploader name"
                    className="w-full px-3 py-2 border-2 border-black font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium tracking-widest uppercase block mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                    className="w-full px-3 py-2 border-2 border-black font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium tracking-widest uppercase block mb-2">Event</label>
                  <select
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black font-mono text-sm"
                  >
                    <option>Pre-wedding</option>
                    <option>Engagement</option>
                    <option>Church Wedding</option>
                    <option>Reception</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium tracking-widest uppercase block mb-2">Image *</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                      dragActive ? "border-black bg-gray-50" : "border-gray-400 bg-white"
                    }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <Upload className="w-6 h-6 mx-auto text-gray-600" />
                      <div>
                        <p className="text-xs font-medium tracking-widest uppercase">
                          {selectedFile ? selectedFile.name : "Drag image here or click to browse"}
                        </p>
                        {!selectedFile && <p className="text-xs text-gray-600 mt-1">Supports PNG, JPG, GIF</p>}
                      </div>
                    </div>
                  </div>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 flex items-center space-x-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-2 font-medium tracking-widest uppercase text-xs hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isLoading ? "UPLOADING..." : "UPLOAD"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Photos Table */}
          <div className="lg:col-span-2">
            <div className="border-2 border-black">
              <div className="bg-black text-white px-6 py-3 font-medium tracking-widest uppercase text-xs">
                Guest Photos ({photos.length})
              </div>

              {isLoading && photos.length === 0 ? (
                <div className="p-6 text-center text-gray-600">Loading photos...</div>
              ) : photos.length === 0 ? (
                <div className="p-6 text-center text-gray-600 font-mono text-xs">No photos uploaded yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b-2 border-black">
                      <tr className="font-medium tracking-widest uppercase">
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Event</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {photos.map((photo, index) => (
                        <tr key={photo.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-4 py-3 font-mono">{photo.name}</td>
                          <td className="px-4 py-3 font-mono text-gray-600">{photo.email}</td>
                          <td className="px-4 py-3">{photo.event}</td>
                          <td className="px-4 py-3 font-mono text-gray-600 text-xs">
                            {new Date(photo.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDelete(photo.id)}
                              disabled={isLoading}
                              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                              title="Delete photo"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
