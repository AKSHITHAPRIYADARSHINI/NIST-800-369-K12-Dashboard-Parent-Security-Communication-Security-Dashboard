import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdateMFASchema = z.object({
  mfaEnabled: z.boolean(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const body = await request.json()
    const { mfaEnabled } = UpdateMFASchema.parse(body)

    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { mfaEnabled },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "update_mfa_policy",
      targetType: "User",
      targetId: id,
      changes: { mfaEnabled },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        mfaEnabled: updatedUser.mfaEnabled,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/users/:id/mfa-policy]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
