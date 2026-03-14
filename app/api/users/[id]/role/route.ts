import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const AssignRoleSchema = z.object({
  roleId: z.string(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const body = await request.json()
    const { roleId } = AssignRoleSchema.parse(body)

    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const role = await prisma.role.findUnique({ where: { id: roleId } })
    if (!role) {
      return NextResponse.json({ success: false, error: "Role not found" }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { roleId },
      include: { role: true },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "assign_role",
      targetType: "User",
      targetId: id,
      changes: { roleId, previousRoleId: targetUser.roleId },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        roleId: updatedUser.roleId,
        roleName: updatedUser.role.roleName,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/users/:id/role]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
