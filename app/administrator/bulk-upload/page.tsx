"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"
import SessionManager from "@/components/session-manager"

interface UploadProgress {
  status: "idle" | "loading" | "success" | "error"
  message: string
  imagesAdded?: number
  errorDetails?: string
}

export default function BulkUploadPage() {
  const router = useRouter()
  const [gdLink, setGdLink] = useState("")
  const [progress, setProgress] = useState<UploadProgress>({ status: "idle", message: "" })
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem("adminAuthToken")
      if (!token) {
        router.push("/administrator/login")
        return
      }
      setIsAuthorized(true)
    }
    checkAuth()
  }, [router])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!gdLink.trim()) {
      setProgress({ status: "error", message: "Please enter a Google Drive folder URL or ID" })
      return
    }

    setProgress({ status: "loading", message: "Extracting Google Drive images..." })

    try {
      const token = sessionStorage.getItem("adminAuthToken")
      if (!token) {
        router.push("/administrator/login")
        return
      }

      const response = await fetch("/api/admin/bulk-upload-drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gdLink }),
      })

      const data = await response.json()

      if (response.ok) {
        setProgress({
          status: "success",
          message: `Successfully added ${data.imagesAdded} images to the gallery!`,
          imagesAdded: data.imagesAdded,
        })
        setGdLink("")
        setTimeout(() => {
          router.push("/gallery")
        }, 3000)
      } else {
        setProgress({
          status: "error",
          message: data.message || "Failed to upload images",
          errorDetails: data.details,
        })
      }
    } catch (error) {
      setProgress({
        status: "error",
        message: "Network error - could not connect to server",
        errorDetails: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono tracking-wider">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <SessionManager timeoutMinutes={60} />

      <div className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-medium tracking-widest uppercase mb-2">Bulk Photo Upload</h1>
          <p className="text-sm font-mono tracking-wider text-muted-foreground">
            Import 119 images from Google Drive to gallery
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-medium tracking-widest uppercase">Google Drive Import</CardTitle>
            <CardDescription className="font-mono text-xs tracking-wider">
              Paste your Google Drive folder link to import all images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium tracking-widest uppercase mb-3">
                  Google Drive Folder URL or ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gdLink}
                    onChange={(e) => setGdLink(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/1BiZaUxLWacple_qEedLNeUPMfXyp3n6J"
                    className="flex-1 p-3 border-2 border-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={progress.status === "loading"}
                  />
                  <button
                    type="submit"
                    disabled={progress.status === "loading" || !gdLink.trim()}
                    className="px-6 py-3 bg-black text-white font-mono tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {progress.status === "loading" ? "Uploading..." : "Import"}
                  </button>
                </div>
                <p className="text-xs text-gray-600 font-mono mt-2">
                  Folder must be set to "Everyone" access. Share URL or just the folder ID (1BiZa...)
                </p>
              </div>

              {progress.status !== "idle" && (
                <div
                  className={`p-4 border-2 ${
                    progress.status === "success"
                      ? "bg-green-50 border-green-300"
                      : progress.status === "error"
                        ? "bg-red-50 border-red-300"
                        : "bg-blue-50 border-blue-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {progress.status === "loading" && (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-0.5" />
                    )}
                    {progress.status === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    {progress.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium tracking-wider uppercase text-sm">{progress.message}</p>
                      {progress.imagesAdded && (
                        <p className="text-xs text-gray-600 font-mono mt-1">Images added: {progress.imagesAdded}</p>
                      )}
                      {progress.errorDetails && (
                        <p className="text-xs text-gray-600 font-mono mt-1">{progress.errorDetails}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="border-2 bg-blue-50 border-blue-300">
          <CardHeader>
            <CardTitle className="text-base font-medium tracking-widest uppercase">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm font-mono">
            <div>
              <p className="font-medium mb-2">Step 1: Share Your Google Drive Folder</p>
              <p className="text-gray-700">
                Make sure your Google Drive folder is set to "Everyone with the link can view" access level.
              </p>
            </div>
            <div>
              <p className="font-medium mb-2">Step 2: Copy the Folder URL</p>
              <p className="text-gray-700">Open the folder, click "Share", and copy the URL. It should look like:</p>
              <div className="bg-white border border-gray-300 p-2 rounded mt-2 text-xs break-all">
                https://drive.google.com/drive/folders/1BiZaUxLWa...
              </div>
            </div>
            <div>
              <p className="font-medium mb-2">Step 3: Paste and Import</p>
              <p className="text-gray-700">
                Paste the URL above and click "Import". All images will be added with the following metadata:
              </p>
              <ul className="text-gray-700 ml-4 mt-2 space-y-1">
                <li>• Uploader: admin</li>
                <li>• Email: admin</li>
                <li>• Location: Osogbo, Nigeria</li>
                <li>• Date: December 27, 2025</li>
                <li>• Time: 4:31 PM</li>
                <li>• Event: Guest Photos</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
