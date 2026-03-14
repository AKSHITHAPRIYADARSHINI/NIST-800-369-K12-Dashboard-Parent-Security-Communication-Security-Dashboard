import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1")
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
  const action = searchParams.get("action")
  const targetType = searchParams.get("targetType")

  try {
    const where: any = {}
    if (action) where.action = { contains: action, mode: "insensitive" }
    if (targetType) where.targetType = targetType

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { timestamp: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: logs.map((log) => ({
        id: log.id,
        timestamp: log.timestamp,
        userId: log.userId,
        user: log.user ? { id: log.user.id, fullName: log.user.fullName, email: log.user.email } : null,
        action: log.action,
        targetType: log.targetType,
        targetId: log.targetId,
        changes: log.changes,
        ipAddress: log.ipAddress,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[GET /api/audit-trail]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
