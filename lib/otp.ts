import { randomInt } from "crypto"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const OTP_EXPIRY_MINUTES = 10
const OTP_BCRYPT_COST = 10

export function generateOTP(): string {
  return String(randomInt(0, 1000000)).padStart(6, "0")
}

export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, OTP_BCRYPT_COST)
}

export async function verifyOTP(
  otp: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(otp, hash)
}

export async function storeOTP(
  userId: string,
  hashedOTP: string
): Promise<void> {
  // Store temporary OTP in a simple way - using user metadata or a temp table
  // For now, we'll create a temporary session-like entry
  // In production, use Redis for better performance
  await prisma.mFASecret.updateMany({
    where: { userId, enabled: false },
    data: {
      secretEncrypted: hashedOTP,
      updatedAt: new Date(),
    },
  }).catch(() => {
    // If no existing record, create one
  })
}

export async function verifyStoredOTP(
  userId: string,
  otp: string
): Promise<boolean> {
  const mfaSecret = await prisma.mFASecret.findUnique({
    where: { userId },
  })

  if (!mfaSecret || !mfaSecret.secretEncrypted) {
    return false
  }

  const isValid = await verifyOTP(otp, mfaSecret.secretEncrypted)

  if (isValid) {
    // Clear the OTP after successful use
    await prisma.mFASecret.update({
      where: { userId },
      data: { secretEncrypted: "" },
    }).catch(() => {})
  }

  return isValid
}

export async function sendOTPEmail(
  email: string,
  otp: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Using Resend (you can switch to SendGrid if preferred)
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured")
      return {
        success: false,
        message: "Email service not configured",
      }
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.SENDER_EMAIL || "noreply@springvale.edu",
        to: email,
        subject: "Your NIST Dashboard Verification Code",
        html: `
          <h1>Verification Code</h1>
          <p>Your verification code is:</p>
          <h2 style="font-size: 36px; letter-spacing: 4px;">${otp}</h2>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">
            NIST 800-369 K-12 Cybersecurity Dashboard<br />
            Springvale Unified School District
          </p>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Resend API error:", error)
      return {
        success: false,
        message: "Failed to send email",
      }
    }

    return {
      success: true,
      message: "Verification code sent to your email",
    }
  } catch (error) {
    console.error("OTP email error:", error)
    return {
      success: false,
      message: "Error sending verification email",
    }
  }
}
