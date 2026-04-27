import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"
import { IncomingForm } from "formidable"
import * as fs from "fs"
import { checkRateLimit } from "@/lib/rate-limit-utils"

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "").trim()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const clientIp = (req.headers["x-forwarded-for"] as string) || (req.headers["x-real-ip"] as string) || "unknown"

  try {
    const form = new IncomingForm()
    const [fields, files] = await form.parse(req)

    // Extract form fields
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description
    const date = Array.isArray(fields.date) ? fields.date[0] : fields.date
    const time = Array.isArray(fields.time) ? fields.time[0] : fields.time
    const event = Array.isArray(fields.event) ? fields.event[0] : fields.event

    // Validate required fields
    if (!name || !email || !date || !time || !event) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    // Check if image was uploaded
    const imageFile = files.image?.[0]
    if (!imageFile) {
      return res.status(400).json({ message: "Image is required" })
    }

    // Rate limiting
    const identifier = `${clientIp}-${email.toLowerCase()}`
    const rateLimitResult = checkRateLimit(identifier, "guest-photo-upload")

    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        message: "Too many uploads. Please try again later.",
        resetTime: rateLimitResult.resetTime,
      })
    }

    // Setup email transporter
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (!emailUser || !emailPass) {
      console.error("[v0] Missing email credentials")
      return res.status(500).json({ message: "Email service unavailable" })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      secure: true,
      port: 465,
    })

    const sanitizedName = sanitizeInput(name as string)
    const sanitizedDescription = description ? sanitizeInput(description as string) : "No description provided"

    // Read the image file and convert to base64
    const imageBuffer = fs.readFileSync(imageFile.filepath)

    // Send email with referenced image instead of embedded base64
    const mailOptions = {
      from: emailUser,
      to: "ayowedskemi@gmail.com",
      subject: `Guest Photo Submission from ${sanitizedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #000;">
          <h2 style="text-align: center; text-transform: uppercase; letter-spacing: 2px;">Guest Photo Submission</h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5;">
            <p><strong>Name:</strong> ${sanitizedName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Event Category:</strong> ${event}</p>
            <p><strong>Description:</strong> ${sanitizedDescription}</p>
          </div>

          <div style="margin: 20px 0;">
            <p><strong>Photo:</strong></p>
            <p style="font-size: 14px; color: #666; font-style: italic;">
              Image has been received and will be reviewed. The photo is stored securely and will be added to the gallery.
            </p>
          </div>

          <hr style="border: none; border-top: 2px solid #000; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `,
      attachments: [
        {
          filename: imageFile.originalFilename || "image.jpg",
          content: imageBuffer,
          contentType: imageFile.mimetype,
        },
      ],
    }

    await transporter.sendMail(mailOptions)

    // Clean up temp file
    fs.unlinkSync(imageFile.filepath)

    return res.status(200).json({
      message: "Photo uploaded successfully and email sent",
      success: true,
    })
  } catch (error) {
    console.error("[v0] Photo upload error:", error)
    return res.status(500).json({
      message: "Failed to process upload. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
