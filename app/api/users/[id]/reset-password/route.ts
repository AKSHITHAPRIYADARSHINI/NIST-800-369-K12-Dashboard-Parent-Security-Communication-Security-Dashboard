import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { hashPassword, validatePasswordStrength } from "@/lib/password"
import { z } from "zod"

const ResetPasswordSchema = z.object({
  newPassword: z.string().min(12),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const body = await request.json()
    const { newPassword } = ResetPasswordSchema.parse(body)

    const validation = validatePasswordStrength(newPassword)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: "Password does not meet requirements", details: validation.errors },
        { status: 400 }
      )
    }

    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const passwordHash = await hashPassword(newPassword)

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        lastPasswordChangeAt: new Date(),
      },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "reset_password",
      targetType: "User",
      targetId: id,
      changes: { passwordReset: true },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        lastPasswordChangeAt: updatedUser.lastPasswordChangeAt,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[POST /api/users/:id/reset-password]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
