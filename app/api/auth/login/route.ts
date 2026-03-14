import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/password"
import { createSession } from "@/lib/session-create"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    })

    if (!user) {
      // Return generic message to prevent email enumeration
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check account status
    if (user.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 401 }
      )
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash)

    if (!passwordValid) {
      // Log failed attempt
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN_FAILED",
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          timestamp: new Date(),
        },
      }).catch(() => {})

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(() => {})

    // Check if MFA is enabled
    if (user.mfaEnabled && user.mfaType) {
      // Return MFA required response
      return NextResponse.json({
        success: false,
        mfaRequired: true,
        mfaType: user.mfaType,
        email: user.email,
      })
    }

    // Create session (if no MFA)
    const sessionToken = await createSession(
      user.id,
      request.headers.get("x-forwarded-for") || undefined,
      request.headers.get("user-agent") || undefined
    )

    // Log successful login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN_SUCCESS",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date(),
      },
    }).catch(() => {})

    // Create response
    const response = NextResponse.json({
      success: true,
      mfaRequired: false,
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
      maxAge: 30 * 60, // 30 minutes
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error instanceof Error ? error.message : error)
    console.error("Full error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      )
    }

    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: "Internal server error", details: errorMsg },
      { status: 500 }
    )
  }
}
