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
  const search = searchParams.get("search")
  const riskOnly = searchParams.get("riskOnly") === "true"
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  try {
    const where: any = {}

    if (search) {
      where.OR = [
        { userEmail: { contains: search, mode: "insensitive" } },
        { action: { contains: search, mode: "insensitive" } },
        { resource: { contains: search, mode: "insensitive" } },
      ]
    }

    if (riskOnly) {
      where.riskFlag = true
    }

    if (from || to) {
      where.timestamp = {}
      if (from) where.timestamp.gte = new Date(from)
      if (to) where.timestamp.lte = new Date(to)
    }

    const [logs, total] = await Promise.all([
      prisma.accessLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.accessLog.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[GET /api/access-logs]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
