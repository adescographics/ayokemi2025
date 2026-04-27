import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"

interface PhotoResponse {
  success?: boolean
  message?: string
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PhotoResponse>) {
  if (req.method === "POST") {
    try {
      const { uploaderName, uploaderEmail, event, photoUrl, fileData } = req.body

      if (!uploaderName || !uploaderName.trim()) {
        return res.status(400).json({ error: "Name is required" })
      }
      if (!uploaderEmail || !uploaderEmail.trim()) {
        return res.status(400).json({ error: "Email is required" })
      }
      if (!event || !event.trim()) {
        return res.status(400).json({ error: "Event category is required" })
      }
      if (!photoUrl && !fileData) {
        return res.status(400).json({ error: "Image URL or file is required" })
      }

      const emailUser = process.env.EMAIL_USER
      const emailPass = process.env.EMAIL_PASS

      if (!emailUser || !emailPass) {
        console.error("[v0] Missing email credentials")
        return res.status(500).json({ error: "Email service configuration error" })
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        secure: true,
        port: 465,
        tls: {
          rejectUnauthorized: true,
        },
        pool: false,
        maxConnections: 1,
        maxMessages: 1,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      })

      try {
        await transporter.verify()
        console.log("[v0] Photo upload transporter verified")
      } catch (verifyError) {
        console.error("[v0] Transporter verification failed:", verifyError)
        return res.status(500).json({ error: "Email service unavailable" })
      }

      const finalImageUrl = photoUrl || fileData
      const adminEmail = "ayowedskemi@gmail.com"

      const mailOptions = {
        from: emailUser,
        to: adminEmail,
        subject: `New Photo Upload from ${uploaderName} - ${event}`,
        html: `
          <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #000;">
            <h2 style="text-align: center; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px;">
              New Guest Photo Submission
            </h2>
            
            <div style="margin-bottom: 20px;">
              <strong>Name:</strong> ${uploaderName}
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong>Email:</strong> ${uploaderEmail}
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong>Event:</strong> ${event}
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong>Image URL:</strong><br>
              <a href="${finalImageUrl}" style="color: #0066cc; word-break: break-all;">${finalImageUrl}</a>
            </div>

            <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-left: 3px solid #000;">
              <strong>Preview:</strong><br>
              <img src="${finalImageUrl}" alt="Guest photo" style="max-width: 100%; max-height: 300px; margin-top: 10px;">
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666; font-size: 12px;">
              Submitted on ${new Date().toLocaleString()}
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
      console.log("[v0] Photo upload email sent to admin")

      res.status(200).json({
        success: true,
        message: "Photo submitted successfully! We have received your submission and will review it shortly.",
      })
    } catch (error) {
      console.error("[v0] Photo upload error:", error)
      res.status(500).json({
        error: "Failed to submit photo. Please try again later.",
      })
    }
  } else if (req.method === "GET") {
    res.status(200).json({ photos: [] })
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
