import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"
import { verifyAdminToken } from "@/lib/auth-utils"

const dataFile = path.join(process.cwd(), "data", "photos.json")

interface PhotoMetadata {
  id: string
  url: string
  uploaderName: string
  uploaderEmail: string
  event: string
  uploadedAt: string
  approved: boolean
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify admin authentication
  const token = req.headers.authorization?.split("Bearer ")[1]
  if (!verifyAdminToken(token || "")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method === "GET") {
    try {
      const photos: PhotoMetadata[] = JSON.parse(fs.readFileSync(dataFile, "utf-8"))
      res.status(200).json({ photos })
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photos" })
    }
  } else if (req.method === "PUT") {
    try {
      const { photoId, approved } = req.body

      if (!photoId) {
        return res.status(400).json({ error: "Photo ID is required" })
      }

      const photos: PhotoMetadata[] = JSON.parse(fs.readFileSync(dataFile, "utf-8"))
      const photoIndex = photos.findIndex((p) => p.id === photoId)

      if (photoIndex === -1) {
        return res.status(404).json({ error: "Photo not found" })
      }

      photos[photoIndex].approved = approved
      fs.writeFileSync(dataFile, JSON.stringify(photos, null, 2))

      res.status(200).json({ success: true, photo: photos[photoIndex] })
    } catch (error) {
      res.status(500).json({ error: "Failed to update photo" })
    }
  } else if (req.method === "DELETE") {
    try {
      const { photoId } = req.body

      if (!photoId) {
        return res.status(400).json({ error: "Photo ID is required" })
      }

      const photos: PhotoMetadata[] = JSON.parse(fs.readFileSync(dataFile, "utf-8"))
      const filteredPhotos = photos.filter((p) => p.id !== photoId)

      fs.writeFileSync(dataFile, JSON.stringify(filteredPhotos, null, 2))

      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ error: "Failed to delete photo" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
