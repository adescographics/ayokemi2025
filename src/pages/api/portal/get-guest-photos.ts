import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

interface Photo {
  id: string
  name: string
  email: string
  event: string
  imageData: string
  uploadedAt: string
  title?: string
  description?: string
  location?: string
  likes?: number
  views?: number
}

const PHOTOS_FILE = path.join(process.cwd(), "data", "guest-photos.json")

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    let photos: Photo[] = []

    if (fs.existsSync(PHOTOS_FILE)) {
      const data = fs.readFileSync(PHOTOS_FILE, "utf-8")
      photos = JSON.parse(data)
    }

    const transformedPhotos = photos.map((photo) => ({
      id: photo.id,
      uploader_name: photo.name,
      uploader_email: photo.email,
      event: photo.event,
      url: photo.imageData,
      uploaded_at: photo.uploadedAt,
      display: true,
      title: photo.title,
      description: photo.description,
      location: photo.location,
    }))

    console.log("[v0] Retrieved", transformedPhotos.length, "guest photos")

    res.status(200).json({
      success: true,
      photos: transformedPhotos.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()),
    })
  } catch (error) {
    console.error("[v0] Error reading photos:", error)
    res.status(500).json({ error: "Failed to read photos", photos: [] })
  }
}
