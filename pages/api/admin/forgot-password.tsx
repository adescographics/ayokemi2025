import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"
import crypto from "crypto"

// Store reset OTPs temporarily (in production, use Redis or database)
const resetOtpStore = new Map<string, { otp: string; expires: number; attempts: number }>()

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email } = req.body

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" })
  }

  const adminEmail = process.env.ADMIN_EMAIL

  if (!adminEmail) {
    console.error("[v0] Missing admin email in environment variables")
    return res.status(500).json({ message: "Server configuration error" })
  }

  // Verify this is the admin email
  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return res.status(404).json({ message: "Email not found" })
  }

  try {
    const otp = crypto.randomInt(100000, 999999).toString()

    // Store OTP with 5-minute expiration
    resetOtpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
    })

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
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    })

    try {
      await transporter.verify()
      console.log("[v0] Password reset transporter verified successfully")
    } catch (verifyError) {
      console.error("[v0] Password reset transporter verification failed:", verifyError)
      return res.status(500).json({ message: "Email service unavailable" })
    }

    const mailOptions = {
      from: `"Wedding Admin" <${emailUser}>`,
      to: email,
      subject: "Password Reset Code - Wedding Website",
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #000;">
          <h2 style="text-align: center; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px;">
            Password Reset Request
          </h2>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #f5f5f5; padding: 20px; border: 2px solid #000; display: inline-block;">
              <h3 style="margin: 0; font-size: 32px; letter-spacing: 8px; color: #000;">
                ${otp}
              </h3>
            </div>
          </div>
          
          <p style="text-align: center; margin: 20px 0; line-height: 1.6;">
            Your password reset verification code is above.<br>
            This code will expire in 5 minutes.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666; font-size: 12px;">
            Generated on ${new Date().toLocaleString()}<br>
            If you didn't request this, please ignore this email.
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`[v0] Password reset OTP sent successfully to ${email}`)

    res.status(200).json({ message: "Reset code sent successfully" })
  } catch (error) {
    console.error("[v0] Error sending password reset OTP:", error)
    res.status(500).json({
      message: "Failed to send reset code. Please try again later.",
    })
  }
}

// Clean up expired OTPs every hour
setInterval(
  () => {
    const now = Date.now()
    for (const [email, data] of resetOtpStore.entries()) {
      if (data.expires < now) {
        resetOtpStore.delete(email)
      }
    }
  },
  60 * 60 * 1000,
)

export { resetOtpStore }
