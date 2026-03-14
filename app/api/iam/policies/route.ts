import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdatePoliciesSchema = z.object({
  roleId: z.string(),
  permissionIds: z.array(z.string()),
})

export async function PUT(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  try {
    const body = await request.json()
    const { roleId, permissionIds } = UpdatePoliciesSchema.parse(body)

    const role = await prisma.role.findUnique({ where: { id: roleId } })
    if (!role) {
      return NextResponse.json({ success: false, error: "Role not found" }, { status: 404 })
    }

    // Verify all permissions exist
    const permissions = await prisma.permission.findMany({
      where: { id: { in: permissionIds } },
    })
    if (permissions.length !== permissionIds.length) {
      return NextResponse.json({ success: false, error: "Some permissions not found" }, { status: 404 })
    }

    // Use transaction to delete old and create new role permissions
    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId } }),
      ...permissionIds.map((permissionId) =>
        prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
        })
      ),
    ])

    await logAuditEvent({
      userId: user.userId,
      action: "update_role_permissions",
      targetType: "Role",
      targetId: roleId,
      changes: { permissionIds },
    })

    const updatedRole = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedRole!.id,
        roleName: updatedRole!.roleName,
        permissions: updatedRole!.rolePermissions.map((rp) => ({
          id: rp.permission.id,
          key: rp.permission.permissionKey,
          label: rp.permission.permissionLabel,
        })),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/iam/policies]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
