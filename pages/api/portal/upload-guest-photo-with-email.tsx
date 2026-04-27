import type { NextApiRequest, NextApiResponse } from "next"
import { IncomingForm } from "formidable"
import fs from "fs"
import path from "path"
import nodemailer from "nodemailer"

interface Photo {
  id: string
  title: string
  image: string
  uploaderName: string
  uploaderEmail: string
  date: string
  time: string
  location: string
  category: string
  likes: number
  viewers: number
}

const PHOTOS_FILE = path.join(process.cwd(), "data", "guest-photos.json")

const readPhotos = (): Photo[] => {
  try {
    if (!fs.existsSync(PHOTOS_FILE)) {
      return []
    }
    const data = fs.readFileSync(PHOTOS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.log("[v0] Could not read photos file:", error)
    return []
  }
}

const writePhotos = (photos: Photo[]) => {
  try {
    const dataDir = path.dirname(PHOTOS_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2))
  } catch (error) {
    console.log("[v0] Could not write photos file:", error)
  }
}

const parseForm = (req: NextApiRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "tmp"),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    })

    // Create tmp directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), "tmp"))) {
      fs.mkdirSync(path.join(process.cwd(), "tmp"), { recursive: true })
    }

    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { fields, files } = await parseForm(req)

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email
    const event = Array.isArray(fields.event) ? fields.event[0] : fields.event
    const file = Array.isArray(files.file) ? files.file[0] : files.file

    if (!name || !email || !event) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const fileData = fs.readFileSync(file.filepath)
    const base64Image = fileData.toString("base64")
    const mimeType = file.mimetype || "image/jpeg"
    const imageString = `data:${mimeType};base64,${base64Image}`

    const photoId = `${Date.now()}-photo`
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })

    const photos = readPhotos()
    const imageNumber = photos.filter((p) => p.category === "Guest Photos").length + 1

    const newPhoto: Photo = {
      id: photoId,
      title: `IMAGE ${2200 + imageNumber}`,
      image: imageString,
      uploaderName: name.trim(),
      uploaderEmail: email.trim(),
      date: dateStr,
      time: timeStr,
      location: "Osogbo, Nigeria",
      category: event,
      likes: 0,
      viewers: 0,
    }

    photos.push(newPhoto)
    writePhotos(photos)

    try {
      const emailUser = process.env.EMAIL_USER
      const emailPass = process.env.EMAIL_PASS

      if (emailUser && emailPass) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        })

        await transporter.sendMail({
          from: emailUser,
          to: "ayowedskemi@gmail.com",
          subject: `New Guest Photo Submission from ${name}`,
          html: `
            <h2>New Guest Photo Uploaded</h2>
            <p><strong>Uploader Name:</strong> ${name}</p>
            <p><strong>Uploader Email:</strong> ${email}</p>
            <p><strong>Event:</strong> ${event}</p>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Time:</strong> ${timeStr}</p>
            <p>The photo has been added to the gallery.</p>
          `,
        })

        console.log("[v0] Email notification sent successfully")
      }
    } catch (emailError) {
      console.log("[v0] Email notification failed (non-critical):", emailError)
    }

    try {
      fs.unlinkSync(file.filepath)
    } catch (err) {
      console.log("[v0] Could not delete temp file:", err)
    }

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully!",
      photo: {
        id: newPhoto.id,
        title: newPhoto.title,
      },
    })
  } catch (error) {
    console.error("[v0] Error uploading photo:", error)
    res.status(500).json({
      error: "Failed to upload photo. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
