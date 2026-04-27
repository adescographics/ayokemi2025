import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"
import { checkRateLimit } from "@/lib/rate-limit-utils"

const validateInput = (input: string, maxLength: number): boolean => {
  return typeof input === "string" && input.trim().length > 0 && input.length <= maxLength
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "").trim()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, message } = req.body

  if (!validateInput(name, 100) || !validateInput(message, 1000)) {
    return res.status(400).json({ message: "Invalid input format" })
  }

  const clientIp = (req.headers["x-forwarded-for"] as string) || (req.headers["x-real-ip"] as string) || "unknown"
  const identifier = `${clientIp}-${name.toLowerCase()}`

  const rateLimitResult = checkRateLimit(identifier, "wish")

  if (!rateLimitResult.allowed) {
    console.log(`[v0] Rate limit exceeded for wishes: ${identifier}`)
    return res.status(429).json({
      message: "Rate limit exceeded",
      resetTime: rateLimitResult.resetTime,
    })
  }

  console.log(`[v0] Wishes rate limit check passed. Remaining: ${rateLimitResult.remaining}`)

  try {
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (!emailUser || !emailPass) {
      console.error("[v0] Missing email credentials in environment variables")
      return res.status(500).json({ message: "Email configuration error" })
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
      console.log("[v0] Wishes transporter verified successfully")
    } catch (verifyError) {
      console.error("[v0] Wishes transporter verification failed:", verifyError)
      return res.status(500).json({ message: "Email service unavailable" })
    }

    const sanitizedName = sanitizeInput(name)
    const sanitizedMessage = sanitizeInput(message)

    const mailOptions = {
      from: emailUser,
      to: emailUser, // Send to admin email
      subject: `Wedding Wishes from ${sanitizedName}`,
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #000;">
          <h2 style="text-align: center; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px;">
            Wedding Wishes & Prayers
          </h2>
          
          <div style="margin-bottom: 20px;">
            <strong>From:</strong> ${sanitizedName}
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong>Message:</strong><br>
            <div style="background: #f5f5f5; padding: 20px; margin-top: 10px; border-left: 3px solid #000; line-height: 1.6;">
              ${sanitizedMessage.replace(/\n/g, "<br>")}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666; font-size: 12px;">
            Submitted on ${new Date().toLocaleString()}
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("[v0] Wishes email sent successfully")

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

      console.log("[v0] Recording wishes submission...")

      const adminSecretKey = process.env.ADMIN_SECRET_KEY

      if (!adminSecretKey) {
        console.error("[v0] Missing ADMIN_SECRET_KEY")
        // Continue without recording - email was sent successfully
        return res.status(200).json({ message: "Wishes sent successfully" })
      }

      const response = await fetch(`${baseUrl}/api/admin/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecretKey}`,
        },
        body: JSON.stringify({
          type: "wish",
          data: {
            name: sanitizedName,
            message: sanitizedMessage,
          },
        }),
      })

      if (response.ok) {
        console.log("[v0] Wishes submission recorded successfully")
      } else {
        console.error("[v0] Submission recording failed with status:", response.status)
      }
    } catch (recordError) {
      console.error("[v0] Submission recording error:", recordError)
      // Don't fail the main request if recording fails
    }

    res.status(200).json({ message: "Wishes sent successfully" })
  } catch (error) {
    console.error("[v0] Error sending wishes email:", error)
    res.status(500).json({
      message: "Failed to send wishes. Please try again later.",
    })
  }
}
