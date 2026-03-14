import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { logAccess } from "@/lib/access-log"
import { hashPassword, validatePasswordStrength } from "@/lib/password"
import { z } from "zod"

const CreateUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(12),
  roleId: z.string(),
})

type CreateUserInput = z.infer<typeof CreateUserSchema>

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const roleFilter = searchParams.get("role")
  const searchQuery = searchParams.get("search")

  try {
    const where: any = {}
    if (roleFilter) {
      where.role = { roleName: roleFilter }
    }
    if (searchQuery) {
      where.OR = [
        { fullName: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
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

    await logAccess({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: "list_users",
      resource: "users",
      result: "SUCCESS",
    })

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    })
  } catch (error) {
    console.error("[GET /api/users]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  try {
    const body = await request.json()
    const { fullName, email, password, roleId } = CreateUserSchema.parse(body)

    const validation = validatePasswordStrength(password)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: "Password does not meet requirements", details: validation.errors },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        roleId,
      },
      include: {
        role: true,
      },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "create_user",
      targetType: "User",
      targetId: newUser.id,
      changes: { created: { id: newUser.id, email: newUser.email, fullName: newUser.fullName } },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          roleId: newUser.roleId,
          accountStatus: newUser.accountStatus,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[POST /api/users]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
