import type { NextApiRequest, NextApiResponse } from "next"
import { resetOtpStore } from "./forgot-password"

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email, otp } = req.body

  if (!validateEmail(email) || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "Invalid input format" })
  }

  const storedData = resetOtpStore.get(email)

  if (!storedData) {
    return res.status(400).json({ message: "No reset request found. Please request a new code." })
  }

  if (Date.now() > storedData.expires) {
    resetOtpStore.delete(email)
    return res.status(400).json({ message: "Code has expired. Please request a new one." })
  }

  if (storedData.attempts >= 5) {
    resetOtpStore.delete(email)
    return res.status(429).json({ message: "Too many attempts. Please request a new code." })
  }

  if (storedData.otp !== otp) {
    storedData.attempts += 1
    return res.status(400).json({
      message: `Invalid code. ${5 - storedData.attempts} attempts remaining.`,
    })
  }

  console.log(`[v0] Password reset OTP verified for ${email}`)

  res.status(200).json({ message: "Code verified successfully" })
}
