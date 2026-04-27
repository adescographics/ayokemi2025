import type { NextApiRequest, NextApiResponse } from "next"
import { otpStore } from "./login"

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email, otp } = req.body

  if (!validateEmail(email) || !validateOTP(otp)) {
    return res.status(400).json({ message: "Invalid input format" })
  }

  const storedData = otpStore.get(email)

  if (!storedData) {
    return res.status(401).json({ message: "OTP not found or expired" })
  }

  // Check if OTP is expired
  if (Date.now() > storedData.expires) {
    otpStore.delete(email)
    return res.status(401).json({ message: "OTP has expired" })
  }

  if (storedData.attempts >= 3) {
    otpStore.delete(email)
    return res.status(429).json({ message: "Too many failed attempts. Please request a new OTP." })
  }

  // Verify OTP
  if (storedData.otp !== otp) {
    storedData.attempts++
    return res.status(401).json({ message: "Invalid OTP" })
  }

  // OTP is valid, clean up
  otpStore.delete(email)

  console.log(`[v0] Admin successfully authenticated: ${email}`)

  const { generateAuthToken } = await import("@/lib/auth-utils")
  const token = await generateAuthToken(email)

  res.status(200).json({
    message: "OTP verified successfully",
    authenticated: true,
    timestamp: Date.now(),
    token, // Send JWT token instead of secret key
  })
}
