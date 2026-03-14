import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const alerts = await prisma.deviceAlert.findMany({
      where: { acknowledged: false },
      include: { device: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: alerts })
  } catch (error) {
    console.error("[GET /api/devices/alerts]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
