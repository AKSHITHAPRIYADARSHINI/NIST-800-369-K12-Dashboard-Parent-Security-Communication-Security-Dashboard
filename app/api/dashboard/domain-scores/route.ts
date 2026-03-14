import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const domainScores = await prisma.domainScore.findMany({
      orderBy: { score: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: domainScores.map((ds) => ({
        id: ds.id,
        domain: ds.domain,
        score: ds.score,
        trend: ds.trend,
        lastCalculatedAt: ds.lastCalculatedAt,
      })),
    })
  } catch (error) {
    console.error("[GET /api/dashboard/domain-scores]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
