import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const roles = await prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: roles.map((role) => ({
        id: role.id,
        roleName: role.roleName,
        description: role.description,
        permissions: role.rolePermissions.map((rp) => ({
          id: rp.permission.id,
          key: rp.permission.permissionKey,
          label: rp.permission.permissionLabel,
          resource: rp.permission.resource,
          action: rp.permission.action,
        })),
      })),
    })
  } catch (error) {
    console.error("[GET /api/roles]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
