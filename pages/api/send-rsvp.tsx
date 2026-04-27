import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"
import { checkRateLimit } from "@/lib/rate-limit-utils"

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

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

  const { name, email, guests, attending, message, code } = req.body

  if (!validateInput(name, 100) || !validateEmail(email) || !guests || !attending) {
    return res.status(400).json({ message: "Invalid input format" })
  }

  // Validate guest count
  const guestCount = Number.parseInt(guests)
  if (isNaN(guestCount) || guestCount < 1 || guestCount > 20) {
    return res.status(400).json({ message: "Invalid guest count" })
  }

  // Validate invitation code
  const invitationCode = process.env.INVITATION_CODE || "AYOKEMI25"
  if (code !== invitationCode) {
    return res.status(400).json({ message: "Invalid invitation code" })
  }

  const clientIp = (req.headers["x-forwarded-for"] as string) || (req.headers["x-real-ip"] as string) || "unknown"
  const identifier = `${clientIp}-${email.toLowerCase()}`

  const rateLimitResult = checkRateLimit(identifier, "rsvp")

  if (!rateLimitResult.allowed) {
    console.log(`[v0] Rate limit exceeded for RSVP: ${identifier}`)
    return res.status(429).json({
      message: "Rate limit exceeded",
      resetTime: rateLimitResult.resetTime,
    })
  }

  console.log(`[v0] RSVP rate limit check passed. Remaining: ${rateLimitResult.remaining}`)

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
      console.log("[v0] RSVP transporter verified successfully")
    } catch (verifyError) {
      console.error("[v0] RSVP transporter verification failed:", verifyError)
      return res.status(500).json({ message: "Email service unavailable" })
    }

    const sanitizedName = sanitizeInput(name)
    const sanitizedMessage = message ? sanitizeInput(message) : ""

    const mailOptions = {
      from: emailUser,
      to: emailUser, // Send to admin email
      subject: `Wedding RSVP from ${sanitizedName}`,
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #000;">
          <h2 style="text-align: center; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px;">
            Wedding RSVP Submission
          </h2>
          
          <div style="margin-bottom: 20px;">
            <strong>Name:</strong> ${sanitizedName}
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong>Email:</strong> ${email}
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong>Number of Guests:</strong> ${guestCount}
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong>Attending:</strong> ${attending === "yes" ? "YES, WILL ATTEND" : "SORRY, CANNOT ATTEND"}
          </div>
          
          ${
            sanitizedMessage
              ? `
          <div style="margin-bottom: 20px;">
            <strong>Message:</strong><br>
            <div style="background: #f5f5f5; padding: 15px; margin-top: 10px; border-left: 3px solid #000;">
              ${sanitizedMessage}
            </div>
          </div>
          `
              : ""
          }
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666; font-size: 12px;">
            Submitted on ${new Date().toLocaleString()}
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("[v0] RSVP email sent successfully")

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

      console.log("[v0] Recording RSVP submission...")

      const adminSecretKey = process.env.ADMIN_SECRET_KEY

      if (!adminSecretKey) {
        console.error("[v0] Missing ADMIN_SECRET_KEY")
        // Continue without recording - email was sent successfully
        return res.status(200).json({ message: "RSVP sent successfully" })
      }

      const response = await fetch(`${baseUrl}/api/admin/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecretKey}`,
        },
        body: JSON.stringify({
          type: "rsvp",
          data: {
            name: sanitizedName,
            email: email,
            guests: guestCount,
            attending: attending,
            message: sanitizedMessage,
          },
        }),
      })

      if (response.ok) {
        console.log("[v0] RSVP submission recorded successfully")
      } else {
        console.error("[v0] Submission recording failed with status:", response.status)
      }
    } catch (recordError) {
      console.error("[v0] Submission recording error:", recordError)
      // Don't fail the main request if recording fails
    }

    res.status(200).json({ message: "RSVP sent successfully" })
  } catch (error) {
    console.error("[v0] Error sending RSVP email:", error)
    res.status(500).json({
      message: "Failed to send RSVP. Please try again later.",
    })
  }
}
