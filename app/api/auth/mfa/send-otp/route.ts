import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateOTP, hashOTP, sendOTPEmail, storeOTP } from "@/lib/otp"
import { z } from "zod"

const sendOTPSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = sendOTPSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Generic response to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: "If account exists, OTP has been sent",
      })
    }

    // Generate OTP
    const otp = generateOTP()
    const hashedOTP = await hashOTP(otp)

    // Store OTP
    await storeOTP(user.id, hashedOTP)

    // Send email
    const emailResult = await sendOTPEmail(email, otp)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send OTP email" },
        { status: 500 }
      )
    }

    // Log OTP send
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "OTP_SENT",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date(),
      },
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    })
  } catch (error) {
    console.error("Send OTP error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
