import { SignJWT, jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_SECRET_KEY)

if (!process.env.ADMIN_SECRET_KEY) {
  console.error("[SECURITY] ADMIN_SECRET_KEY environment variable is not set!")
}

export async function generateAuthToken(email: string): Promise<string> {
  if (!process.env.ADMIN_SECRET_KEY) {
    throw new Error("ADMIN_SECRET_KEY is not configured")
  }

  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(SECRET_KEY)

  return token
}

export async function verifyAuthToken(token: string): Promise<{ email: string } | null> {
  try {
    if (!process.env.ADMIN_SECRET_KEY) {
      throw new Error("ADMIN_SECRET_KEY is not configured")
    }

    const { payload } = await jwtVerify(token, SECRET_KEY)
    return { email: payload.email as string }
  } catch (error) {
    console.error("[Ayokemi2025] Token verification failed:", error)
    return null
  }
}

export function verifyAdminToken(token: string): boolean {
  if (!token) return false

  try {
    if (!process.env.ADMIN_SECRET_KEY) {
      console.error("[SECURITY] ADMIN_SECRET_KEY is not configured")
      return false
    }

    const isValid = token === process.env.ADMIN_SECRET_KEY
    return isValid
  } catch (error) {
    console.error("[Ayokemi2025] Admin token verification failed:", error)
    return false
  }
}
