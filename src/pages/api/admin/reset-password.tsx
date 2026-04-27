import type { NextApiRequest, NextApiResponse } from "next"
import { resetOtpStore } from "./forgot-password"

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

const validateInput = (input: string, maxLength: number): boolean => {
  return typeof input === "string" && input.trim().length > 0 && input.length <= maxLength
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email, otp, newPassword } = req.body

  if (!validateEmail(email) || !/^\d{6}$/.test(otp) || !validateInput(newPassword, 100)) {
    return res.status(400).json({ message: "Invalid input format" })
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" })
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

  const storedData = resetOtpStore.get(email)

  if (!storedData) {
    return res.status(400).json({ message: "No reset request found. Please start over." })
  }

  if (Date.now() > storedData.expires) {
    resetOtpStore.delete(email)
    return res.status(400).json({ message: "Code has expired. Please start over." })
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ message: "Invalid code. Please start over." })
  }

  try {
    // In a real application, you would update the password in a database
    // For this implementation, we'll update the environment variable
    // NOTE: This requires manual update of the ADMIN_PASSWORD environment variable in Vercel

    console.log(`[v0] Password reset successful for ${email}`)
    console.log(`[v0] IMPORTANT: Update ADMIN_PASSWORD environment variable to: ${newPassword}`)

    // Clear the OTP after successful reset
    resetOtpStore.delete(email)

    res.status(200).json({
      message: "Password reset successful. Please contact the system administrator to update the environment variable.",
      note: "The new password has been logged. Update ADMIN_PASSWORD in your environment variables.",
    })
  } catch (error) {
    console.error("[v0] Error resetting password:", error)
    res.status(500).json({
      message: "Failed to reset password. Please try again later.",
    })
  }
}
