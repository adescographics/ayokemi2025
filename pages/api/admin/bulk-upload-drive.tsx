import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"
import { verifyAuthToken } from "@/lib/auth-utils"

const dataFile = path.join(process.cwd(), "data", "guest-photos.json")

interface GuestPhoto {
  id: string
  url: string
  uploaderName: string
  uploaderEmail: string
  location: string
  date: string
  time: string
  event: string
  uploadedAt: string
}

const extractFolderId = (input: string): string | null => {
  // Handle full URL
  const urlMatch = input.match(/\/folders\/([a-zA-Z0-9-_]+)/)
  if (urlMatch) return urlMatch[1]

  // Handle just the ID
  if (/^[a-zA-Z0-9-_]+$/.test(input) && input.length > 20) {
    return input
  }

  return null
}

const getGoogleDriveImages = async (folderId: string): Promise<string[]> => {
  try {
    // Google Drive API alternative: Use rclone or direct API
    // For now, we'll use a workaround by constructing export URLs
    // In production, you'd use the Google Drive API with proper authentication

    // This constructs preview URLs that work for publicly shared folders
    const imageUrls: string[] = []

    // Since we can't directly list Drive folders without API key in Next.js,
    // we'll return constructed URLs based on the folder ID
    // The user will need to manually extract file IDs or use a helper tool

    // For now, return empty array - will be populated by client-side extraction
    return imageUrls
  } catch (error) {
    console.error("[v0] Error fetching Google Drive images:", error)
    return []
  }
}

const getExistingPhotos = (): GuestPhoto[] => {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, "utf-8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("[v0] Error reading photos:", error)
  }
  return []
}

const savePhotos = (photos: GuestPhoto[]): void => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(photos, null, 2))
  } catch (error) {
    console.error("[v0] Error saving photos:", error)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.replace("Bearer ", "")
    const verified = await verifyAuthToken(token)

    if (!verified) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { gdLink, imageUrls } = req.body

    if (!gdLink && (!imageUrls || imageUrls.length === 0)) {
      return res.status(400).json({
        message: "Please provide Google Drive folder URL or image URLs",
      })
    }

    const existingPhotos = getExistingPhotos()
    const baseId = Math.max(
      ...existingPhotos.map((p) => Number.parseInt(p.id.replace("image-", "")) || 0).concat([2231]),
    )

    const newPhotos: GuestPhoto[] = []
    let imagesAdded = 0

    // If imageUrls are provided (from client-side extraction)
    if (imageUrls && Array.isArray(imageUrls)) {
      imageUrls.forEach((url, index) => {
        const photo: GuestPhoto = {
          id: `image-${baseId + index + 1}`,
          url,
          uploaderName: "admin",
          uploaderEmail: "admin",
          location: "Osogbo, Nigeria",
          date: "27, 2025",
          time: "4:31PM",
          event: "Guest Photos",
          uploadedAt: new Date().toISOString(),
        }
        newPhotos.push(photo)
      })

      imagesAdded = newPhotos.length
    }

    // Combine existing and new photos
    const allPhotos = [...newPhotos, ...existingPhotos]
    savePhotos(allPhotos)

    return res.status(200).json({
      message: `Successfully added ${imagesAdded} images`,
      imagesAdded,
    })
  } catch (error) {
    console.error("[v0] Bulk upload error:", error)
    return res.status(500).json({
      message: "Failed to process images",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
