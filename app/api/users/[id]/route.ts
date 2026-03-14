import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdateUserSchema = z.object({
  fullName: z.string().optional(),
  accountStatus: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  mfaEnabled: z.boolean().optional(),
})

type UpdateUserInput = z.infer<typeof UpdateUserSchema>

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    })

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: targetUser })
  } catch (error) {
    console.error("[GET /api/users/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const body = await request.json()
    const updates = UpdateUserSchema.parse(body)

    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updates,
      include: { role: true },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "update_user",
      targetType: "User",
      targetId: id,
      changes: updates,
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        accountStatus: updatedUser.accountStatus,
        mfaEnabled: updatedUser.mfaEnabled,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/users/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const deletedUser = await prisma.user.update({
      where: { id },
      data: { accountStatus: "INACTIVE" },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "deactivate_user",
      targetType: "User",
      targetId: id,
      changes: { accountStatus: "INACTIVE" },
    })

    return NextResponse.json({
      success: true,
      data: { id: deletedUser.id, accountStatus: deletedUser.accountStatus },
    })
  } catch (error) {
    console.error("[DELETE /api/users/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
