import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

interface Photo {
  id: string
  name: string
  email: string
  event: string
  url: string
  uploadedAt: string
}

const PHOTOS_FILE = path.join(process.cwd(), "data", "guest-photos.json")

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({ error: "Photo ID required" })
    }

    let photos: Photo[] = []
    if (fs.existsSync(PHOTOS_FILE)) {
      const data = fs.readFileSync(PHOTOS_FILE, "utf-8")
      photos = JSON.parse(data)
    }

    const filteredPhotos = photos.filter((p) => p.id !== id)

    if (filteredPhotos.length === photos.length) {
      return res.status(404).json({ error: "Photo not found" })
    }

    fs.writeFileSync(PHOTOS_FILE, JSON.stringify(filteredPhotos, null, 2))

    console.log("[v0] Guest photo deleted:", id)

    res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting photo:", error)
    res.status(500).json({ error: "Failed to delete photo" })
  }
}
