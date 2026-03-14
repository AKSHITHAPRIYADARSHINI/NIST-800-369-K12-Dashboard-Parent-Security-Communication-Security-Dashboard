import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const domainScores = await prisma.domainScore.findMany()

    const overall = domainScores.length > 0 ? domainScores.reduce((sum, d) => sum + d.score, 0) / domainScores.length : 0

    return NextResponse.json({
      success: true,
      data: {
        overall: Math.round(overall),
        domains: domainScores,
      },
    })
  } catch (error) {
    console.error("[GET /api/compliance/score]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
