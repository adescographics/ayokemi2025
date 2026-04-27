import type { NextApiRequest, NextApiResponse } from "next"
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import formidable from "formidable"
import nodemailer from "nodemailer"

export const config = {
  api: {
    bodyParser: false,
  },
}

interface GuestPhoto {
  id: string
  name: string
  email: string
  event: string
  title: string
  description: string
  location: string
  imageData: string
  uploadedAt: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    console.log("[v0] Upload request received")
    console.log("[v0] Request headers:", req.headers)

    const form = formidable({
      multiples: false,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    })

    const [fields, files] = await form.parse(req)

    console.log("[v0] Parsed fields:", Object.keys(fields))
    console.log("[v0] Parsed files:", Object.keys(files))

    const name = fields.name?.[0] || ""
    const email = fields.email?.[0] || ""
    const event = fields.event?.[0] || ""
    const file = files.file?.[0]

    console.log("[v0] Extracted data:", { name, email, event, hasFile: !!file })

    if (!name || !email || !event) {
      console.log("[v0] Missing required fields")
      return res.status(400).json({ error: "Missing required fields: name, email, and event are required" })
    }

    if (!file) {
      console.log("[v0] No file provided in request")
      return res.status(400).json({ error: "No file provided. Please select an image." })
    }

    if (!file.mimetype?.startsWith("image/")) {
      console.log("[v0] Invalid file type:", file.mimetype)
      return res.status(400).json({ error: "File must be an image" })
    }

    // Read the file and convert to base64
    const fileBuffer = readFileSync(file.filepath)
    const base64Data = fileBuffer.toString("base64")
    const mimeType = file.mimetype

    // Generate unique ID and image number
    const timestamp = Date.now().toString()
    const photosPath = join(process.cwd(), "data", "guest-photos.json")

    let existingPhotos: GuestPhoto[] = []
    if (existsSync(photosPath)) {
      const fileContent = readFileSync(photosPath, "utf-8")
      existingPhotos = JSON.parse(fileContent)
    }

    const maxImageNum = existingPhotos.reduce((max, photo) => {
      const match = photo.title.match(/IMAGE (\d+)/)
      return match ? Math.max(max, Number.parseInt(match[1])) : max
    }, 2200)

    const imageNumber = maxImageNum + 1
    const newPhoto: GuestPhoto = {
      id: timestamp,
      name: name.trim(),
      email: email.trim(),
      event,
      title: `IMAGE ${imageNumber}`,
      description: "Image uploaded by guest",
      location: "Osogbo, Nigeria",
      imageData: `data:${mimeType};base64,${base64Data}`,
      uploadedAt: new Date().toISOString(),
    }

    existingPhotos.push(newPhoto)
    writeFileSync(photosPath, JSON.stringify(existingPhotos, null, 2))

    console.log("[v0] Photo saved successfully. Total photos:", existingPhotos.length)

    // Send email notification
    try {
      const emailUser = process.env.EMAIL_USER
      const emailPass = process.env.EMAIL_PASS

      if (emailUser && emailPass) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number.parseInt(process.env.SMTP_PORT || "465"),
          secure: process.env.SMTP_SECURE !== "false",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        })

        await transporter.sendMail({
          from: emailUser,
          to: "ayowedskemi@gmail.com",
          subject: `New Guest Photo Uploaded - ${newPhoto.title}`,
          html: `
            <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #000;">
              <h2 style="text-align: center; letter-spacing: 2px;">NEW GUEST PHOTO SUBMISSION</h2>
              <hr style="border: 1px solid #000; margin: 20px 0;" />
              <p><strong>Uploader Name:</strong> ${name}</p>
              <p><strong>Uploader Email:</strong> ${email}</p>
              <p><strong>Event:</strong> ${event}</p>
              <p><strong>Photo ID:</strong> ${newPhoto.title}</p>
              <p><strong>Submitted:</strong> ${new Date(newPhoto.uploadedAt).toLocaleString()}</p>
              <hr style="border: 1px solid #000; margin: 20px 0;" />
              <p style="text-align: center; font-size: 12px; color: #666;">Photo has been added to the gallery</p>
            </div>
          `,
        })

        console.log("[v0] Email notification sent successfully")
      }
    } catch (emailError) {
      console.error("[v0] Email notification failed:", emailError)
      // Don't fail the upload if email fails
    }

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully!",
      photo: newPhoto,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    res.status(500).json({ error: "Failed to upload photo. Please try again." })
  }
}
