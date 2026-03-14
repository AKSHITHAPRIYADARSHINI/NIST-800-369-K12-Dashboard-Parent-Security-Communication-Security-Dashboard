import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const domain = searchParams.get("domain")
  const status = searchParams.get("status")
  const type = searchParams.get("type")
  const search = searchParams.get("search")

  try {
    const where: any = {}
    if (domain) where.domain = domain
    if (status) where.status = status
    if (type) where.type = type
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { controlId: { contains: search, mode: "insensitive" } },
      ]
    }

    const controls = await prisma.controlMapping.findMany({
      where,
      orderBy: { controlId: "asc" },
    })

    const summary = {
      total: controls.length,
      done: controls.filter((c) => c.status === "DONE").length,
      inProcess: controls.filter((c) => c.status === "IN_PROCESS").length,
      notStarted: controls.filter((c) => c.status === "NOT_STARTED").length,
      notApplicable: controls.filter((c) => c.status === "NOT_APPLICABLE").length,
    }

    return NextResponse.json({
      success: true,
      data: controls,
      summary,
    })
  } catch (error) {
    console.error("[GET /api/controls]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
