import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const CreateVendorSchema = z.object({
  name: z.string(),
  service: z.string(),
  dataSensitivity: z.enum(["LOW", "MEDIUM", "HIGH"]),
  riskStatus: z.enum(["APPROVED", "UNDER_REVIEW", "AT_RISK", "REJECTED"]),
  contractStatus: z.enum(["ACTIVE", "EXPIRED", "PENDING", "TERMINATED"]),
  contractExpiry: z.string().optional(),
  dataAccess: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const riskStatus = searchParams.get("riskStatus")
  const search = searchParams.get("search")

  try {
    const where: any = {}
    if (riskStatus) where.riskStatus = riskStatus
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { service: { contains: search, mode: "insensitive" } },
      ]
    }

    const vendors = await prisma.vendor.findMany({
      where,
      include: { assessment: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ success: true, data: vendors })
  } catch (error) {
    console.error("[GET /api/vendors]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  try {
    const body = await request.json()
    const data = CreateVendorSchema.parse(body)

    const vendor = await prisma.vendor.create({
      data: {
        ...data,
        contractExpiry: data.contractExpiry ? new Date(data.contractExpiry) : undefined,
        lastReview: new Date(),
      },
      include: { assessment: true },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "create_vendor",
      targetType: "Vendor",
      targetId: vendor.id,
      changes: { created: { id: vendor.id, name: vendor.name } },
    })

    return NextResponse.json({ success: true, data: vendor }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[POST /api/vendors]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
