import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyStoredOTP } from "@/lib/otp"
import { createSession } from "@/lib/session-create"
import { z } from "zod"

const verifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = verifyOTPSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 401 }
      )
    }

    // Verify OTP
    const isValid = await verifyStoredOTP(user.id, code)

    if (!isValid) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "MFA_FAILED",
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          timestamp: new Date(),
        },
      }).catch(() => {})

      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 401 }
      )
    }

    // Create session
    const sessionToken = await createSession(
      user.id,
      request.headers.get("x-forwarded-for") || undefined,
      request.headers.get("user-agent") || undefined
    )

    // Log successful MFA
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "MFA_VERIFIED",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date(),
      },
    }).catch(() => {})

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role.roleName,
      },
    })

    // Set session cookie
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Verify OTP error:", error)

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
